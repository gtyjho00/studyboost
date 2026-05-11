import { Component, type ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { BottomNav } from './components/BottomNav'
import { OfflineIndicator } from './components/OfflineIndicator'
import { NotificationPrompt } from './components/NotificationPrompt'
import { LandingPage } from './pages/LandingPage'
import { PricingPage } from './pages/PricingPage'
import { SuccessPage } from './pages/SuccessPage'
import { LoginPage } from './pages/LoginPage'
import { CadastroPage } from './pages/CadastroPage'
import { RecuperarSenhaPage } from './pages/RecuperarSenhaPage'
import { DashboardPage } from './pages/DashboardPage'
import { InglesPage } from './pages/InglesPage'
import { LicaoInglesPage } from './pages/LicaoInglesPage'
import { LicaoMatematicaPage } from './pages/LicaoMatematicaPage'
import { FlashcardsPage } from './pages/FlashcardsPage'
import { MatematicaPage } from './pages/MatematicaPage'
import { TutorPage } from './pages/TutorPage'
import { EnemPage } from './pages/EnemPage'
import { SimuladoPage } from './pages/SimuladoPage'
import { RedacaoPage } from './pages/RedacaoPage'
import { CronogramaPage } from './pages/CronogramaPage'
import { MateriasPage } from './pages/MateriasPage'
import { Profile } from './pages/Profile'
import { AdminPage } from './pages/AdminPage'
import { CertificadosPage } from './pages/CertificadosPage'
import Premium from './pages/Premium'
import { SubscriptionPage } from './pages/SubscriptionPage'
import { RankingPage } from './pages/RankingPage'
import { AuthCallback } from './pages/AuthCallback'

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, fontFamily: 'Inter, system-ui, sans-serif', background: '#0a0a0f', color: '#e2e8f0', minHeight: '100vh' }}>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#f87171' }}>Algo deu errado</h1>
          <p style={{ marginBottom: 12, color: '#94a3b8' }}>A aplicação encontrou um erro inesperado.</p>
          <pre style={{ background: '#1e1e2e', padding: 16, borderRadius: 12, overflow: 'auto', fontSize: 13, color: '#fbbf24', marginBottom: 16 }}>
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
            style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center mx-auto mb-4 glow-purple animate-pulse">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mt-4"></div>
        <p className="mt-4 text-dark-400 text-sm">Carregando...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-900">
      <OfflineIndicator />
      <NotificationPrompt />
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/cadastro" element={user ? <Navigate to="/dashboard" replace /> : <CadastroPage />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
      <Route path="/ingles" element={<ProtectedRoute><AppLayout><InglesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/ingles/licao/:id" element={<ProtectedRoute><LicaoInglesPage /></ProtectedRoute>} />
      <Route path="/ingles/flashcards" element={<ProtectedRoute><AppLayout><FlashcardsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/matematica" element={<ProtectedRoute><AppLayout><MatematicaPage /></AppLayout></ProtectedRoute>} />
      <Route path="/matematica/licao/:id" element={<ProtectedRoute><LicaoMatematicaPage /></ProtectedRoute>} />
      <Route path="/tutor" element={<ProtectedRoute><TutorPage /></ProtectedRoute>} />
      <Route path="/enem" element={<ProtectedRoute><AppLayout><EnemPage /></AppLayout></ProtectedRoute>} />
      <Route path="/enem/simulado" element={<ProtectedRoute><SimuladoPage /></ProtectedRoute>} />
      <Route path="/enem/redacao" element={<ProtectedRoute><AppLayout><RedacaoPage /></AppLayout></ProtectedRoute>} />
      <Route path="/enem/cronograma" element={<ProtectedRoute><AppLayout><CronogramaPage /></AppLayout></ProtectedRoute>} />
      <Route path="/materias" element={<ProtectedRoute><AppLayout><MateriasPage /></AppLayout></ProtectedRoute>} />
      <Route path="/ranking" element={<ProtectedRoute><AppLayout><RankingPage /></AppLayout></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
      <Route path="/perfil/assinatura" element={<ProtectedRoute><AppLayout><SubscriptionPage /></AppLayout></ProtectedRoute>} />
      <Route path="/premium" element={<ProtectedRoute><AppLayout><Premium /></AppLayout></ProtectedRoute>} />
      <Route path="/certificados" element={<ProtectedRoute><AppLayout><CertificadosPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AppLayout><AdminPage /></AppLayout></AdminRoute>} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  )
}

export default App