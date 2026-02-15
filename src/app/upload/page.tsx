'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Info, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    const initializeBook = async () => {
      const existingBookId = localStorage.getItem('currentBookId');
      const existingToken = localStorage.getItem('currentSessionToken');
      
      if (existingBookId && existingToken) {
        try {
          const res = await fetch(`/api/books?id=${existingBookId}`);
          const data = await res.json();
          
          if (data.success && data.book) {
            setBookId(existingBookId);
            setSessionToken(existingToken);
            return;
          }
        } catch (error) {
          console.log('Previous book not found, creating new one');
        }
      }
      
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
          localStorage.setItem('currentBookId', data.book.id);
          localStorage.setItem('currentSessionToken', data.book.sessionToken);
        }
      } catch (error) {
        console.error('Failed to initialize book:', error);
      }
    };
    
    initializeBook();
  }, []);

  const handleFileSelect = (selectedFiles: FileList | File[]) => {
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
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadFile = async (fileData: UploadedFile, index: number): Promise<void> => {
    if (!bookId) throw new Error('Book not initialized');

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

      await new Promise<void>((resolve, reject) => {
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
              resolve();
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
    const batchSize = 3;
    const pendingFiles = files
      .map((f, i) => ({ file: f, index: i }))
      .filter(({ file }) => file.status === 'pending');
    
    for (let i = 0; i < pendingFiles.length; i += batchSize) {
      const batch = pendingFiles.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map(({ file, index }) => uploadFile(file, index))
      );
      
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
        router.push(`/processing?bookId=${bookId}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/50 to-amber-50/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => router.push('/')}
            className="text-sm text-neutral-600 hover:text-neutral-900 mb-4 inline-flex items-center gap-2 transition-colors"
            aria-label="Back to Home"
          >
            ← Back
          </button>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-neutral-900 to-neutral-700 bg-clip-text text-transparent mb-4">
            Upload Your Photos
          </h1>
          <p className="text-xl text-neutral-600">
            {files.length === 0
              ? 'Start by uploading 20-200 photos • No account needed!'
              : `${files.length} photo${files.length === 1 ? '' : 's'} selected • ${successCount} uploaded ${errorCount > 0 ? `• ${errorCount} failed` : ''}`}
          </p>
        </motion.div>

        {/* Guest Notice */}
        <motion.div 
          className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-6 flex items-start gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex-shrink-0 p-3 bg-blue-100 rounded-2xl">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 text-lg mb-1">No Account Needed!</h3>
            <p className="text-blue-800 leading-relaxed">
              Create your book now, and you'll only need to sign in (or continue as guest) when you're ready to checkout.
            </p>
          </div>
        </motion.div>

        {/* Dropzone */}
        {files.length === 0 && (
          <motion.div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-4 border-dashed rounded-3xl p-20 text-center transition-all duration-300 ${
              isDragging
                ? 'border-violet-500 bg-violet-50 scale-[1.02] shadow-2xl'
                : 'border-neutral-300 bg-white/50 backdrop-blur-sm hover:border-violet-400 hover:bg-violet-50/50'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{
                y: isDragging ? -10 : 0,
                scale: isDragging ? 1.1 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="inline-flex p-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl mb-6">
                <Upload className={`h-16 w-16 ${isDragging ? 'text-violet-600' : 'text-violet-500'}`} />
              </div>
              <h3 className="text-3xl font-bold text-neutral-900 mb-3">
                Drop Your Photos Here
              </h3>
              <p className="text-lg text-neutral-600 mb-6">
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
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-violet-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <Plus className="h-6 w-6" />
                Browse Files
              </label>
              <p className="mt-8 text-sm text-neutral-500">
                JPG, PNG, HEIC • Max 20MB each • 20-200 photos recommended
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Photo Masonry Grid */}
        {files.length > 0 && (
          <div className="space-y-8">
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
              <AnimatePresence>
                {files.map((fileData, index) => (
                  <motion.div
                    key={index}
                    className="relative mb-4 break-inside-avoid group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                      <img
                        src={fileData.preview}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {fileData.status === 'pending' && (
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                          aria-label="Remove photo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      
                      <div className="absolute bottom-3 right-3">
                        {fileData.status === 'uploading' && (
                          <div className="bg-white rounded-full p-2 shadow-lg">
                            <Loader2 className="h-5 w-5 text-violet-600 animate-spin" />
                          </div>
                        )}
                        {fileData.status === 'success' && (
                          <motion.div 
                            className="bg-green-500 rounded-full p-2 shadow-lg"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          >
                            <CheckCircle className="h-5 w-5 text-white" />
                          </motion.div>
                        )}
                        {fileData.status === 'error' && (
                          <div className="bg-red-500 rounded-full p-2 shadow-lg">
                            <AlertCircle className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      
                      {fileData.status === 'uploading' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30 overflow-hidden rounded-b-2xl">
                          <motion.div
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${fileData.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Add More Card */}
              <motion.label
                htmlFor="file-input-2"
                className="relative flex items-center justify-center aspect-square border-4 border-dashed border-neutral-300 rounded-2xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all duration-300 group mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-center p-6">
                  <div className="inline-flex p-4 bg-violet-100 rounded-2xl mb-3 group-hover:bg-violet-200 transition-colors">
                    <Plus className="h-8 w-8 text-violet-600" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-700">Add More</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                  id="file-input-2"
                />
              </motion.label>
            </div>

            {/* Actions */}
            <motion.div 
              className="sticky bottom-8 left-0 right-0 bg-white/80 backdrop-blur-lg border-2 border-neutral-200 rounded-3xl p-6 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {!allUploaded && (
                  <motion.button
                    onClick={uploadAllFiles}
                    disabled={isProcessing || files.every(f => f.status !== 'pending')}
                    className="flex-1 w-full sm:w-auto rounded-full bg-gradient-to-br from-violet-600 to-purple-700 px-8 py-4 text-lg font-bold text-white shadow-xl hover:shadow-2xl hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 hover:-translate-y-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Uploading... {overallProgress}%
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6" />
                        Upload {files.filter(f => f.status === 'pending').length} Photos
                      </>
                    )}
                  </motion.button>
                )}
                
                {allUploaded && (
                  <motion.button
                    onClick={processBook}
                    disabled={isProcessing}
                    className="flex-1 w-full sm:w-auto rounded-full bg-gradient-to-br from-green-600 to-emerald-700 px-8 py-4 text-lg font-bold text-white shadow-xl hover:shadow-2xl hover:shadow-green-500/40 disabled:opacity-50 transition-all flex items-center justify-center gap-3 hover:-translate-y-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-6 w-6" />
                        Create My Book
                      </>
                    )}
                  </motion.button>
                )}

                <div className="text-center sm:text-left">
                  <p className="text-sm text-neutral-600">
                    <strong className="text-neutral-900">{successCount}</strong> of <strong className="text-neutral-900">{files.length}</strong> uploaded
                  </p>
                </div>
              </div>

              {isProcessing && !allUploaded && (
                <div className="mt-4">
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
