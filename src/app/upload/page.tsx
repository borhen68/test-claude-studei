'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadedFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  photoId?: string;
  error?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [bookId, setBookId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  // Initialize book session on mount
  useEffect(() => {
    const initializeBook = async () => {
      try {
        const res = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Your Photos', source: 'web' }),
        });
        
        const data = await res.json();
        if (data.success) {
          setBookId(data.book.id);
          setSessionToken(data.book.sessionToken);
          
          // Store in localStorage for persistence
          localStorage.setItem('currentBookId', data.book.id);
          localStorage.setItem('currentSessionToken', data.book.sessionToken);
        }
      } catch (error) {
        console.error('Failed to initialize book:', error);
      }
    };
    
    initializeBook();
  }, []);

  const handleFileSelect = useCallback((selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    const validFiles = fileArray.filter(file => 
      file.type.startsWith('image/') && file.size <= 20 * 1024 * 1024
    );
    
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const uploadFile = async (fileData: UploadedFile, index: number): Promise<void> => {
    if (!bookId) {
      throw new Error('Book not initialized');
    }

    // Update status to uploading
    setFiles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: 'uploading', progress: 0 };
      return updated;
    });

    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('bookId', bookId);

    try {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], progress };
            return updated;
          });
        }
      });

      await new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              setFiles(prev => {
                const updated = [...prev];
                updated[index] = {
                  ...updated[index],
                  status: 'success',
                  progress: 100,
                  photoId: response.photo.id,
                };
                return updated;
              });
              resolve(response);
            } else {
              reject(new Error(response.error || 'Upload failed'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });
    } catch (error) {
      setFiles(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        };
        return updated;
      });
      throw error;
    }
  };

  const uploadAllFiles = async () => {
    setIsProcessing(true);
    
    // Upload files in batches of 3 for better performance
    const batchSize = 3;
    const pendingFiles = files
      .map((f, i) => ({ file: f, index: i }))
      .filter(({ file }) => file.status === 'pending');
    
    for (let i = 0; i < pendingFiles.length; i += batchSize) {
      const batch = pendingFiles.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map(({ file, index }) => uploadFile(file, index))
      );
      
      // Update overall progress
      const completed = files.filter(f => f.status === 'success').length;
      setOverallProgress(Math.round((completed / files.length) * 100));
    }
    
    setIsProcessing(false);
  };

  const processBook = async () => {
    if (!bookId) return;
    
    setIsProcessing(true);
    
    try {
      const res = await fetch(`/api/books/${bookId}/process`, {
        method: 'POST',
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Navigate to book viewer
        router.push(`/book/${bookId}`);
      } else {
        alert('Failed to process book: ' + data.error);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Processing error:', error);
      alert('Failed to process book');
      setIsProcessing(false);
    }
  };

  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const allUploaded = files.length > 0 && successCount === files.length;
  const hasErrors = errorCount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Upload Your Photos
          </h1>
          <p className="text-gray-600">
            {files.length === 0
              ? 'Start by uploading 20-200 photos'
              : `${files.length} photo${files.length === 1 ? '' : 's'} • ${successCount} uploaded ${hasErrors ? `• ${errorCount} failed` : ''}`}
          </p>
        </div>

        {/* Dropzone */}
        {files.length === 0 && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <Upload className={`mx-auto h-20 w-20 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="mt-6 text-xl text-gray-700 font-medium">
              Drag & drop your photos here
            </p>
            <p className="mt-2 text-gray-500">
              or click to browse your files
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-500 cursor-pointer transition-colors"
            >
              Browse Files
            </label>
            <p className="mt-6 text-sm text-gray-500">
              JPG, PNG, HEIC • Max 20MB each • 20-200 photos recommended
            </p>
          </div>
        )}

        {/* Photo Grid */}
        {files.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {files.map((fileData, index) => (
                <div key={index} className="relative aspect-square group">
                  <img
                    src={fileData.preview}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  
                  {/* Status Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg" />
                  
                  {/* Remove Button */}
                  {fileData.status === 'pending' && (
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  
                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-2">
                    {fileData.status === 'uploading' && (
                      <div className="bg-white rounded-full p-1.5 shadow-lg">
                        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                      </div>
                    )}
                    {fileData.status === 'success' && (
                      <div className="bg-green-500 rounded-full p-1.5 shadow-lg">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {fileData.status === 'error' && (
                      <div className="bg-red-500 rounded-full p-1.5 shadow-lg">
                        <AlertCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  {fileData.status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${fileData.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add More Card */}
              <label
                htmlFor="file-input-2"
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Add More</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                  id="file-input-2"
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!allUploaded && (
                <button
                  onClick={uploadAllFiles}
                  disabled={isProcessing || files.every(f => f.status !== 'pending')}
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Uploading... {overallProgress}%
                    </>
                  ) : (
                    `Upload ${files.filter(f => f.status === 'pending').length} Photos`
                  )}
                </button>
              )}
              
              {allUploaded && (
                <button
                  onClick={processBook}
                  disabled={isProcessing}
                  className="flex-1 rounded-lg bg-green-600 px-6 py-4 text-lg font-semibold text-white hover:bg-green-500 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Your Book...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Create My Book
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Progress Summary */}
            {isProcessing && !allUploaded && (
              <div className="mt-6">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  {successCount} of {files.length} photos uploaded
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
