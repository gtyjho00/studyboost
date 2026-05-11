import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { getProductByPriceId } from '../stripe-config';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [productName, setProductName] = useState<string>('');
  
  useEffect(() => {
    const priceId = searchParams.get('price_id');
    if (priceId) {
      const product = getProductByPriceId(priceId);
      if (product) {
        setProductName(product.name);
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-gray-600">
              Sua assinatura foi ativada com sucesso
            </p>
          </div>

          {productName && (
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700 font-medium">
                Plano Ativado
              </p>
              <p className="text-lg font-semibold text-green-900">
                {productName}
              </p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-left">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Acesso ilimitado ativado</span>
            </div>
            <div className="flex items-center text-left">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Todas as funcionalidades desbloqueadas</span>
            </div>
            <div className="flex items-center text-left">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Suporte prioritário disponível</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Começar a Estudar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}