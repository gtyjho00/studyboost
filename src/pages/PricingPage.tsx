import React from 'react';
import { Crown, Users, Star } from 'lucide-react';
import { PricingCard } from '../components/PricingCard';
import { STRIPE_PRODUCTS } from '../stripe-config';

export function PricingPage() {
  const premiumMonthly = STRIPE_PRODUCTS.find(p => p.id === 'prod_UUAA4cArSWQrDf');
  const premiumAnnual = STRIPE_PRODUCTS.find(p => p.id === 'prod_UUACWHRV7IKbIj');
  const familyMonthly = STRIPE_PRODUCTS.find(p => p.id === 'prod_UUADPdvtlFlT0K');
  const familyAnnual = STRIPE_PRODUCTS.find(p => p.id === 'prod_UURGjYXk4Sv9hE');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desbloqueie todo o potencial do StudyBoost com nossos planos premium. 
            Acesso ilimitado, exercícios personalizados e muito mais.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Acesso Ilimitado</h3>
            <p className="text-gray-600">
              Todas as lições, exercícios e conteúdos sem limitações
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Exercícios Personalizados</h3>
            <p className="text-gray-600">
              Conteúdo adaptado ao seu nível e objetivos de aprendizado
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Planos Familiares</h3>
            <p className="text-gray-600">
              Compartilhe o aprendizado com até 6 membros da família
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {premiumMonthly && (
            <PricingCard product={premiumMonthly} />
          )}
          {premiumAnnual && (
            <PricingCard product={premiumAnnual} isPopular />
          )}
          {familyMonthly && (
            <PricingCard product={familyMonthly} />
          )}
          {familyAnnual && (
            <PricingCard product={familyAnnual} />
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perguntas Frequentes
          </h2>
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Posso cancelar minha assinatura a qualquer momento?
              </h3>
              <p className="text-gray-600">
                Sim, você pode cancelar sua assinatura a qualquer momento. Você continuará tendo acesso 
                aos recursos premium até o final do período pago.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como funciona o plano familiar?
              </h3>
              <p className="text-gray-600">
                O plano familiar permite adicionar até 6 membros da família. Cada membro terá sua própria 
                conta com progresso individual e acesso completo a todos os recursos.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Qual a diferença entre os planos mensais e anuais?
              </h3>
              <p className="text-gray-600">
                Os planos anuais oferecem 2 meses grátis em comparação aos planos mensais, 
                representando uma economia significativa para usuários de longo prazo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}