export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'subscription' | 'payment';
  interval?: 'month' | 'year';
  features: string[];
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_UUAA4cArSWQrDf',
    priceId: 'price_1TVBqRFYOrbRBvjlwJUubxN9',
    name: 'Premium Mensal',
    description: 'Acesso completo a todas as funcionalidades premium',
    price: 19.90,
    currency: 'BRL',
    mode: 'subscription',
    interval: 'month',
    features: [
      'Acesso ilimitado a lições',
      'Certificados de conclusão',
      'Suporte prioritário',
      'Estatísticas detalhadas'
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
      'Acesso ilimitado a lições',
      'Certificados de conclusão',
      'Suporte prioritário',
      'Estatísticas detalhadas',
      '2 meses grátis'
    ]
  },
  {
    id: 'prod_UUADPdvtlFlT0K',
    priceId: 'price_1TVBsnFYOrbRBvjllULvD5d8',
    name: 'Família Mensal',
    description: 'Plano familiar para até 6 membros',
    price: 34.90,
    currency: 'BRL',
    mode: 'subscription',
    interval: 'month',
    features: [
      'Até 6 contas familiares',
      'Acesso ilimitado a lições',
      'Certificados de conclusão',
      'Controle parental',
      'Relatórios de progresso'
    ]
  },
  {
    id: 'prod_UURGjYXk4Sv9hE',
    priceId: 'price_1TVSNnFYOrbRBvjlebut6HKk',
    name: 'Família Anual',
    description: 'Plano familiar anual com desconto',
    price: 249.90,
    currency: 'BRL',
    mode: 'subscription',
    interval: 'year',
    features: [
      'Até 6 contas familiares',
      'Acesso ilimitado a lições',
      'Certificados de conclusão',
      'Controle parental',
      'Relatórios de progresso',
      '2 meses grátis'
    ]
  }
];

export const formatPrice = (price: number, currency: string): string => {
  if (currency === 'BRL') {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }
  return `$${price.toFixed(2)}`;
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};