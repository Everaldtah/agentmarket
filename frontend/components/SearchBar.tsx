'use client';

import { useState, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category, PricingType, CategoryInfo } from '@/types';
import { api } from '@/lib/api';

interface SearchBarProps {
  onSearch: (filters: {
    query?: string;
    category?: Category;
    minRating?: number;
    pricingType?: PricingType;
  }) => void;
  showFilters?: boolean;
  className?: string;
}

export function SearchBar({ onSearch, showFilters = true, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [selectedRating, setSelectedRating] = useState<number | undefined>();
  const [selectedPricing, setSelectedPricing] = useState<PricingType | undefined>();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  const handleSearch = () => {
    onSearch({
      query: query || undefined,
      category: selectedCategory,
      minRating: selectedRating,
      pricingType: selectedPricing,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory(undefined);
    setSelectedRating(undefined);
    setSelectedPricing(undefined);
    onSearch({});
  };

  const hasActiveFilters = query || selectedCategory || selectedRating || selectedPricing;

  return (
    <div className={cn('w-full', className)}>
      {/* Main search bar */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search agents..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="btn-primary btn-md px-6"
          >
            Search
          </button>

          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={cn(
                'btn-outline btn-md flex items-center gap-2',
                showFilterPanel && 'border-primary-500 text-primary-600'
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={cn(
                'w-4 h-4 transition-transform',
                showFilterPanel && 'rotate-180'
              )} />
            </button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && showFilterPanel && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value as Category || undefined)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Min Rating
              </label>
              <select
                value={selectedRating || ''}
                onChange={(e) => setSelectedRating(Number(e.target.value) || undefined)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            {/* Pricing filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Pricing
              </label>
              <select
                value={selectedPricing || ''}
                onChange={(e) => setSelectedPricing(e.target.value as PricingType || undefined)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Pricing</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active filters badges */}
      {hasActiveFilters && !showFilterPanel && (
        <div className="mt-3 flex flex-wrap gap-2">
          {query && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              "{query}"
              <button onClick={() => setQuery('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {categories.find(c => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory(undefined)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedRating && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
              {selectedRating}+ Stars
              <button onClick={() => setSelectedRating(undefined)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedPricing && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              {selectedPricing.charAt(0).toUpperCase() + selectedPricing.slice(1)}
              <button onClick={() => setSelectedPricing(undefined)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
