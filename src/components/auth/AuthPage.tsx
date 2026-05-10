import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { Zap } from 'lucide-react'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 gradient-purple rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">StudyBoost AI</h1>
          <p className="text-dark-400 text-sm mt-1">Aprenda Inglês e Matemática com IA</p>
        </div>
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}
