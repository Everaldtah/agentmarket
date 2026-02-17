'use client';

import { useState } from 'react';
import { ThumbsUp, MoreHorizontal } from 'lucide-react';
import { Review } from '@/types';
import { RatingStars } from './RatingStars';
import { formatRelativeTime, cn } from '@/lib/utils';

interface ReviewListProps {
  reviews: Review[];
  maxVisible?: number;
  className?: string;
}

export function ReviewList({ reviews, maxVisible = 5, className }: ReviewListProps) {
  const [showAll, setShowAll] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());

  const visibleReviews = showAll ? reviews : reviews.slice(0, maxVisible);
  const hasMore = reviews.length > maxVisible;

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  if (reviews.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <p className="text-slate-600 dark:text-slate-400">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {visibleReviews.map((review) => {
        const isHelpful = helpfulReviews.has(review.id);
        
        return (
          <div
            key={review.id}
            className="pb-6 border-b border-slate-200 dark:border-slate-700 last:border-0"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <img
                src={review.userAvatarUrl}
                alt={review.userName}
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {review.userName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars rating={review.rating} size="sm" showValue={false} />
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatRelativeTime(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Comment */}
                <p className="mt-3 text-slate-700 dark:text-slate-300">
                  {review.comment}
                </p>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-4">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={cn(
                      'flex items-center gap-1.5 text-sm transition-colors',
                      isHelpful
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    )}
                  >
                    <ThumbsUp className={cn('w-4 h-4', isHelpful && 'fill-current')} />
                    Helpful ({review.helpful + (isHelpful ? 1 : 0)})
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Show more button */}
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 text-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          Show all {reviews.length} reviews
        </button>
      )}
    </div>
  );
}
