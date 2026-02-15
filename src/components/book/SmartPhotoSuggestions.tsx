'use client';

import { useState, useMemo } from 'react';
import { Sparkles, TrendingUp, Eye, Image as ImageIcon } from 'lucide-react';
import { PhotoQualityBadge, TopPhotosIndicator } from './PhotoQualityBadge';
import { cn } from '@/lib/utils';

interface Photo {
  id: string;
  thumbnailUrl: string | null;
  processedUrl: string | null;
  originalUrl: string;
  qualityScore: number;
  hasFaces: boolean;
  faceCount: number;
  sharpnessScore: number | null;
  orientation: 'portrait' | 'landscape' | 'square';
}

interface SmartPhotoSuggestionsProps {
  photos: Photo[];
  onPhotoSelect?: (photoId: string) => void;
  maxSuggestions?: number;
  showThumbnails?: boolean;
}

export function SmartPhotoSuggestions({
  photos,
  onPhotoSelect,
  maxSuggestions = 20,
  showThumbnails = true,
}: SmartPhotoSuggestionsProps) {
  const [selectedTab, setSelectedTab] = useState<'top' | 'faces' | 'sharp'>('top');

  // Calculate top photos by quality score
  const topPhotos = useMemo(() => {
    return [...photos]
      .sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))
      .slice(0, maxSuggestions)
      .map((photo, index) => ({
        ...photo,
        rank: index + 1,
      }));
  }, [photos, maxSuggestions]);

  // Photos with faces (great for covers)
  const photosWithFaces = useMemo(() => {
    return [...photos]
      .filter((p) => p.hasFaces && p.faceCount > 0)
      .sort((a, b) => {
        // Prioritize: face count, then quality
        if (a.faceCount !== b.faceCount) {
          return b.faceCount - a.faceCount;
        }
        return (b.qualityScore || 0) - (a.qualityScore || 0);
      })
      .slice(0, maxSuggestions);
  }, [photos, maxSuggestions]);

  // Sharpest photos
  const sharpestPhotos = useMemo(() => {
    return [...photos]
      .filter((p) => p.sharpnessScore !== null)
      .sort((a, b) => (b.sharpnessScore || 0) - (a.sharpnessScore || 0))
      .slice(0, maxSuggestions);
  }, [photos, maxSuggestions]);

  const getActivePhotos = () => {
    switch (selectedTab) {
      case 'top':
        return topPhotos;
      case 'faces':
        return photosWithFaces;
      case 'sharp':
        return sharpestPhotos;
      default:
        return topPhotos;
    }
  };

  const activePhotos = getActivePhotos();

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Smart Photo Suggestions
          </h3>
          <p className="text-sm text-gray-600">
            We've analyzed {photos.length} photos and picked the best ones for you
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('top')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2',
            selectedTab === 'top'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )}
        >
          <TrendingUp className="w-4 h-4" />
          Top {maxSuggestions}
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
            {topPhotos.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('faces')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2',
            selectedTab === 'faces'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )}
        >
          <Eye className="w-4 h-4" />
          With Faces
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            {photosWithFaces.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('sharp')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2',
            selectedTab === 'sharp'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )}
        >
          <ImageIcon className="w-4 h-4" />
          Sharpest
          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
            {sharpestPhotos.length}
          </span>
        </button>
      </div>

      {/* Photo Grid */}
      {showThumbnails && activePhotos.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
          {activePhotos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => onPhotoSelect?.(photo.id)}
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-all hover:scale-105 hover:shadow-lg"
            >
              <img
                src={photo.thumbnailUrl || photo.processedUrl || photo.originalUrl}
                alt={`Suggested photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Rank badge for top photos */}
              {selectedTab === 'top' && 'rank' in photo && (
                <TopPhotosIndicator rank={photo.rank} />
              )}

              {/* Quality badge on hover */}
              <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <PhotoQualityBadge qualityScore={photo.qualityScore || 0} size="sm" />
              </div>

              {/* Face count indicator */}
              {photo.hasFaces && photo.faceCount > 0 && (
                <div className="absolute top-1 right-1">
                  <div className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                    {photo.faceCount} {photo.faceCount === 1 ? 'face' : 'faces'}
                  </div>
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {activePhotos.length === 0 ? (
            <p>No photos match this criteria</p>
          ) : (
            <p>Showing {activePhotos.length} suggested photos</p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {topPhotos.length}
            </div>
            <div className="text-xs text-gray-600">Top Quality</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {photosWithFaces.length}
            </div>
            <div className="text-xs text-gray-600">With People</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {sharpestPhotos.length}
            </div>
            <div className="text-xs text-gray-600">Sharp & Clear</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm text-purple-800">
          💡 <strong>Tip:</strong>{' '}
          {selectedTab === 'top' &&
            'These photos have the highest overall quality scores. Perfect for your best pages!'}
          {selectedTab === 'faces' &&
            'Photos with people make great cover photos and memorable spreads.'}
          {selectedTab === 'sharp' &&
            'Super sharp photos look amazing when printed large.'}
        </p>
      </div>
    </div>
  );
}
