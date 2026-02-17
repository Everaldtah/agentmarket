import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = true,
  interactive = false,
  onChange,
  className,
}: RatingStarsProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, i) => {
          const value = i + 1;
          const isFilled = value <= Math.floor(rating);
          const isHalf = !isFilled && value - 0.5 <= rating;

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(value)}
              disabled={!interactive}
              className={cn(
                'relative',
                interactive && 'cursor-pointer hover:scale-110 transition-transform',
                !interactive && 'cursor-default'
              )}
            >
              {/* Background star */}
              <Star
                className={cn(
                  sizes[size],
                  'text-slate-300 dark:text-slate-600'
                )}
              />
              {/* Filled star */}
              <Star
                className={cn(
                  sizes[size],
                  'absolute top-0 left-0',
                  isHalf ? 'fill-yellow-400 text-yellow-400' : '',
                  isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent'
                )}
                style={{
                  clipPath: isHalf ? 'inset(0 50% 0 0)' : undefined,
                }}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={cn(
          textSizes[size],
          'text-slate-600 dark:text-slate-400 font-medium ml-1'
        )}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
