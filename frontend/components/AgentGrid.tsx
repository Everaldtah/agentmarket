import { Agent } from '@/types';
import { AgentCard } from './AgentCard';
import { cn } from '@/lib/utils';

interface AgentGridProps {
  agents: Agent[];
  variant?: 'default' | 'compact' | 'featured';
  columns?: 2 | 3 | 4;
  className?: string;
  emptyMessage?: string;
}

export function AgentGrid({
  agents,
  variant = 'default',
  columns = 3,
  className,
  emptyMessage = 'No agents found',
}: AgentGridProps) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-center">
          {emptyMessage}
        </p>
      </div>
    );
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn(
      'grid gap-6',
      gridCols[columns],
      className
    )}>
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          variant={variant}
        />
      ))}
    </div>
  );
}
