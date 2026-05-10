import { Atom, Gauge, Thermometer, Lightbulb, Zap } from 'lucide-react';
import { SubjectPage } from '../components/SubjectPage';

const categories = [
  { key: 'mecanica', title: 'Mecânica', icon: Gauge, color: 'from-blue-500 to-cyan-400' },
  { key: 'termodinamica', title: 'Termodinâmica', icon: Thermometer, color: 'from-red-500 to-rose-400' },
  { key: 'otica', title: 'Óptica', icon: Lightbulb, color: 'from-amber-500 to-orange-400' },
  { key: 'eletricidade', title: 'Eletricidade', icon: Zap, color: 'from-emerald-500 to-teal-400' },
];

export function FisicaPage() {
  return (
    <SubjectPage
      module="fisica"
      title="Física"
      icon={Atom}
      color="from-violet-500 to-purple-400"
      categories={categories}
      premium
    />
  );
}
