'use client';

import { useState } from 'react';
import { Image as ImageIcon, CheckCircle2, Loader2, AlertCircle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GooglePhotosImportProps {
  onImportComplete?: (photoUrls: string[]) => void;
  maxPhotos?: number;
}

export function GooglePhotosImport({
  onImportComplete,
  maxPhotos = 200,
}: GooglePhotosImportProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleConnectGoogle = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Open OAuth popup
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        '/api/import/google-photos/auth',
        'GooglePhotosAuth',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
      );

      // Listen for OAuth callback
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'GOOGLE_PHOTOS_AUTH_SUCCESS') {
          setIsConnected(true);
          fetchAlbums(event.data.accessToken);
          popup?.close();
          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'GOOGLE_PHOTOS_AUTH_ERROR') {
          setError(event.data.error || 'Failed to connect to Google Photos');
          popup?.close();
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup was blocked
      if (!popup || popup.closed) {
        setError('Pop-up blocked. Please allow pop-ups and try again.');
        window.removeEventListener('message', handleMessage);
      }
    } catch (err) {
      console.error('Google Photos connection error:', err);
      setError('Failed to connect. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchAlbums = async (accessToken: string) => {
    try {
      const response = await fetch('/api/import/google-photos/albums', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAlbums(data.albums || []);
      } else {
        setError('Failed to fetch albums');
      }
    } catch (err) {
      console.error('Failed to fetch albums:', err);
      setError('Failed to load albums');
    }
  };

  const handleImportAlbum = async (albumId: string) => {
    try {
      setIsImporting(true);
      setImportProgress(0);
      setError(null);

      const response = await fetch('/api/import/google-photos/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          albumId,
          maxPhotos,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setImportProgress(100);
        onImportComplete?.(data.photoUrls);
        
        // Show success for 2 seconds
        setTimeout(() => {
          setIsImporting(false);
          setImportProgress(0);
        }, 2000);
      } else {
        setError(data.error || 'Import failed');
      }
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import photos');
    } finally {
      setTimeout(() => setIsImporting(false), 2000);
    }
  };

  const handleImportAll = async () => {
    try {
      setIsImporting(true);
      setImportProgress(0);
      setError(null);

      const response = await fetch('/api/import/google-photos/import-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxPhotos,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setImportProgress(100);
        onImportComplete?.(data.photoUrls);
      } else {
        setError(data.error || 'Import failed');
      }
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import photos');
    } finally {
      setTimeout(() => setIsImporting(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Import from Google Photos</h3>
          <p className="text-sm text-gray-600">
            Select photos from your Google Photos library
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-red-900">Error</div>
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      {!isConnected ? (
        /* Connect Button */
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-600 max-w-md mx-auto">
              Connect your Google Photos account to import your favorite memories directly into your photo book.
            </p>
          </div>

          <button
            onClick={handleConnectGoogle}
            disabled={isConnecting}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Connect Google Photos
              </>
            )}
          </button>

          <p className="mt-4 text-xs text-gray-500">
            We'll only access photos you choose to import. Your privacy is protected.
          </p>
        </div>
      ) : (
        /* Album Selection */
        <div>
          {isImporting && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="font-semibold text-purple-900">
                  Importing photos...
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
              <p className="text-sm text-purple-700 mt-2">{importProgress}% complete</p>
            </div>
          )}

          {!isImporting && (
            <>
              {/* Import All Button */}
              <button
                onClick={handleImportAll}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 mb-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors font-semibold shadow-lg"
              >
                <Download className="w-5 h-5" />
                Import Recent Photos ({maxPhotos} max)
              </button>

              {/* Albums Grid */}
              {albums.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Or choose an album:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {albums.map((album) => (
                      <button
                        key={album.id}
                        onClick={() => {
                          setSelectedAlbumId(album.id);
                          handleImportAlbum(album.id);
                        }}
                        className={cn(
                          'relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-lg',
                          selectedAlbumId === album.id
                            ? 'border-purple-600 ring-4 ring-purple-200'
                            : 'border-gray-200 hover:border-purple-400'
                        )}
                      >
                        {album.coverPhotoUrl ? (
                          <img
                            src={album.coverPhotoUrl}
                            alt={album.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <div className="text-white text-sm font-semibold truncate">
                            {album.title}
                          </div>
                          <div className="text-white/80 text-xs">
                            {album.mediaItemsCount} photos
                          </div>
                        </div>

                        {selectedAlbumId === album.id && (
                          <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {albums.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No albums found. Try importing recent photos instead.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> You can import up to {maxPhotos} photos at once. We'll automatically optimize them for printing.
        </p>
      </div>
    </div>
  );
}
