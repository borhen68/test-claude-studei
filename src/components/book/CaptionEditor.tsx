'use client';

import { useState } from 'react';
import { MessageSquare, MapPin, Calendar, Sparkles, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoWithCaption {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  captionPosition?: 'below' | 'overlay' | 'side';
  captionSize?: 'small' | 'medium' | 'large';
  dateTaken?: Date;
  location?: string;
}

interface CaptionEditorProps {
  bookId: string;
  photos: PhotoWithCaption[];
  onSave?: (photoId: string, caption: string, position: string, size: string) => void;
}

export function CaptionEditor({ bookId, photos, onSave }: CaptionEditorProps) {
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editPosition, setEditPosition] = useState<'below' | 'overlay' | 'side'>('below');
  const [editSize, setEditSize] = useState<'small' | 'medium' | 'large'>('small');

  const handleEdit = (photo: PhotoWithCaption) => {
    setEditingPhotoId(photo.id);
    setEditCaption(photo.caption || '');
    setEditPosition(photo.captionPosition || 'below');
    setEditSize(photo.captionSize || 'small');
  };

  const handleSave = async (photoId: string) => {
    // Save to backend
    await fetch(`/api/books/${bookId}/photos/${photoId}/caption`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption: editCaption,
        captionPosition: editPosition,
        captionSize: editSize,
      }),
    });

    onSave?.(photoId, editCaption, editPosition, editSize);
    setEditingPhotoId(null);
  };

  const generateAICaption = (photo: PhotoWithCaption): string => {
    // AI-suggested caption from EXIF data
    const parts = [];
    
    if (photo.dateTaken) {
      parts.push(new Date(photo.dateTaken).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }));
    }
    
    if (photo.location) {
      parts.push(photo.location);
    }
    
    return parts.join(' • ') || 'Add a caption to this photo';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Photo Captions</h3>
            <p className="text-sm text-gray-600">
              Add meaningful captions to your photos
            </p>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all"
            >
              {/* Photo */}
              <div className="aspect-square">
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt="Photo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption or Edit Button */}
              {editingPhotoId === photo.id ? (
                <div className="p-3 space-y-2">
                  {/* Caption Input */}
                  <textarea
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Add a caption..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />

                  {/* AI Suggestion */}
                  <button
                    onClick={() => setEditCaption(generateAICaption(photo))}
                    className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    Use AI suggestion
                  </button>

                  {/* Position & Size */}
                  <div className="flex gap-2">
                    <select
                      value={editPosition}
                      onChange={(e) => setEditPosition(e.target.value as any)}
                      className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="below">Below</option>
                      <option value="overlay">Overlay</option>
                      <option value="side">Side</option>
                    </select>
                    
                    <select
                      value={editSize}
                      onChange={(e) => setEditSize(e.target.value as any)}
                      className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  {/* Save/Cancel */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(photo.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Check className="w-3 h-3" />
                      Save
                    </button>
                    
                    <button
                      onClick={() => setEditingPhotoId(null)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3">
                  {photo.caption ? (
                    <div className="mb-2">
                      <p className="text-xs text-gray-700 line-clamp-2">
                        {photo.caption}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <p className="text-xs text-gray-400 italic">
                        No caption
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleEdit(photo)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
                  >
                    <MessageSquare className="w-3 h-3" />
                    {photo.caption ? 'Edit' : 'Add Caption'}
                  </button>
                </div>
              )}

              {/* EXIF Badge */}
              {(photo.dateTaken || photo.location) && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {photo.dateTaken && (
                    <div className="px-1.5 py-0.5 bg-black/60 text-white rounded text-xs flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                    </div>
                  )}
                  {photo.location && (
                    <div className="px-1.5 py-0.5 bg-black/60 text-white rounded text-xs flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-sm font-medium"
          >
            Add Date to All
          </button>
          
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-sm font-medium"
          >
            Add Location to All
          </button>
          
          <div className="flex-1" />
          
          <div className="text-sm text-gray-600">
            {photos.filter((p) => p.caption).length} of {photos.length} photos have captions
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact caption indicator for photo grids
 */
export function CaptionIndicator({ hasCaption }: { hasCaption: boolean }) {
  if (!hasCaption) return null;
  
  return (
    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white rounded text-xs flex items-center gap-1">
      <MessageSquare className="w-3 h-3" />
      Caption
    </div>
  );
}
