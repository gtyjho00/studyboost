export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'subscription';
  interval: 'month' | 'year';
  features: string[];
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_UUAA4cArSWQrDf',
    priceId: 'price_1TVBqRFYOrbRBvjlwJUubxN9',
    name: 'Premium Mensal',
    description: 'Acesso completo a todas as funcionalidades',
    price: 19.90,
    currency: 'BRL',
    mode: 'subscription',
    interval: 'month',
    features: [
      'Acesso ilimitado a todas as lições',
      'Exercícios personalizados',
      'Relatórios de progresso detalhados',
      'Suporte prioritário'
    ]
  },
  {
    id: 'prod_UUACWHRV7IKbIj',
    priceId: 'price_1TVBrmFYOrbRBvjlvddVpDlY',
    name: 'Premium Anual',
    description: 'Acesso completo com desconto anual',
    price: 149.90,
    currency: 'BRL',
    mode: 'subscription',
    interval: 'year',
    features: [
      'Acesso ilimitado a todas as lições',
      'Exercícios personalizados',
      'Relatórios de progresso detalhados',
      'Suporte prioritário',
      '2 meses grátis (economia de R$ 39,80)'
    ]
  },
  {
    id: 'prod_UUADPdvtlFlT0K',
    priceId: 'price_1TVBsnFYOrbRBvjllULvD5d8',
    name: 'Família Mensal',
    description: 'Para até 6 membros da família',
    price: 34.90,
    currency: 'BRL',
    mode: 'subscription',
    interval: 'month',
    features: [
      'Até 6 contas familiares',
      'Acesso ilimitado para todos',
      'Controle parental',
      'Relatórios individuais',
      'Suporte prioritário'
    ]
  },
  {
    id: 'prod_UURGjYXk4Sv9hE',
    priceId: 'price_1TVSNnFYOrbRBvjlebut6HKk',
    name: 'Família Anual',
    description: 'Plano familiar com desconto anual',
    price: 249.90,
    currency: 'BRL',
    mode: 'subscription',
    interval: 'year',
    features: [
      'Até 6 contas familiares',
      'Acesso ilimitado para todos',
      'Controle parental',
      'Relatórios individuais',
      'Suporte prioritário',
      '2 meses grátis (economia de R$ 69,80)'
    ]
  }
];

export const formatPrice = (price: number, currency: string): string => {
  if (currency === 'BRL') {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }
  return `${price.toFixed(2)} ${currency}`;
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};