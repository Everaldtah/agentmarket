'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap,
  Code,
  PenTool,
  Search,
  Settings,
  MessageSquare,
  BarChart3,
  Palette,
  GraduationCap,
  Box,
  ChevronRight,
} from 'lucide-react';
import { CategoryInfo } from '@/types';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, React.ElementType> = {
  productivity: Zap,
  coding: Code,
  writing: PenTool,
  research: Search,
  automation: Settings,
  communication: MessageSquare,
  'data-analysis': BarChart3,
  creative: Palette,
  education: GraduationCap,
  other: Box,
};

interface CategoryNavProps {
  categories: CategoryInfo[];
  activeCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  variant?: 'sidebar' | 'horizontal';
  className?: string;
}

export function CategoryNav({
  categories,
  activeCategory,
  onCategorySelect,
  variant = 'sidebar',
  className,
}: CategoryNavProps) {
  const pathname = usePathname();

  if (variant === 'horizontal') {
    return (
      <div className={cn('flex overflow-x-auto scrollbar-hide gap-2 pb-2', className)}>
        <Link
          href="/browse"
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            !activeCategory
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          All
        </Link>
        {categories.map((category) => {
          const Icon = categoryIcons[category.id] || Box;
          const isActive = activeCategory === category.id;

          return (
            <Link
              key={category.id}
              href={`/browse?category=${category.id}`}
              className={cn(
                'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav className={cn('space-y-1', className)}>
      <Link
        href="/browse"
        className={cn(
          'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
          !activeCategory
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
      >
        <span>All Categories</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {categories.reduce((sum, c) => sum + c.agentCount, 0)}
        </span>
      </Link>

      {categories.map((category) => {
        const Icon = categoryIcons[category.id] || Box;
        const isActive = activeCategory === category.id;

        return (
          <Link
            key={category.id}
            href={`/browse?category=${category.id}`}
            className={cn(
              'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors group',
              isActive
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                isActive
                  ? 'bg-primary-100 dark:bg-primary-800'
                  : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
              )}>
                <Icon className={cn(
                  'w-4 h-4',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400'
                )} />
              </div>
              <span>{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {category.agentCount}
              </span>
              <ChevronRight className={cn(
                'w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity',
                isActive && 'opacity-100'
              )} />
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
