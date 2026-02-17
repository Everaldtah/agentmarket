'use client';

import { useState } from 'react';
import {
  Download,
  Check,
  Loader2,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PricingType } from '@/types';

interface InstallButtonProps {
  agentId: string;
  pricingType: PricingType;
  agentName: string;
  variant?: 'default' | 'large';
  onInstall?: () => void;
  className?: string;
}

type InstallState = 'idle' | 'loading' | 'installed' | 'error';

export function InstallButton({
  agentId,
  pricingType,
  agentName,
  variant = 'default',
  onInstall,
  className,
}: InstallButtonProps) {
  const [state, setState] = useState<InstallState>('idle');
  const [showModal, setShowModal] = useState(false);

  const handleInstall = async () => {
    if (pricingType !== 'free') {
      setShowModal(true);
      return;
    }

    setState('loading');
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setState('installed');
      onInstall?.();
    } catch (error) {
      setState('error');
    }
  };

  const isLarge = variant === 'large';

  if (state === 'installed') {
    return (
      <button
        disabled
        className={cn(
          'inline-flex items-center gap-2 rounded-lg font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
          isLarge ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm',
          className
        )}
      >
        <Check className="w-4 h-4" />
        Installed
      </button>
    );
  }

  if (state === 'loading') {
    return (
      <button
        disabled
        className={cn(
          'inline-flex items-center gap-2 rounded-lg font-medium bg-primary-500 text-white',
          isLarge ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm',
          className
        )}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Installing...
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleInstall}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg font-medium transition-all',
          'bg-primary-500 text-white hover:bg-primary-600 active:scale-95',
          isLarge ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm',
          className
        )}
      >
        <Download className="w-4 h-4" />
        {pricingType === 'free' ? 'Install' : 'Get Started'}
      </button>

      {/* Modal for paid agents */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {pricingType === 'subscription' ? 'Subscribe to' : 'Purchase'} {agentName}
            </h3>
            
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 dark:text-slate-400">Agent</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {agentName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Pricing</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {pricingType === 'subscription' ? 'Monthly subscription' : 'One-time purchase'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 btn-secondary btn-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setState('loading');
                  setTimeout(() => {
                    setState('installed');
                    onInstall?.();
                  }, 1500);
                }}
                className="flex-1 btn-primary btn-md"
              >
                Continue
              </button>
            </div>

            <p className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
              You will be redirected to complete payment
            </p>
          </div>
        </div>
      )}
    </>
  );
}
