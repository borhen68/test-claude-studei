'use client';

import { Star, Sparkles } from 'lucide-react';
import { SuggestedPhoto } from '@/lib/photo-processing/suggestions';

interface PhotoSuggestionBadgeProps {
  photo: SuggestedPhoto;
  compact?: boolean;
}

export function PhotoSuggestionBadge({ photo, compact = false }: PhotoSuggestionBadgeProps) {
  const getBadgeColor = (score: number) => {
    if (score >= 120) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    if (score >= 100) return 'bg-gradient-to-r from-blue-500 to-purple-600';
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    return 'bg-gray-500';
  };

  const getBadgeText = (score: number) => {
    if (score >= 120) return 'Best Pick';
    if (score >= 100) return 'Great Choice';
    if (score >= 80) return 'Recommended';
    return 'Good';
  };

  const badgeColor = getBadgeColor(photo.suggestionScore);
  const badgeText = getBadgeText(photo.suggestionScore);

  if (compact) {
    return (
      <div className={`absolute top-2 right-2 ${badgeColor} text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg`}>
        <Star className="w-3 h-3 fill-current" />
        {photo.suggestionScore >= 120 && <Sparkles className="w-3 h-3" />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className={`${badgeColor} text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md`}>
        <Star className="w-4 h-4 fill-current" />
        {badgeText}
        {photo.suggestionScore >= 120 && <Sparkles className="w-4 h-4" />}
      </div>
      
      {photo.suggestionReason && photo.suggestionReason.length > 0 && (
        <div className="text-xs text-gray-600 flex flex-wrap gap-1">
          {photo.suggestionReason.slice(0, 2).map((reason, i) => (
            <span key={i} className="bg-gray-100 px-2 py-0.5 rounded">
              {reason}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function SuggestionsSummary({ 
  totalPhotos, 
  suggestedCount 
}: { 
  totalPhotos: number; 
  suggestedCount: number; 
}) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="bg-white p-2 rounded-lg">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Smart Suggestions Ready
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            We've analyzed your {totalPhotos} photos and highlighted the best {suggestedCount} for your book.
          </p>
          <p className="text-xs text-gray-500">
            Look for the <Star className="w-3 h-3 inline fill-current text-yellow-500" /> star badge on recommended photos.
          </p>
        </div>
      </div>
    </div>
  );
}
