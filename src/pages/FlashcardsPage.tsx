import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft, ArrowRight, RotateCcw, Zap, Coins,
  Check, X, Trophy, Volume2
} from 'lucide-react';

interface Flashcard {
  en: string;
  pt: string;
  example?: string;
}

const flashcardsData: Flashcard[] = [
  { en: 'Hello', pt: 'Olá', example: 'Hello, how are you?' },
  { en: 'Good morning', pt: 'Bom dia', example: 'Good morning, teacher!' },
  { en: 'Thank you', pt: 'Obrigado', example: 'Thank you for your help.' },
  { en: 'Please', pt: 'Por favor', example: 'Can you help me, please?' },
  { en: 'Goodbye', pt: 'Tchau', example: 'Goodbye, see you tomorrow!' },
  { en: 'Water', pt: 'Água', example: 'Can I have some water?' },
  { en: 'Bread', pt: 'Pão', example: 'I bought some bread at the store.' },
  { en: 'Coffee', pt: 'Café', example: 'I drink coffee every morning.' },
  { en: 'Book', pt: 'Livro', example: 'This book is very interesting.' },
  { en: 'Friend', pt: 'Amigo', example: 'She is my best friend.' },
  { en: 'House', pt: 'Casa', example: 'My house is near the park.' },
  { en: 'School', pt: 'Escola', example: 'I go to school every day.' },
  { en: 'Love', pt: 'Amor', example: 'I love my family.' },
  { en: 'Time', pt: 'Tempo', example: 'What time is it?' },
  { en: 'Food', pt: 'Comida', example: 'The food here is delicious.' },
  { en: 'Happy', pt: 'Feliz', example: 'I am very happy today.' },
  { en: 'Beautiful', pt: 'Bonito', example: 'What a beautiful day!' },
  { en: 'Important', pt: 'Importante', example: 'This is very important.' },
  { en: 'Understand', pt: 'Entender', example: 'I understand the lesson now.' },
  { en: 'Remember', pt: 'Lembrar', example: 'Do you remember me?' },
];

export function FlashcardsPage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [review, setReview] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const total = flashcardsData.length;
  const card = flashcardsData[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDir(direction);
    setTimeout(() => {
      if (direction === 'right') {
        setKnown((prev) => new Set(prev).add(currentIndex));
      } else {
        setReview((prev) => new Set(prev).add(currentIndex));
      }

      if (currentIndex + 1 >= total) {
        setCompleted(true);
        saveFlashcardProgress();
      } else {
        setCurrentIndex((prev) => prev + 1);
        setFlipped(false);
        setSwipeDir(null);
      }
    }, 300);
  };

  const saveFlashcardProgress = async () => {
    if (!user || !profile) return;
    const xpEarned = known.size * 5;
    const coinsEarned = known.size * 2;

    await supabase
      .from('profiles')
      .update({
        xp: profile.xp + xpEarned,
        coins: profile.coins + coinsEarned,
      })
      .eq('id', user.id);

    await refreshProfile();
  };

  const restart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setReview(new Set());
    setCompleted(false);
    setSwipeDir(null);
  };

  // Completion screen
  if (completed) {
    const xpEarned = known.size * 5;
    const coinsEarned = known.size * 2;
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <div className="text-center animate-slide-up max-w-sm">
          <div className="w-20 h-20 gradient-purple rounded-full flex items-center justify-center mx-auto mb-6 glow-purple">
            <Trophy size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Sessão Completa!</h1>
          <p className="text-dark-300 mb-8">Flashcards revisados</p>

          <div className="card p-6 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-dark-300 flex items-center gap-1"><Check size={14} className="text-success-400" /> Acertei</span>
              <span className="text-success-400 font-bold">{known.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 flex items-center gap-1"><X size={14} className="text-red-400" /> Revisar</span>
              <span className="text-red-400 font-bold">{review.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 flex items-center gap-1"><Zap size={14} className="text-primary-400" /> XP</span>
              <span className="text-primary-400 font-bold">+{xpEarned}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-300 flex items-center gap-1"><Coins size={14} className="text-accent-400" /> Moedas</span>
              <span className="text-accent-400 font-bold">+{coinsEarned}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={restart} className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <RotateCcw size={16} />
              Refazer
            </button>
            <button onClick={() => navigate('/ingles')} className="btn-primary flex-1 flex items-center justify-center gap-2">
              Continuar
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/ingles')} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1">
            <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
              <div
                className="h-full gradient-purple rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-dark-300 text-sm font-medium">{currentIndex + 1}/{total}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        {/* Card */}
        <div
          ref={cardRef}
          onClick={() => setFlipped(!flipped)}
          className={`w-full aspect-[3/4] max-h-[400px] cursor-pointer perspective-1000 mb-8 transition-transform duration-300 ${
            swipeDir === 'right' ? 'translate-x-[200px] rotate-12 opacity-0' :
            swipeDir === 'left' ? '-translate-x-[200px] -rotate-12 opacity-0' : ''
          }`}
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative w-full h-full transition-transform duration-500"
            style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 card p-8 flex flex-col items-center justify-center backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-xs text-primary-400 font-semibold mb-4 uppercase">Inglês</div>
              <div className="text-4xl font-extrabold text-white mb-4 text-center">{card.en}</div>
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="text-dark-400 hover:text-primary-400 transition-colors"
              >
                <Volume2 size={24} />
              </button>
              <div className="mt-6 text-dark-400 text-sm">Toque para ver a tradução</div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 card p-8 flex flex-col items-center justify-center backface-hidden border-primary-500/20"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="text-xs text-primary-400 font-semibold mb-4 uppercase">Português</div>
              <div className="text-3xl font-bold text-white mb-2 text-center">{card.pt}</div>
              <div className="text-dark-200 text-sm text-center mb-4">{card.en} = {card.pt}</div>
              {card.example && (
                <div className="mt-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 w-full">
                  <div className="text-xs text-primary-300 font-semibold mb-1">Exemplo:</div>
                  <div className="text-dark-200 text-sm italic text-center">"{card.example}"</div>
                </div>
              )}
              <div className="mt-4 text-dark-400 text-sm">Toque para voltar</div>
            </div>
          </div>
        </div>

        {/* Swipe Buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center hover:bg-red-500/25 transition-all active:scale-95"
          >
            <X size={28} className="text-red-400" />
          </button>
          <div className="text-dark-400 text-sm font-medium">Revisar</div>
          <div className="text-dark-400 text-sm font-medium">Sei</div>
          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-success-500/15 border border-success-500/30 flex items-center justify-center hover:bg-success-500/25 transition-all active:scale-95"
          >
            <Check size={28} className="text-success-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
