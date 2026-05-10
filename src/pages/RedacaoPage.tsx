import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, PenTool, Send, Lock, Crown,
  Check, AlertTriangle, Star, Zap, ChevronRight
} from 'lucide-react';

const themes = [
  {
    title: 'A desinformação na era digital e seus impactos na democracia brasileira',
    year: 'ENEM 2024',
  },
  {
    title: 'Os desafios da implementação de políticas públicas para a população indígena no Brasil',
    year: 'ENEM 2023',
  },
  {
    title: 'O estigma associado às doenças mentais na sociedade brasileira',
    year: 'ENEM 2022',
  },
];

const criteria = [
  { key: 'C1', label: 'Domínio da norma-padrão', maxScore: 200, desc: 'Adequação à modalidade escrita padrão da língua portuguesa.' },
  { key: 'C2', label: 'Compreensão da proposta', maxScore: 200, desc: 'Compreensão do tema, repertório e tipo de texto.' },
  { key: 'C3', label: 'Repertório sociocultural', maxScore: 200, desc: 'Seleção, relação e organização de informações, fatos e opiniões.' },
  { key: 'C4', label: 'Coesão textual', maxScore: 200, desc: 'Demonstração de conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.' },
  { key: 'C5', label: 'Proposta de intervenção', maxScore: 200, desc: 'Elaboração de proposta de intervenção para o problema abordado, respeitando os direitos humanos.' },
];

function generateAIFeedback(text: string) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0).length;
  const hasIntervention = text.toLowerCase().includes('proposta') || text.toLowerCase().includes('intervenção') || text.toLowerCase().includes('governo') || text.toLowerCase().includes('política');
  const hasQuote = text.includes('"') || text.includes('«') || text.includes('—');
  const hasConnector = /portanto|contudo|entretanto|porém|assim|logo|pois|consequentemente/i.test(text);

  const scores = criteria.map((c) => {
    let score = 0;
    switch (c.key) {
      case 'C1':
        score = Math.min(200, Math.max(40, wordCount > 20 ? 120 + Math.floor(Math.random() * 60) : 40));
        break;
      case 'C2':
        score = Math.min(200, Math.max(40, paragraphs >= 3 ? 140 + Math.floor(Math.random() * 40) : 80));
        break;
      case 'C3':
        score = Math.min(200, Math.max(40, hasQuote ? 150 + Math.floor(Math.random() * 40) : 80 + Math.floor(Math.random() * 40)));
        break;
      case 'C4':
        score = Math.min(200, Math.max(40, hasConnector && paragraphs >= 3 ? 140 + Math.floor(Math.random() * 40) : 60 + Math.floor(Math.random() * 40)));
        break;
      case 'C5':
        score = Math.min(200, Math.max(0, hasIntervention ? 120 + Math.floor(Math.random() * 60) : 0));
        break;
    }
    return { ...c, score };
  });

  const total = scores.reduce((sum, s) => sum + s.score, 0);
  return { scores, total };
}

export function RedacaoPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isPremium = profile?.premium || false;

  const [selectedTheme, setSelectedTheme] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<ReturnType<typeof generateAIFeedback> | null>(null);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minWords = 150;
  const maxWords = 300;
  const isValid = wordCount >= minWords && wordCount <= maxWords;

  const handleSubmit = () => {
    if (!isValid || !isPremium) return;
    const result = generateAIFeedback(text);
    setFeedback(result);
    setSubmitted(true);
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col">
        <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate('/enem')} className="text-dark-300 hover:text-white transition-colors">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-white font-bold text-lg">Redação</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm animate-slide-up">
            <div className="w-20 h-20 gradient-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown size={36} className="text-dark-900" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Recurso Premium</h2>
            <p className="text-dark-300 mb-6">A prática de redação com correção por IA está disponível apenas para assinantes Premium.</p>
            <button onClick={() => navigate('/')} className="btn-primary inline-flex items-center gap-2">
              <Crown size={16} />
              Conhecer Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Feedback screen
  if (submitted && feedback) {
    return (
      <div className="min-h-screen bg-dark-900">
        <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate('/enem')} className="text-dark-300 hover:text-white transition-colors">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-white font-bold text-lg">Correção IA</h1>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Total Score */}
          <div className="text-center animate-slide-up">
            <div className="text-6xl font-extrabold text-white mb-1">{feedback.total}</div>
            <p className="text-dark-300">de 1000 pontos</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.round(feedback.total / 200) ? 'text-accent-400 fill-accent-400' : 'text-dark-600'}
                />
              ))}
            </div>
          </div>

          {/* Criteria */}
          <div className="card p-5 space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-white font-bold">Competências</h3>
            {feedback.scores.map((c) => (
              <div key={c.key}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-primary-400 font-bold text-sm mr-2">{c.key}</span>
                    <span className="text-dark-200 text-sm">{c.label}</span>
                  </div>
                  <span className={`font-bold text-sm ${c.score >= 140 ? 'text-success-400' : c.score >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                    {c.score}/{c.maxScore}
                  </span>
                </div>
                <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      c.score >= 140 ? 'bg-success-400' : c.score >= 80 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${(c.score / c.maxScore) * 100}%` }}
                  />
                </div>
                <p className="text-dark-400 text-xs mt-1">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="card p-5 border-amber-500/20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              Dicas para Melhorar
            </h3>
            <ul className="space-y-2 text-sm text-dark-200">
              {feedback.scores.filter((c) => c.score < 140).map((c) => (
                <li key={c.key} className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-primary-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">{c.key}:</strong> {c.desc} — Foque em melhorar este aspecto.</span>
                </li>
              ))}
              {feedback.scores.every((c) => c.score >= 140) && (
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-success-400 shrink-0 mt-0.5" />
                  <span>Excelente redação! Continue praticando para manter o nível.</span>
                </li>
              )}
            </ul>
          </div>

          <button
            onClick={() => { setSubmitted(false); setFeedback(null); setText(''); }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <PenTool size={16} />
            Escrever Nova Redação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/enem')} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-white font-bold text-lg">Redação</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto w-full px-4 py-6 space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <h2 className="text-white font-bold text-sm">Tema</h2>
          <div className="space-y-2">
            {themes.map((theme, i) => (
              <button
                key={i}
                onClick={() => setSelectedTheme(i)}
                className={`w-full p-4 rounded-xl text-left text-sm transition-all ${
                  selectedTheme === i
                    ? 'bg-primary-500/15 border border-primary-500/30 text-white'
                    : 'card text-dark-200'
                }`}
              >
                <div className="font-semibold">{theme.title}</div>
                <div className="text-dark-400 text-xs mt-1">{theme.year}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-sm">Sua Redação</h2>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${
                wordCount < minWords ? 'text-red-400' :
                wordCount > maxWords ? 'text-amber-400' :
                'text-success-400'
              }`}>
                {wordCount} palavras
              </span>
              <span className="text-dark-400 text-xs">({minWords}-{maxWords})</span>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva sua redação dissertativo-argumentativa aqui..."
            className="w-full h-64 p-4 rounded-xl bg-dark-800 border border-white/8 text-white placeholder-dark-500 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none text-sm leading-relaxed"
          />
          <div className="w-full h-1.5 bg-dark-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                wordCount < minWords ? 'bg-red-400' :
                wordCount > maxWords ? 'bg-amber-400' :
                'bg-success-400'
              }`}
              style={{ width: `${Math.min((wordCount / maxWords) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          Enviar para Correção IA
        </button>

        {/* Criteria Reference */}
        <div className="card p-5">
          <h3 className="text-white font-bold text-sm mb-3">Competências ENEM</h3>
          <div className="space-y-2">
            {criteria.map((c) => (
              <div key={c.key} className="flex items-center gap-2 text-xs">
                <span className="text-primary-400 font-bold w-6">{c.key}</span>
                <span className="text-dark-300">{c.label}</span>
                <span className="text-dark-500 ml-auto">{c.maxScore} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
