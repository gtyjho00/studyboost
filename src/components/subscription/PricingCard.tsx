import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { StripeProduct, formatPrice } from '../../stripe-config'
import { createCheckoutSession } from '../../services/stripe'
import { Alert, AlertDescription } from '../ui/alert'
import { Check, Zap, Loader2 } from 'lucide-react'

interface PricingCardProps {
  product: StripeProduct
  isPopular?: boolean
}

export function PricingCard({ product, isPopular = false }: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')

    try {
      const { url } = await createCheckoutSession({
        price_id: product.priceId,
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/pricing`,
        mode: product.mode,
      })

      if (url) {
        window.location.href = url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`relative bg-dark-800 border-white/5 ${isPopular ? 'border-primary-500/30 ring-1 ring-primary-500/20' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="gradient-purple text-white px-3 py-1 rounded-full text-sm font-medium">
            Mais Popular
          </span>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl text-white">{product.name}</CardTitle>
        <CardDescription className="text-dark-400">{product.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold text-white">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="text-dark-400 ml-1">
            /{product.interval === 'month' ? 'mês' : 'ano'}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2 text-sm">
          {product.features.map((feature, i) => (
            <li key={i} className="flex items-center text-dark-200">
              <Check size={14} className="text-success-400 mr-2 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <div className="w-full space-y-2">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className={`w-full ${isPopular ? 'gradient-purple text-white border-0' : 'bg-dark-700 text-white border-white/5 hover:bg-dark-600'}`}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : (
              <Zap size={14} className="mr-2" />
            )}
            {loading ? 'Processando...' : 'Assinar Agora'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
