import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft, X, Check, Zap, Coins, Star,
  Trophy, ChevronRight, RotateCcw
} from 'lucide-react';

interface Question {
  type: 'choice' | 'fill' | 'match';
  prompt: string;
  options?: string[];
  answer?: number;
  pairs?: { left: string; right: string }[];
  explanation: string;
}

interface Lesson {
  id: string;
  title: string;
  module: string;
  category: string;
  xp_reward: number;
  content_json: { questions: Question[] };
}

export function LicaoInglesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [showXpPopup, setShowXpPopup] = useState(false);

  // Match state
  const [matchLeft, setMatchLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [matchResults, setMatchResults] = useState<Record<string, boolean>>({});

  const questions = lesson?.content_json?.questions || [];
  const totalQ = questions.length;
  const progress = totalQ > 0 ? ((currentQ + (completed ? 1 : 0)) / totalQ) * 100 : 0;

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) return;
      const { data } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (data) setLesson(data as Lesson);
    };
    fetchLesson();
  }, [id]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (showResult) return;
    const q = questions[currentQ];
    if (!q || q.type === 'match') return;

    setSelected(optionIndex);
    const correct = optionIndex === q.answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      setXpGained((prev) => prev + 10);
      setShowXpPopup(true);
      setTimeout(() => setShowXpPopup(false), 1200);
    }
  }, [showResult, questions, currentQ, score]);

  const handleMatchSelect = useCallback((left: string) => {
    if (matchedPairs.has(left)) return;
    setMatchLeft(left);
  }, [matchedPairs]);

  const handleMatchRight = useCallback((right: string) => {
    if (!matchLeft) return;
    const q = questions[currentQ];
    if (!q || !q.pairs) return;

    const pair = q.pairs.find((p) => p.left === matchLeft && p.right === right);
    const correct = !!pair;

    setMatchResults((prev) => ({ ...prev, [matchLeft]: correct }));
    if (correct) {
      const newMatched = new Set(matchedPairs);
      newMatched.add(matchLeft);
      setMatchedPairs(newMatched);
      setXpGained((prev) => prev + 5);
      setShowXpPopup(true);
      setTimeout(() => setShowXpPopup(false), 1200);
    }
    setMatchLeft(null);

    // Check if all matched
    if (matchedPairs.size + 1 >= (q.pairs?.length || 0)) {
      const allCorrect = Object.values({ ...matchResults, [matchLeft!]: correct }).every(Boolean);
      if (allCorrect) {
        setScore((prev) => prev + 1);
      }
      setTimeout(() => {
        setShowResult(true);
        setIsCorrect(allCorrect);
      }, 600);
    }
  }, [matchLeft, questions, currentQ, matchedPairs, matchResults, score]);

  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= totalQ) {
      setCompleted(true);
      saveProgress();
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setShowResult(false);
      setIsCorrect(false);
      setMatchLeft(null);
      setMatchedPairs(new Set());
      setMatchResults({});
    }
  }, [currentQ, totalQ]);

  const saveProgress = async () => {
    if (!user || !lesson) return;
    const totalXp = Math.round((score / totalQ) * lesson.xp_reward);

    await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lesson.id,
        completed: true,
        score,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' });

    await supabase
      .from('profiles')
      .update({
        xp: (profile?.xp || 0) + totalXp,
        coins: (profile?.coins || 0) + Math.floor(score * 2),
      })
      .eq('id', user.id);

    await refreshProfile();
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const q = questions[currentQ];

  // Completion screen
  if (completed) {
    const totalXp = Math.round((score / totalQ) * lesson.xp_reward);
    const totalCoins = Math.floor(score * 2);
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <div className="text-center animate-slide-up max-w-sm">
          <div className="w-20 h-20 gradient-purple rounded-full flex items-center justify-center mx-auto mb-6 glow-purple">
            <Trophy size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Lição Completa!</h1>
          <p className="text-dark-300 mb-8">{lesson.title}</p>

          <div className="card p-6 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Acertos</span>
              <span className="text-white font-bold">{score}/{totalQ}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 flex items-center gap-1"><Zap size={14} className="text-primary-400" /> XP ganho</span>
              <span className="text-primary-400 font-bold">+{totalXp}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 flex items-center gap-1"><Coins size={14} className="text-accent-400" /> Moedas</span>
              <span className="text-accent-400 font-bold">+{totalCoins}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCurrentQ(0);
                setSelected(null);
                setShowResult(false);
                setCompleted(false);
                setScore(0);
                setXpGained(0);
                setMatchLeft(null);
                setMatchedPairs(new Set());
                setMatchResults({});
              }}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Refazer
            </button>
            <button
              onClick={() => navigate('/ingles')}
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

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* XP Popup */}
      {showXpPopup && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-1 px-4 py-2 rounded-full gradient-purple text-white font-bold text-lg shadow-lg">
            <Zap size={18} />
            +10 XP
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/ingles')} className="text-dark-300 hover:text-white transition-colors">
            <X size={22} />
          </button>
          <div className="flex-1">
            <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
              <div
                className="h-full gradient-purple rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-dark-300 text-sm font-medium">{currentQ + 1}/{totalQ}</span>
        </div>
      </header>

      {/* Question */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        {q && (
          <div className="animate-fade-in">
            <div className="text-xs text-primary-400 font-semibold mb-2 uppercase">
              {q.type === 'choice' ? 'Múltipla Escolha' : q.type === 'fill' ? 'Complete a Frase' : 'Relacione os Pares'}
            </div>
            <h2 className="text-xl font-bold text-white mb-8">{q.prompt}</h2>

            {/* Choice / Fill */}
            {(q.type === 'choice' || q.type === 'fill') && q.options && (
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  let btnClass = 'card p-4 w-full text-left flex items-center gap-3';
                  if (showResult) {
                    if (i === q.answer) {
                      btnClass += ' !bg-success-500/15 !border-success-500/40';
                    } else if (i === selected && !isCorrect) {
                      btnClass += ' !bg-red-500/15 !border-red-500/40';
                    }
                  } else if (selected === i) {
                    btnClass += ' !border-primary-500/50';
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
                          : showResult && i === selected && !isCorrect
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-dark-600 text-dark-200'
                      }`}>
                        {showResult && i === q.answer ? (
                          <Check size={16} />
                        ) : showResult && i === selected && !isCorrect ? (
                          <X size={16} />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </div>
                      <span className={`text-sm ${
                        showResult && i === q.answer ? 'text-success-300' :
                        showResult && i === selected && !isCorrect ? 'text-red-300' :
                        'text-dark-100'
                      }`}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Match pairs */}
            {q.type === 'match' && q.pairs && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs text-dark-400 font-semibold mb-2">Inglês</div>
                  {q.pairs.map((p) => (
                    <button
                      key={p.left}
                      onClick={() => handleMatchSelect(p.left)}
                      disabled={matchedPairs.has(p.left)}
                      className={`w-full p-3 rounded-xl text-sm text-left transition-all ${
                        matchedPairs.has(p.left)
                          ? 'bg-success-500/15 border border-success-500/30 text-success-300'
                          : matchLeft === p.left
                          ? 'bg-primary-500/15 border border-primary-500/40 text-primary-300'
                          : 'card p-3'
                      }`}
                    >
                      {p.left}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-dark-400 font-semibold mb-2">Português</div>
                  {q.pairs
                    ?.slice()
                    .sort(() => 0.5 - Math.random())
                    .map((p) => (
                      <button
                        key={p.right}
                        onClick={() => handleMatchRight(p.right)}
                        disabled={matchedPairs.has(
                          q.pairs?.find((pp) => pp.right === p.right)?.left || ''
                        )}
                        className={`w-full p-3 rounded-xl text-sm text-left transition-all ${
                          matchedPairs.has(
                            q.pairs?.find((pp) => pp.right === p.right)?.left || ''
                          )
                            ? 'bg-success-500/15 border border-success-500/30 text-success-300'
                            : 'card p-3'
                        }`}
                      >
                        {p.right}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Explanation on wrong answer */}
            {showResult && !isCorrect && q.explanation && (
              <div className="mt-6 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 animate-slide-up">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-primary-400" />
                  <span className="text-primary-300 font-semibold text-sm">Explicação</span>
                </div>
                <p className="text-dark-200 text-sm leading-relaxed">{q.explanation}</p>
              </div>
            )}

            {/* Next button */}
            {showResult && (
              <button
                onClick={nextQuestion}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2 animate-slide-up"
              >
                {currentQ + 1 >= totalQ ? 'Finalizar' : 'Próxima'}
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
