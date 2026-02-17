'use client';

import Link from 'next/link';
import { Download, User, CheckCircle } from 'lucide-react';
import { Agent } from '@/types';
import { RatingStars } from './RatingStars';
import { PricingBadge } from './PricingBadge';
import { formatNumber, getCategoryColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: Agent;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function AgentCard({ agent, variant = 'default', className }: AgentCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/agent/${agent.id}`}
        className={cn(
          'card-hover p-4 flex items-center gap-4',
          className
        )}
      >
        <img
          src={agent.thumbnailUrl}
          alt={agent.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {agent.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {agent.shortDescription}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <RatingStars rating={agent.rating} size="sm" />
            <PricingBadge type={agent.pricing.type} size="sm" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/agent/${agent.id}`}
        className={cn(
          'group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900',
          className
        )}
      >
        <div className="absolute inset-0 opacity-30">
          <img
            src={agent.thumbnailUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <img
                src={agent.author.avatarUrl}
                alt={agent.author.name}
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-white">
                    {agent.author.name}
                  </span>
                  {agent.author.verified && (
                    <CheckCircle className="w-4 h-4 text-primary-400" />
                  )}
                </div>
                <span className="text-xs text-slate-400">Developer</span>
              </div>
            </div>
            <PricingBadge type={agent.pricing.type} size="sm" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {agent.name}
          </h3>
          <p className="text-slate-300 text-sm mb-4 line-clamp-2">
            {agent.shortDescription}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-white">
                <RatingStars rating={agent.rating} size="sm" showValue={false} />
                <span className="text-sm">{agent.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Download className="w-4 h-4" />
                <span className="text-sm">{formatNumber(agent.installCount)}</span>
              </div>
            </div>
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              getCategoryColor(agent.category)
            )}>
              {agent.category.replace('-', ' ')}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/agent/${agent.id}`}
      className={cn('card-hover overflow-hidden group', className)}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={agent.thumbnailUrl}
          alt={agent.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <PricingBadge type={agent.pricing.type} amount={agent.pricing.amount} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className={cn(
          'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3',
          getCategoryColor(agent.category)
        )}>
          {agent.category.replace('-', ' ')}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">
          {agent.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {agent.shortDescription}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <RatingStars rating={agent.rating} size="sm" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              ({formatNumber(agent.reviewCount)})
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Download className="w-4 h-4" />
            <span className="text-sm">{formatNumber(agent.installCount)}</span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <img
            src={agent.author.avatarUrl}
            alt={agent.author.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            by {agent.author.name}
          </span>
          {agent.author.verified && (
            <CheckCircle className="w-4 h-4 text-primary-500" />
          )}
        </div>
      </div>
    </Link>
  );
}
