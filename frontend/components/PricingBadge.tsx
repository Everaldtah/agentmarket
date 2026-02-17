import { cn } from '@/lib/utils';
import { PricingType } from '@/types';

interface PricingBadgeProps {
  type: PricingType;
  amount?: number;
  currency?: string;
  interval?: 'month' | 'year';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PricingBadge({
  type,
  amount,
  currency = 'USD',
  interval,
  size = 'md',
  className,
}: PricingBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const config = {
    free: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      label: 'Free',
    },
    paid: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      label: amount ? `$${amount}` : 'Paid',
    },
    subscription: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-300',
      label: amount
        ? `$${amount}/${interval === 'month' ? 'mo' : 'yr'}`
        : 'Subscription',
    },
  };

  const { bg, text, label } = config[type];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        bg,
        text,
        className
      )}
    >
      {label}
    </span>
  );
}
