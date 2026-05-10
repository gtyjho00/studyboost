import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'

function sanitize(input: string): string {
  return input.replace(/[<>"'&]/g, '').trim()
}

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitize(email),
        password,
      })

      if (error) {
        setError(error.message)
      }
    } catch {
      setError('Ocorreu um erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-dark-800 border-white/5">
      <CardHeader>
        <CardTitle className="text-white">Entrar</CardTitle>
        <CardDescription className="text-dark-400">
          Entre com sua conta para acessar a plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-dark-200">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-dark-700 border-white/10 text-white placeholder:text-dark-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-dark-200">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              className="bg-dark-700 border-white/10 text-white placeholder:text-dark-500"
            />
          </div>

          <Button type="submit" className="w-full gradient-purple text-white border-0" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              Não tem uma conta? Cadastre-se
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
