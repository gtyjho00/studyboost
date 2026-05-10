import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import {
  ArrowLeft, Calendar, Clock, BookOpen, Calculator,
  FlaskConical, Globe, PenTool, Sparkles, ChevronRight
} from 'lucide-react';

const subjects = [
  { key: 'linguagens', label: 'Linguagens', icon: BookOpen, color: 'from-blue-500 to-cyan-400', hours: 2 },
  { key: 'matematica', label: 'Matemática', icon: Calculator, color: 'from-emerald-500 to-teal-400', hours: 2 },
  { key: 'ciencias_natureza', label: 'Ciências da Natureza', icon: FlaskConical, color: 'from-pink-500 to-rose-400', hours: 1.5 },
  { key: 'ciencias_humanas', label: 'Ciências Humanas', icon: Globe, color: 'from-amber-500 to-orange-400', hours: 1.5 },
  { key: 'redacao', label: 'Redação', icon: PenTool, color: 'from-violet-500 to-purple-400', hours: 1 },
];

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function generatePlan(examDate: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const weeks = Math.ceil(daysUntil / 7);

  const plan: { day: number; date: string; dayName: string; subjects: typeof subjects; totalHours: number }[] = [];

  for (let d = 0; d < Math.min(daysUntil, 90); d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    const dayOfWeek = date.getDay();

    // Skip Sundays
    if (dayOfWeek === 0) continue;

    const daySubjects = dayOfWeek <= 3
      ? [subjects[0], subjects[1]] // Mon-Wed: Languages + Math
      : dayOfWeek <= 5
      ? [subjects[2], subjects[3]] // Thu-Fri: Sciences
      : [subjects[4], subjects[0]]; // Sat: Writing + Languages review

    const totalHours = daySubjects.reduce((sum, s) => sum + s.hours, 0);

    plan.push({
      day: d + 1,
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      dayName: dayNames[dayOfWeek],
      subjects: daySubjects,
      totalHours,
    });
  }

  return { plan, weeks, daysUntil };
}

export function CronogramaPage() {
  const navigate = useNavigate();
  const [examDate, setExamDate] = useState('2026-11-08');
  const [generated, setGenerated] = useState(false);

  const { plan, weeks, daysUntil } = useMemo(
    () => generatePlan(new Date(examDate + 'T00:00:00')),
    [examDate]
  );

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/enem')} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-white font-bold text-lg">Cronograma de Estudos</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Date Input */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-primary-400" />
            <h2 className="text-white font-bold">Data do ENEM</h2>
          </div>
          <input
            type="date"
            value={examDate}
            onChange={(e) => { setExamDate(e.target.value); setGenerated(false); }}
            className="input-field mb-4"
            min={new Date().toISOString().split('T')[0]}
          />
          <button
            onClick={() => setGenerated(true)}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            Gerar Cronograma
          </button>
        </div>

        {/* Stats */}
        {generated && (
          <>
            <div className="grid grid-cols-3 gap-3 animate-slide-up">
              <div className="card p-4 text-center">
                <div className="text-2xl font-extrabold text-white">{daysUntil}</div>
                <div className="text-dark-400 text-xs">Dias</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-extrabold text-white">{weeks}</div>
                <div className="text-dark-400 text-xs">Semanas</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-extrabold text-white">{plan.length * 2}</div>
                <div className="text-dark-400 text-xs">Horas total</div>
              </div>
            </div>

            {/* Plan */}
            <div className="space-y-3">
              <h2 className="text-white font-bold text-lg">Plano Diário</h2>
              <div className="space-y-2">
                {plan.slice(0, 30).map((day, i) => (
                  <div
                    key={i}
                    className="card p-4 animate-slide-up"
                    style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-xs font-bold text-white">
                          {day.day}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">{day.dayName}</div>
                          <div className="text-dark-400 text-xs">{day.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-dark-300 text-xs">
                        <Clock size={12} />
                        {day.totalHours}h
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {day.subjects.map((s) => (
                        <div
                          key={s.key}
                          className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-br ${s.color} bg-opacity-20`}
                          style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))` }}
                        >
                          <s.icon size={14} className="text-white opacity-70" />
                          <div>
                            <div className="text-white text-xs font-semibold">{s.label}</div>
                            <div className="text-dark-400 text-[10px]">{s.hours}h</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {plan.length > 30 && (
                <p className="text-dark-400 text-sm text-center">
                  Mostrando 30 de {plan.length} dias de estudo
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
