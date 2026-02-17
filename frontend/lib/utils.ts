import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
}

export function formatPrice(pricing: { type: string; amount?: number; currency?: string; interval?: string }): string {
  if (pricing.type === 'free') return 'Free';
  if (pricing.type === 'paid' && pricing.amount) {
    return `$${pricing.amount}`;
  }
  if (pricing.type === 'subscription' && pricing.amount) {
    return `$${pricing.amount}/${pricing.interval === 'month' ? 'mo' : 'yr'}`;
  }
  return 'Contact';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    productivity: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    coding: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    writing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    research: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    automation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    communication: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    'data-analysis': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
    creative: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
    education: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };
  return colors[category] || colors.other;
}
