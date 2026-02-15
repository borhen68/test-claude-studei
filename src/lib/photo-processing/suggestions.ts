/**
 * Smart Photo Suggestion Algorithm
 * Analyzes photos and highlights the best ones to use in the book
 */

import { Photo } from '../db/schema';

export interface SuggestedPhoto extends Photo {
  suggestionScore: number;
  suggestionReason: string[];
}

/**
 * Get suggested photos from a collection
 * Returns photos sorted by quality, faces, and composition
 */
export function getSuggestedPhotos(
  photos: Photo[],
  limit: number = 60
): SuggestedPhoto[] {
  const scoredPhotos = photos
    .filter(p => !p.isDuplicate)
    .map(photo => {
      const { score, reasons } = calculateSuggestionScore(photo);
      return {
        ...photo,
        suggestionScore: score,
        suggestionReason: reasons,
      };
    })
    .sort((a, b) => b.suggestionScore - a.suggestionScore)
    .slice(0, limit);

  return scoredPhotos;
}

/**
 * Calculate suggestion score for a single photo
 * Higher score = better candidate for the book
 */
function calculateSuggestionScore(photo: Photo): {
  score: number;
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  // Base quality score (0-100)
  const qualityScore = photo.qualityScore || 50;
  score += qualityScore;
  
  if (qualityScore >= 80) {
    reasons.push('High quality');
  }

  // Bonus for faces (people photos are more engaging)
  if (photo.hasFaces) {
    score += 20;
    reasons.push('Contains people');
    
    // More faces = even better (group photos)
    const faceCount = photo.faceCount || 0;
    if (faceCount >= 2) {
      score += faceCount * 5;
      reasons.push(`Group photo (${faceCount} people)`);
    }
  }

  // Bonus for good aspect ratios (easier to layout)
  const aspectRatio = parseFloat(photo.aspectRatio?.toString() || '1');
  
  // Square-ish photos (0.8 - 1.5) work best in most layouts
  if (aspectRatio >= 0.8 && aspectRatio <= 1.5) {
    score += 10;
    reasons.push('Great composition');
  }
  
  // Portrait orientation (good for hero layouts)
  if (aspectRatio > 0.6 && aspectRatio < 0.8) {
    score += 5;
    reasons.push('Portrait orientation');
  }

  // Sharpness bonus
  const sharpness = parseFloat(photo.sharpnessScore?.toString() || '0');
  if (sharpness > 0.7) {
    score += 10;
    reasons.push('Sharp & clear');
  }

  // Penalty for duplicates (should be filtered already, but double-check)
  if (photo.isDuplicate) {
    score -= 100;
    reasons.push('Duplicate (excluded)');
  }

  // Penalty for very low quality
  if (qualityScore < 30) {
    score -= 30;
    reasons.push('Low quality');
  }

  // Penalty for extreme aspect ratios (hard to layout)
  if (aspectRatio < 0.4 || aspectRatio > 2.5) {
    score -= 15;
    reasons.push('Unusual dimensions');
  }

  return { score, reasons };
}

/**
 * Check if a photo is suggested
 * Useful for UI to show badges/stars
 */
export function isPhotoSuggested(photo: Photo, suggestedPhotos: SuggestedPhoto[]): boolean {
  return suggestedPhotos.some(sp => sp.id === photo.id);
}

/**
 * Get suggestion badge text for UI
 */
export function getSuggestionBadgeText(photo: SuggestedPhoto): string {
  if (photo.suggestionScore >= 120) return 'Best Pick';
  if (photo.suggestionScore >= 100) return 'Great Choice';
  if (photo.suggestionScore >= 80) return 'Recommended';
  return 'Good';
}

/**
 * Auto-select photos when user uploads too many
 * Helps reduce decision fatigue
 */
export function autoSelectPhotos(photos: Photo[], targetCount: number = 60): Photo[] {
  const suggested = getSuggestedPhotos(photos, targetCount);
  return suggested;
}
