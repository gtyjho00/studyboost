import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  X, Check, Zap, Coins, Trophy, ChevronRight,
  RotateCcw, Clock, AlertTriangle, BarChart3,
  Target, BookOpen, Calculator, FlaskConical, Globe
} from 'lucide-react';

interface SimQuestion {
  id: string;
  subject: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

const subjectIcons: Record<string, { icon: typeof BookOpen; color: string }> = {
  linguagens: { icon: BookOpen, color: 'from-blue-500 to-cyan-400' },
  matematica: { icon: Calculator, color: 'from-emerald-500 to-teal-400' },
  ciencias_natureza: { icon: FlaskConical, color: 'from-pink-500 to-rose-400' },
  ciencias_humanas: { icon: Globe, color: 'from-amber-500 to-orange-400' },
  redacao: { icon: BookOpen, color: 'from-violet-500 to-purple-400' },
};

const subjectLabels: Record<string, string> = {
  linguagens: 'Linguagens',
  matematica: 'Matemática',
  ciencias_natureza: 'Ciências da Natureza',
  ciencias_humanas: 'Ciências Humanas',
  redacao: 'Redação',
};

export function SimuladoPage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const isPremium = profile?.premium || false;
  const totalQuestions = isPremium ? 45 : 10;

  const [questions, setQuestions] = useState<SimQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(isPremium ? 45 * 60 : 10 * 60);
  const [timerActive, setTimerActive] = useState(true);

  // Load questions from all ENEM lessons
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase
        .from('lessons')
        .select('id, category, content_json')
        .eq('module', 'enem');

      if (data) {
        const allQ: SimQuestion[] = [];
        data.forEach((lesson) => {
          const content = lesson.content_json as { questions?: SimQuestion[] };
          if (content?.questions) {
            content.questions.forEach((q: SimQuestion, i: number) => {
              allQ.push({
                ...q,
                id: `${lesson.id}-${i}`,
                subject: lesson.category,
              });
            });
          }
        });

        // Shuffle and limit
        const shuffled = allQ.sort(() => Math.random() - 0.5).slice(0, totalQuestions);
        setQuestions(shuffled);
        setAnswers(new Array(shuffled.length).fill(null));
      }
    };
    fetchQuestions();
  }, [totalQuestions]);

  // Timer
  useEffect(() => {
    if (!timerActive || completed) return;
    if (timeLeft <= 0) {
      setCompleted(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft, completed]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAnswer = useCallback((optionIndex: number) => {
    if (showResult) return;
    setSelected(optionIndex);
    setShowResult(true);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = optionIndex;
      return next;
    });
  }, [showResult, currentQ]);

  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      setCompleted(true);
      setTimerActive(false);
      saveResults();
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setShowResult(false);
    }
  }, [currentQ, questions.length]);

  const saveResults = async () => {
    if (!user || !lesson) return;
    const score = answers.reduce((acc, ans, i) => {
      return acc + (ans === questions[i]?.answer ? 1 : 0);
    }, 0);
    const xpEarned = score * 15;

    await supabase
      .from('profiles')
      .update({
        xp: (profile?.xp || 0) + xpEarned,
        coins: (profile?.coins || 0) + score * 3,
      })
      .eq('id', user.id);

    await refreshProfile();
  };

  const score = answers.filter((ans, i) => ans === questions[i]?.answer).length;
  const q = questions[currentQ];

  // Performance by subject
  const getSubjectPerformance = () => {
    const subjects: Record<string, { total: number; correct: number }> = {};
    questions.forEach((q, i) => {
      if (!subjects[q.subject]) subjects[q.subject] = { total: 0, correct: 0 };
      subjects[q.subject].total++;
      if (answers[i] === q.answer) subjects[q.subject].correct++;
    });
    return subjects;
  };

  // Completion screen
  if (completed) {
    const xpEarned = score * 15;
    const coinsEarned = score * 3;
    const performance = getSubjectPerformance();
    const weakSubjects = Object.entries(performance)
      .filter(([, v]) => v.total > 0 && v.correct / v.total < 0.5)
      .map(([k]) => subjectLabels[k] || k);

    return (
      <div className="min-h-screen bg-dark-900 flex flex-col">
        <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-6">
          {/* Header */}
          <div className="text-center animate-slide-up">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 glow-gold">
              <Trophy size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Simulado Completo!</h1>
            <p className="text-dark-300">ENEM 2026</p>
          </div>

          {/* Score */}
          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-5xl font-extrabold text-white mb-1">
              {score}<span className="text-dark-400 text-2xl">/{questions.length}</span>
            </div>
            <p className="text-dark-300 text-sm">Acertos</p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-primary-400 font-bold flex items-center gap-1"><Zap size={14} /> +{xpEarned}</div>
                <div className="text-dark-400 text-xs">XP</div>
              </div>
              <div className="text-center">
                <div className="text-accent-400 font-bold flex items-center gap-1"><Coins size={14} /> +{coinsEarned}</div>
                <div className="text-dark-400 text-xs">Moedas</div>
              </div>
            </div>
          </div>

          {/* Performance by subject */}
          <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-primary-400" />
              Desempenho por Matéria
            </h3>
            <div className="space-y-3">
              {Object.entries(performance).map(([subject, { total, correct }]) => {
                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                const iconData = subjectIcons[subject];
                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-dark-200 text-sm">{subjectLabels[subject] || subject}</span>
                      <span className={`text-sm font-bold ${pct >= 50 ? 'text-success-400' : 'text-red-400'}`}>
                        {correct}/{total} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 50 ? 'bg-gradient-to-r from-success-500 to-success-400' : 'bg-gradient-to-r from-red-500 to-red-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Analysis */}
          {weakSubjects.length > 0 && (
            <div className="card p-5 border-amber-500/20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-400" />
                Pontos Fracos Identificados
              </h3>
              <p className="text-dark-300 text-sm mb-3">
                Recomendamos focar nos seguintes temas:
              </p>
              <div className="flex flex-wrap gap-2">
                {weakSubjects.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => navigate('/enem')}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              Voltar
            </button>
            <button
              onClick={() => navigate('/enem')}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              Continuar
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header with timer */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/enem')} className="text-dark-300 hover:text-white transition-colors">
            <X size={22} />
          </button>
          <div className="flex-1">
            <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-dark-300 text-sm font-medium">{currentQ + 1}/{questions.length}</span>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold ${
            timeLeft < 60 ? 'text-red-400 bg-red-500/10' : timeLeft < 300 ? 'text-amber-400 bg-amber-500/10' : 'text-white bg-dark-600'
          }`}>
            <Clock size={14} />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* Question */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {q && (
          <div className="animate-fade-in">
            {/* Subject badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-4">
              <Target size={12} />
              {subjectLabels[q.subject] || q.subject}
            </div>

            <h2 className="text-xl font-bold text-white mb-8">{q.prompt}</h2>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let btnClass = 'card p-4 w-full text-left flex items-center gap-3';
                if (showResult) {
                  if (i === q.answer) {
                    btnClass += ' !bg-success-500/15 !border-success-500/40';
                  } else if (i === selected && i !== q.answer) {
                    btnClass += ' !bg-red-500/15 !border-red-500/40';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={showResult}
                    className={btnClass}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      showResult && i === q.answer
                        ? 'bg-success-500/20 text-success-400'
                        : showResult && i === selected && i !== q.answer
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-dark-600 text-dark-200'
                    }`}>
                      {showResult && i === q.answer ? <Check size={16} /> :
                       showResult && i === selected && i !== q.answer ? <X size={16} /> :
                       String.fromCharCode(65 + i)}
                    </div>
                    <span className={`text-sm ${
                      showResult && i === q.answer ? 'text-success-300' :
                      showResult && i === selected && i !== q.answer ? 'text-red-300' :
                      'text-dark-100'
                    }`}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResult && q.explanation && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-slide-up">
                <p className="text-dark-200 text-sm leading-relaxed">{q.explanation}</p>
              </div>
            )}

            {/* Next */}
            {showResult && (
              <button
                onClick={nextQuestion}
                className="w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 animate-slide-up"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
              >
                {currentQ + 1 >= questions.length ? 'Ver Resultado' : 'Próxima'}
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
