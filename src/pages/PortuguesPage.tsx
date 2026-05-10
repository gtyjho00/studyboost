import { PenTool, BookOpen, FileText, Library } from 'lucide-react';
import { SubjectPage } from '../components/SubjectPage';

const categories = [
  { key: 'gramatica', title: 'Gramática', icon: PenTool, color: 'from-amber-500 to-orange-400' },
  { key: 'interpretacao', title: 'Interpretação', icon: BookOpen, color: 'from-blue-500 to-cyan-400' },
  { key: 'redacao', title: 'Redação', icon: FileText, color: 'from-emerald-500 to-teal-400' },
  { key: 'literatura', title: 'Literatura', icon: Library, color: 'from-pink-500 to-rose-400' },
];

export function PortuguesPage() {
  return (
    <SubjectPage
      module="portugues"
      title="Português"
      icon={PenTool}
      color="from-amber-500 to-orange-400"
      categories={categories}
      premium
    />
  );
}
