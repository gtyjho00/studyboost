import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'

function sanitize(input: string): string {
  return input.replace(/[<>"'&]/g, '').trim()
}

interface SignupFormProps {
  onToggleMode: () => void
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: sanitize(email),
        password,
        options: {
          data: {
            name: sanitize(name),
          }
        }
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: sanitize(name),
            email: sanitize(email),
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }

        setSuccess('Conta criada com sucesso! Você já pode fazer login.')
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
        <CardTitle className="text-white">Criar Conta</CardTitle>
        <CardDescription className="text-dark-400">
          Crie sua conta para comecar a aprender
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-success-500/10 border-success-500/20 text-success-400">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-dark-200">
              Nome
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="bg-dark-700 border-white/10 text-white placeholder:text-dark-500"
            />
          </div>

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
              minLength={6}
              className="bg-dark-700 border-white/10 text-white placeholder:text-dark-500"
            />
          </div>

          <Button type="submit" className="w-full gradient-purple text-white border-0" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              Já tem uma conta? Faça login
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
