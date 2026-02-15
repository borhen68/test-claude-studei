'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImageIcon } from 'lucide-react';

interface UploadedFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  photoId?: string;
  qualityScore?: number;
  dominantColor?: string;
  error?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [bookId, setBookId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize book session on mount
  useEffect(() => {
    const initializeBook = async () => {
      try {
        const res = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            title: 'Your Story', 
            source: 'web' 
          }),
        });
        
        const data = await res.json();
        
        if (data.success && data.book) {
          setBookId(data.book.id);
          setSessionToken(data.book.sessionToken);
          
          // Store in localStorage for recovery
          localStorage.setItem('currentBookId', data.book.id);
          localStorage.setItem('currentSessionToken', data.book.sessionToken);
        } else {
          console.error('Failed to initialize book:', data.error);
        }
      } catch (error) {
        console.error('Failed to initialize book:', error);
      }
    };
    
    initializeBook();
  }, []);

  const handleFileSelect = useCallback((selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    
    // Filter valid image files (max 20MB each)
    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 20 * 1024 * 1024;
      
      if (!isImage) {
        console.warn(\`Skipping \${file.name}: not an image\`);
      } else if (!isValidSize) {
        console.warn(\`Skipping \${file.name}: file too large (max 20MB)\`);
      }
      
      return isImage && isValidSize;
    });
    
    // Create preview URLs and add to files
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
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
            if (updated[index]) {
              updated[index] = { ...updated[index], progress };
            }
            return updated;
          });
        }
      });

      const response: any = await new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);
              if (result.success) {
                resolve(result);
              } else {
                reject(new Error(result.error || 'Upload failed'));
              }
            } catch (err) {
              reject(new Error('Invalid server response'));
            }
          } else {
            reject(new Error(\`Upload failed: \${xhr.statusText}\`));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      // Update with success data including quality score
      setFiles(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            status: 'success',
            progress: 100,
            photoId: response.photo.id,
            qualityScore: response.photo.qualityScore,
            dominantColor: response.photo.dominantColor,
          };
        }
        return updated;
      });

    } catch (error) {
      console.error(\`Upload error for \${fileData.file.name}:\`, error);
      
      setFiles(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            status: 'error',
            progress: 0,
            error: error instanceof Error ? error.message : 'Upload failed',
          };
        }
        return updated;
      });
      
      throw error;
    }
  };

  const uploadAllFiles = async () => {
    if (!bookId) {
      alert('Book not initialized. Please refresh the page.');
      return;
    }

    setIsUploading(true);
    
    // Get all pending files
    const pendingIndices = files
      .map((f, i) => ({ file: f, index: i }))
      .filter(({ file }) => file.status === 'pending');
    
    if (pendingIndices.length === 0) {
      setIsUploading(false);
      return;
    }

    // Upload in batches of 3 for better performance and progress visibility
    const batchSize = 3;
    
    for (let i = 0; i < pendingIndices.length; i += batchSize) {
      const batch = pendingIndices.slice(i, i + batchSize);
      
      // Upload batch in parallel, but don't fail all if one fails
      await Promise.allSettled(
        batch.map(({ file, index }) => uploadFile(file, index))
      );
    }
    
    setIsUploading(false);
  };

  const finishAndProcess = async () => {
    if (!bookId) {
      alert('Book not initialized');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Navigate to processing page - it will handle the API call
      router.push(\`/processing?bookId=\${bookId}\`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsProcessing(false);
    }
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const pendingCount = files.filter(f => f.status === 'pending').length;
  const uploadingCount = files.filter(f => f.status === 'uploading').length;
  const allUploaded = files.length > 0 && successCount === files.length;
  const hasErrors = errorCount > 0;
  const overallProgress = files.length > 0 
    ? Math.round((successCount / files.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Upload Your Photos
          </h1>
          <p className="text-base sm:text-lg text-gray-700">
            {files.length === 0 ? (
              'Start by uploading 20-200 photos to create your story'
            ) : (
              <>
                <span className="font-semibold">{files.length}</span> photo{files.length === 1 ? '' : 's'}
                {successCount > 0 && (
                  <span className="text-green-600 ml-2">
                    • {successCount} uploaded
                  </span>
                )}
                {uploadingCount > 0 && (
                  <span className="text-blue-600 ml-2">
                    • {uploadingCount} uploading
                  </span>
                )}
                {hasErrors && (
                  <span className="text-red-600 ml-2">
                    • {errorCount} failed
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Dropzone - shown when no files */}
        {files.length === 0 && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={\`border-2 border-dashed rounded-3xl p-12 sm:p-20 text-center transition-all duration-300 \${
              isDragging
                ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-xl'
                : 'border-gray-300 hover:border-blue-400 hover:bg-white/50 shadow-lg'
            }\`}
          >
            <div className={\`transition-all duration-300 \${isDragging ? 'scale-110' : ''}\`}>
              <Upload 
                className={\`mx-auto h-16 w-16 sm:h-24 sm:w-24 \${
                  isDragging ? 'text-blue-500' : 'text-gray-400'
                }\`} 
              />
              <p className="mt-6 text-xl sm:text-2xl text-gray-800 font-semibold">
                Drag & drop your photos here
              </p>
              <p className="mt-3 text-base sm:text-lg text-gray-600">
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
                className="mt-8 inline-block rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 text-lg font-semibold text-white hover:from-blue-500 hover:to-purple-500 cursor-pointer transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse Files
              </label>
              
              <p className="mt-8 text-sm text-gray-500">
                JPG, PNG, HEIC • Max 20MB per photo • 20-200 photos recommended
              </p>
            </div>
          </div>
        )}

        {/* Photo Grid */}
        {files.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">
              {files.map((fileData, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  {/* Image */}
                  <img
                    src={fileData.preview}
                    alt={\`Photo \${index + 1}\`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Remove Button (only for pending files) */}
                  {fileData.status === 'pending' && (
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
                      title="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  
                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-2 z-10">
                    {fileData.status === 'uploading' && (
                      <div className="bg-white rounded-full p-2 shadow-lg">
                        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                      </div>
                    )}
                    {fileData.status === 'success' && (
                      <div className="bg-green-500 rounded-full p-2 shadow-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {fileData.status === 'error' && (
                      <div className="bg-red-500 rounded-full p-2 shadow-lg" title={fileData.error}>
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Quality Score Badge (after successful upload) */}
                  {fileData.status === 'success' && fileData.qualityScore !== undefined && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      Quality: {fileData.qualityScore}%
                    </div>
                  )}
                  
                  {/* Progress Bar */}
                  {fileData.status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200/50 backdrop-blur-sm">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: \`\${fileData.progress}%\` }}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add More Card */}
              <label
                htmlFor="file-input-more"
                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <Upload className="h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Add More</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                  id="file-input-more"
                />
              </label>
            </div>

            {/* Progress Bar (when uploading) */}
            {isUploading && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Uploading photos...
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {overallProgress}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: \`\${overallProgress}%\` }}
                  />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  {successCount} of {files.length} photos uploaded
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!allUploaded && (
                <button
                  onClick={uploadAllFiles}
                  disabled={isUploading || pendingCount === 0}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-5 text-lg font-semibold text-white hover:from-blue-500 hover:to-purple-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Uploading... {overallProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6" />
                      Upload {pendingCount} Photo{pendingCount === 1 ? '' : 's'}
                    </>
                  )}
                </button>
              )}
              
              {allUploaded && (
                <button
                  onClick={finishAndProcess}
                  disabled={isProcessing}
                  className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-5 text-lg font-semibold text-white hover:from-green-500 hover:to-emerald-500 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Creating Your Book...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-6 w-6" />
                      Create My Book →
                    </>
                  )}
                </button>
              )}
              
              {hasErrors && !allUploaded && (
                <button
                  onClick={() => {
                    // Retry failed uploads
                    const failedIndices = files
                      .map((f, i) => ({ file: f, index: i }))
                      .filter(({ file }) => file.status === 'error');
                    
                    failedIndices.forEach(({ index }) => {
                      setFiles(prev => {
                        const updated = [...prev];
                        updated[index] = { ...updated[index], status: 'pending', error: undefined };
                        return updated;
                      });
                    });
                  }}
                  className="rounded-xl bg-red-100 text-red-700 px-6 py-3 font-semibold hover:bg-red-200 transition-colors"
                >
                  Retry Failed ({errorCount})
                </button>
              )}
            </div>

            {/* Upload Summary */}
            {files.length > 0 && (
              <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="flex flex-wrap gap-6 justify-center text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{files.length}</div>
                    <div className="text-gray-600">Total</div>
                  </div>
                  {successCount > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{successCount}</div>
                      <div className="text-gray-600">Uploaded</div>
                    </div>
                  )}
                  {pendingCount > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{pendingCount}</div>
                      <div className="text-gray-600">Pending</div>
                    </div>
                  )}
                  {errorCount > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                      <div className="text-gray-600">Failed</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
