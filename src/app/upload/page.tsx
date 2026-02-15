'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 20 * 1024 * 1024
    );
    setPhotos(prev => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 20 * 1024 * 1024
    );
    setPhotos(prev => [...prev, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (photos.length === 0) return;
    
    setUploading(true);
    // TODO: Implement actual upload logic
    // For now, simulate upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    // TODO: Navigate to processing page
    router.push('/processing');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {photos.length === 0 ? 'Drop Your Photos Here' : `${photos.length} Photos Uploaded`}
        </h1>

        {/* Dropzone */}
        {photos.length === 0 && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
          >
            <Upload className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg text-gray-600">
              Drag & drop 20-200 photos
            </p>
            <p className="mt-2 text-sm text-gray-500">
              or click to browse
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-500 cursor-pointer"
            >
              Browse Files
            </label>
            <p className="mt-4 text-xs text-gray-500">
              JPG, PNG, HEIC • Max 20MB each
            </p>
          </div>
        )}

        {/* Photo Grid */}
        {photos.length > 0 && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-500 disabled:bg-gray-400"
              >
                {uploading ? `Uploading... ${progress}%` : 'Create My Book'}
              </button>
              <label
                htmlFor="file-input-2"
                className="rounded-md border border-gray-300 px-6 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Upload More
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input-2"
              />
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
