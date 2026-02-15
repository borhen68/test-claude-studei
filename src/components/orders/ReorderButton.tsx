'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Loader2 } from 'lucide-react';

interface ReorderButtonProps {
  bookId: string;
  orderNumber?: string;
}

export function ReorderButton({ bookId, orderNumber }: ReorderButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReorder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/books/${bookId}/reorder`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to reorder');
      }

      // Redirect to preview page
      router.push(data.redirectUrl);
    } catch (err) {
      console.error('Error reordering:', err);
      setError(err instanceof Error ? err.message : 'Failed to reorder');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleReorder}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Cloning book...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Reorder This Book
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Skip the upload! We'll use the same photos and layout from {orderNumber || 'your previous order'}.
      </p>
    </div>
  );
}
