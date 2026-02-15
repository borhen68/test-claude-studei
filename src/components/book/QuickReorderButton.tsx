'use client';

import { useState } from 'react';
import { RotateCcw, Check, Loader2, Package, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickReorderButtonProps {
  bookId: string;
  bookTitle: string;
  lastOrderId?: string;
  lastOrderDate?: Date;
  lastOrderTotal?: number;
  onReorderComplete?: (newOrderId: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

export function QuickReorderButton({
  bookId,
  bookTitle,
  lastOrderId,
  lastOrderDate,
  lastOrderTotal,
  onReorderComplete,
  size = 'md',
  variant = 'primary',
}: QuickReorderButtonProps) {
  const [isReordering, setIsReordering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleQuickReorder = async () => {
    try {
      setIsReordering(true);

      const response = await fetch(`/api/books/${bookId}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastOrderId,
          // Quick reorder uses same shipping address as last order
          useLastShipping: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        onReorderComplete?.(data.orderId);

        // Redirect to checkout or show success
        if (data.checkoutUrl) {
          setTimeout(() => {
            window.location.href = data.checkoutUrl;
          }, 1000);
        }
      } else {
        alert(data.error || 'Failed to create reorder');
      }
    } catch (error) {
      console.error('Reorder failed:', error);
      alert('Failed to reorder. Please try again.');
    } finally {
      setIsReordering(false);
    }
  };

  const handleReorderWithChanges = () => {
    // Navigate to checkout with pre-filled data
    window.location.href = `/checkout?bookId=${bookId}&reorder=true`;
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl',
    secondary:
      'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl',
    outline:
      'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 bg-white',
  };

  if (showSuccess) {
    return (
      <button
        disabled
        className={cn(
          'inline-flex items-center gap-2 font-semibold rounded-lg transition-all',
          'bg-green-500 text-white cursor-not-allowed',
          sizeClasses[size]
        )}
      >
        <Check className="w-5 h-5" />
        Reordered!
      </button>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleQuickReorder}
        disabled={isReordering}
        className={cn(
          'inline-flex items-center gap-2 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size]
        )}
      >
        {isReordering ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Reordering...
          </>
        ) : (
          <>
            <RotateCcw className="w-5 h-5" />
            {size === 'sm' ? 'Reorder' : 'Quick Reorder'}
          </>
        )}
      </button>

      {/* Options dropdown */}
      {!isReordering && (
        <button
          onClick={() => setShowOptions(!showOptions)}
          className={cn(
            'ml-1 px-2 py-2 rounded-lg transition-all',
            variantClasses[variant]
          )}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}

      {/* Dropdown menu */}
      {showOptions && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="font-semibold text-gray-900 text-sm">
              Reorder Options
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {bookTitle}
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => {
                handleQuickReorder();
                setShowOptions(false);
              }}
              className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors text-left"
            >
              <Truck className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">
                  Quick Reorder
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Same address, same options
                  {lastOrderTotal && (
                    <span className="block mt-1 font-semibold text-purple-600">
                      ${(lastOrderTotal / 100).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                handleReorderWithChanges();
                setShowOptions(false);
              }}
              className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors text-left"
            >
              <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">
                  Reorder with Changes
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Update address or options
                </div>
              </div>
            </button>
          </div>

          {lastOrderDate && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="text-xs text-gray-600">
                Last ordered:{' '}
                <span className="font-medium">
                  {new Date(lastOrderDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
}

/**
 * Simplified reorder button for compact spaces
 */
export function ReorderButton({
  bookId,
  compact = false,
}: {
  bookId: string;
  compact?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/books/${bookId}/reorder`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Reorder failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
        title="Reorder this book"
      >
        <RotateCcw className="w-4 h-4" />
        {isLoading ? 'Loading...' : 'Reorder'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
    >
      <RotateCcw className="w-5 h-5" />
      {isLoading ? 'Processing...' : 'Reorder Book'}
    </button>
  );
}
