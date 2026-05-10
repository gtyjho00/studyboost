import { FlaskConical, Atom, Beaker, TestTube } from 'lucide-react';
import { SubjectPage } from '../components/SubjectPage';

const categories = [
  { key: 'basica', title: 'Básica', icon: Beaker, color: 'from-blue-500 to-cyan-400' },
  { key: 'tabela_periodica', title: 'Tabela Periódica', icon: Atom, color: 'from-emerald-500 to-teal-400' },
  { key: 'reacoes', title: 'Reações', icon: TestTube, color: 'from-pink-500 to-rose-400' },
  { key: 'organica', title: 'Orgânica', icon: FlaskConical, color: 'from-amber-500 to-orange-400' },
];

export function QuimicaPage() {
  return (
    <SubjectPage
      module="quimica"
      title="Química"
      icon={FlaskConical}
      color="from-pink-500 to-rose-400"
      categories={categories}
      premium
    />
  );
}
