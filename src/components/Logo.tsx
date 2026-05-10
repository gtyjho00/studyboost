import { BookOpen } from 'lucide-react';

export function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const sizes = { small: 'text-lg', default: 'text-xl', large: 'text-3xl' };
  const iconSizes = { small: 18, default: 22, large: 32 };

  return (
    <div className="flex items-center gap-2">
      <div className="gradient-purple rounded-lg p-1.5">
        <BookOpen size={iconSizes[size]} className="text-white" />
      </div>
      <span className={`${sizes[size]} font-bold text-white`}>
        Study<span className="text-gradient-purple">Boost</span>{' '}
        <span className="text-accent-400 text-sm font-medium">AI</span>
      </span>
    </div>
  );
}
