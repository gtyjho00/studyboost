import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: { name: 'StudyBoost AI', version: '1.0.0' },
});

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature found', { status: 400, headers: corsHeaders });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400, headers: corsHeaders });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};
  if (!stripeData || !('customer' in stripeData)) return;

  const { customer: customerId } = stripeData;
  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;
    const isSubscription = mode === 'subscription';

    if (isSubscription) {
      console.info(`Processing subscription checkout for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
      await updateProfilePremium(customerId, true);
    } else if (mode === 'payment' && payment_status === 'paid') {
      try {
        const { id: checkout_session_id, payment_intent, amount_subtotal, amount_total, currency } = stripeData as Stripe.Checkout.Session;
        const { error: orderError } = await supabase.from('stripe_orders').insert({
          checkout_session_id,
          payment_intent_id: payment_intent,
          customer_id: customerId,
          amount_subtotal,
          amount_total,
          currency,
          payment_status,
          status: 'completed',
        });
        if (orderError) console.error('Error inserting order:', orderError);
      } catch (error) {
        console.error('Error processing one-time payment:', error);
      }
    }
  }

  if (event.type === 'customer.subscription.updated') {
    await syncCustomerFromStripe(customerId);
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 1, status: 'all' });
    const sub = subscriptions.data[0];
    if (sub && (sub.status === 'active' || sub.status === 'trialing')) {
      await updateProfilePremium(customerId, true);
    } else if (sub && (sub.status === 'canceled' || sub.status === 'unpaid' || sub.status === 'past_due')) {
      await updateProfilePremium(customerId, false);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    await syncCustomerFromStripe(customerId);
    await updateProfilePremium(customerId, false);
  }
}

async function updateProfilePremium(customerId: string, premium: boolean) {
  // Look up user_id from stripe_customers
  const { data: customer } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('customer_id', customerId)
    .is('deleted_at', null)
    .maybeSingle();

  if (!customer) {
    console.error(`No user found for customer ${customerId}`);
    return;
  }

  // Get subscription end date for premium_expires_at
  let expiresAt = null;
  if (premium) {
    const { data: sub } = await supabase
      .from('stripe_subscriptions')
      .select('current_period_end')
      .eq('customer_id', customerId)
      .maybeSingle();

    if (sub?.current_period_end) {
      expiresAt = new Date(sub.current_period_end * 1000).toISOString();
    }
  }

  const update: Record<string, any> = { premium };
  if (expiresAt) update.premium_expires_at = expiresAt;
  if (premium) {
    update.stripe_customer_id = customerId;
  }

  const { error } = await supabase
    .from('profiles')
    .update(update)
    .eq('id', customer.user_id);

  if (error) {
    console.error(`Failed to update profile premium for user ${customer.user_id}:`, error);
  } else {
    console.info(`Updated profile premium=${premium} for user ${customer.user_id}`);
  }
}

async function syncCustomerFromStripe(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      await supabase.from('stripe_subscriptions').upsert(
        { customer_id: customerId, subscription_status: 'not_started' },
        { onConflict: 'customer_id' },
      );
      return;
    }

    const subscription = subscriptions.data[0];

    const { error } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
      },
      { onConflict: 'customer_id' },
    );

    if (error) {
      console.error('Error syncing subscription:', error);
      throw new Error('Failed to sync subscription in database');
    }
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}
