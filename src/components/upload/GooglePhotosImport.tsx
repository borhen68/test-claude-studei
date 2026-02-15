'use client';

import { useState } from 'react';
import { Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface GooglePhotosImportProps {
  bookId: string;
  onImportComplete?: (photoCount: number) => void;
}

export function GooglePhotosImport({ bookId, onImportComplete }: GooglePhotosImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'authorizing' | 'importing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [importedCount, setImportedCount] = useState(0);

  const handleImport = async () => {
    setIsImporting(true);
    setStatus('authorizing');
    setMessage('Opening Google Photos authorization...');

    try {
      // Open OAuth window
      const authWindow = window.open(
        `/api/import/google-photos?bookId=${bookId}`,
        'google-photos-auth',
        'width=600,height=700'
      );

      if (!authWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.data.type === 'google-photos-auth-success') {
          setStatus('importing');
          setMessage('Fetching your photos from Google...');

          const { code } = event.data;

          // Call import endpoint
          const response = await fetch(`/api/import/google-photos/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId, code }),
          });

          const data = await response.json();

          if (data.success) {
            setStatus('success');
            setImportedCount(data.photoCount || 0);
            setMessage(`Successfully imported ${data.photoCount} photos!`);
            onImportComplete?.(data.photoCount);
          } else {
            throw new Error(data.error || 'Import failed');
          }
        } else if (event.data.type === 'google-photos-auth-error') {
          throw new Error(event.data.error || 'Authorization failed');
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    } catch (error) {
      console.error('Import error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Import failed');
      setIsImporting(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white hover:border-blue-400 transition-colors">
      <div className="flex flex-col items-center text-center">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full mb-4">
          <ImageIcon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Import from Google Photos
        </h3>

        <p className="text-sm text-gray-600 mb-4 max-w-md">
          Connect your Google account to import photos directly. No need to download and re-upload!
        </p>

        {status === 'idle' && (
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <ImageIcon className="w-5 h-5" />
            Import from Google Photos
          </button>
        )}

        {status === 'authorizing' && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        {status === 'importing' && (
          <div className="flex items-center gap-2 text-purple-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">{message}</span>
            </div>
            <p className="text-sm text-gray-600">
              Your photos are being processed. Refresh the page to see them.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <span className="font-semibold">{message}</span>
            </div>
            <button
              onClick={() => {
                setStatus('idle');
                setIsImporting(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 w-full">
          <div className="flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-500">
              <p className="mb-1">
                <strong>Privacy Note:</strong> We only request read-only access to your photos.
              </p>
              <p>
                Your photos are imported directly to your book. We don't store your Google credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GooglePhotosQuickImport({ 
  bookId,
  onStart,
  onComplete 
}: { 
  bookId: string;
  onStart?: () => void;
  onComplete?: (count: number) => void;
}) {
  const [isImporting, setIsImporting] = useState(false);

  const handleClick = () => {
    setIsImporting(true);
    onStart?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isImporting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 transition-all disabled:opacity-50"
    >
      {isImporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Importing...
        </>
      ) : (
        <>
          <ImageIcon className="w-4 h-4" />
          Import from Google Photos
        </>
      )}
    </button>
  );
}
