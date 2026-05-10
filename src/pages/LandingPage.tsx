import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import {
  Bot, Gamepad2, Award, Star, Users, BookOpen, Zap,
  ChevronRight, Check, ArrowRight
} from 'lucide-react';

const features = [
  { icon: Bot, title: 'IA Tutor 24/7', desc: 'Um tutor inteligente que adapta o conteúdo ao seu ritmo e responde dúvidas na hora.' },
  { icon: Gamepad2, title: 'Gamificação', desc: 'XP, moedas, streaks e badges tornam o estudo viciante — no bom sentido.' },
  { icon: Award, title: 'Certificados', desc: 'Gere certificados reconhecidos ao completar módulos e comprove seu progresso.' },
];

const stats = [
  { value: '10K+', label: 'Alunos' },
  { value: '500+', label: 'Lições' },
  { value: '4.9', label: 'Estrelas', icon: Star },
];

const plans = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: '/mês',
    features: ['5 lições por dia', 'IA Tutor básico', 'Ranking semanal', 'Perfil gamificado'],
    cta: 'Começar Grátis',
    highlight: false,
  },
  {
    name: 'Premium',
    price: 'R$ 19,90',
    period: '/mês',
    features: ['Lições ilimitadas', 'Acesso a todas as matérias', 'IA Tutor avançado', 'Certificados', 'Sem anúncios', 'Simulado ENEM completo'],
    cta: 'Assinar Premium',
    highlight: true,
  },
  {
    name: 'Família',
    price: 'R$ 34,90',
    period: '/mês',
    features: ['Tudo do Premium', 'Até 5 perfis', 'Todas as matérias liberadas', 'Painel do responsável', 'Relatórios de progresso'],
    cta: 'Assinar Família',
    highlight: false,
  },
];

const testimonials = [
  { name: 'Ana Silva', role: 'Estudante, 17 anos', text: 'O StudyBoost mudou minha rotina de estudos! Passei de 450 pra 720 no ENEM.', avatar: 'AS' },
  { name: 'Carlos Mendes', role: 'Universitário', text: 'A gamificação me viciou em estudar inglês. Já completei 200 lições!', avatar: 'CM' },
  { name: 'Juliana Costa', role: 'Professora', text: 'Recomendo pra todos os meus alunos. O tutor IA é incrível.', avatar: 'JC' },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1.5s' }} />

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
          <Logo />
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-dark-200 hover:text-white transition-colors text-sm">Recursos</a>
            <a href="#pricing" className="text-dark-200 hover:text-white transition-colors text-sm">Preços</a>
            <a href="#testimonials" className="text-dark-200 hover:text-white transition-colors text-sm">Depoimentos</a>
            <button onClick={() => navigate('/login')} className="btn-secondary text-sm py-2 px-4">
              Entrar
            </button>
          </div>
          <button onClick={() => navigate('/login')} className="md:hidden btn-secondary text-sm py-2 px-4">
            Entrar
          </button>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-sm text-primary-300">
            <Zap size={14} />
            <span>Novo: Tutor IA com GPT-4</span>
            <ChevronRight size={14} />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
            Aprenda Inglês e{' '}
            <span className="text-gradient-purple">Matemática</span>{' '}
            com <span className="text-gradient-gold">IA</span>
          </h1>
          <p className="text-dark-200 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            10.000+ alunos já transformaram seus estudos com gamificação, tutoria inteligente e conteúdo adaptativo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/cadastro')}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Começar Grátis
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto justify-center"
            >
              Já tenho conta
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-400">
          <span className="text-xs">Saiba mais</span>
          <div className="w-5 h-8 rounded-full border-2 border-dark-400 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-dark-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative z-10 -mt-16 mb-20 px-4">
        <div className="max-w-2xl mx-auto glass rounded-2xl p-6 flex items-center justify-around">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-1">
                {stat.value}
                {stat.icon && <stat.icon size={18} className="text-accent-400 fill-accent-400" />}
              </div>
              <div className="text-dark-300 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Por que o <span className="text-gradient-purple">StudyBoost</span>?
          </h2>
          <p className="text-dark-200 text-lg max-w-lg mx-auto">
            Tudo que você precisa para aprender de verdade, em um só lugar.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="card group p-8 text-center"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="w-14 h-14 gradient-purple rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <feat.icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-dark-300 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Planos para todos os <span className="text-gradient-gold">objetivos</span>
          </h2>
          <p className="text-dark-200 text-lg">Comece grátis. Evolua quando quiser.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`card p-8 relative ${plan.highlight ? 'border-primary-500/50 glow-purple scale-[1.02]' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-purple rounded-full text-xs font-bold text-white">
                  Mais Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                <span className="text-dark-400">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-dark-200">
                    <Check size={16} className="text-success-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/cadastro')}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  plan.highlight
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            O que nossos <span className="text-gradient-purple">alunos</span> dizem
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-dark-400 text-xs">{t.role}</div>
                </div>
              </div>
              <p className="text-dark-200 leading-relaxed text-sm">"{t.text}"</p>
              <div className="flex gap-0.5 mt-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="text-accent-400 fill-accent-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary-500/20 rounded-full blur-[80px] pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            Pronto para <span className="text-gradient-purple">evoluir</span>?
          </h2>
          <p className="text-dark-200 text-lg mb-8 relative z-10">
            Junte-se a 10.000+ alunos e comece sua jornada hoje.
          </p>
          <button
            onClick={() => navigate('/cadastro')}
            className="btn-primary text-lg px-8 py-4 relative z-10 inline-flex items-center gap-2"
          >
            Começar Grátis
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="small" />
          <div className="flex items-center gap-6 text-dark-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
          <div className="flex items-center gap-2 text-dark-400 text-sm">
            <BookOpen size={14} />
            <span>StudyBoost AI &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
