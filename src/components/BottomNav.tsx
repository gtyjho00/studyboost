import { Home, BookOpen, Sparkles, Trophy, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: BookOpen, label: 'Matérias', path: '/materias' },
  { icon: Sparkles, label: 'Tutor IA', path: '/tutor' },
  { icon: Trophy, label: 'Ranking', path: '/ranking' },
  { icon: User, label: 'Perfil', path: '/perfil' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1.5 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/materias' && (
              location.pathname.startsWith('/ingles') ||
              location.pathname.startsWith('/matematica') ||
              location.pathname.startsWith('/portugues') ||
              location.pathname.startsWith('/quimica') ||
              location.pathname.startsWith('/fisica')
            )) ||
            (item.path === '/tutor' && location.pathname.startsWith('/tutor')) ||
            (item.path === '/ranking' && location.pathname.startsWith('/ranking')) ||
            (item.path === '/perfil' && location.pathname.startsWith('/perfil'));

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? 'text-primary-400'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
