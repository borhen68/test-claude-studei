import { Photo } from '../db/schema';

/**
 * Smart photo sorting algorithm
 * Prioritizes chronological order with quality weighting
 */
export function sortPhotos(photos: Photo[]): Photo[] {
  return photos.sort((a, b) => {
    // 1. Chronological first (if dates available)
    if (a.dateTaken && b.dateTaken) {
      const timeDiff = a.dateTaken.getTime() - b.dateTaken.getTime();
      // Only use chronological if photos are more than 1 day apart
      if (Math.abs(timeDiff) > 86400000) {
        return timeDiff;
      }
    }
    
    // 2. Quality-weighted sorting for same-day or no dates
    const scoreA = (a.qualityScore || 50) + (a.hasFaces ? 15 : 0);
    const scoreB = (b.qualityScore || 50) + (b.hasFaces ? 15 : 0);
    
    return scoreB - scoreA; // Higher scores first
  });
}

/**
 * Group photos into chapters/sections based on time gaps
 */
export function groupIntoChapters(photos: Photo[]): Photo[][] {
  if (photos.length === 0) return [];
  
  const chapters: Photo[][] = [];
  let currentChapter: Photo[] = [photos[0]];
  
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  
  for (let i = 1; i < photos.length; i++) {
    const prev = photos[i - 1];
    const current = photos[i];
    
    // Check if there's a significant time gap
    if (prev.dateTaken && current.dateTaken) {
      const gap = Math.abs(current.dateTaken.getTime() - prev.dateTaken.getTime());
      
      if (gap > ONE_WEEK) {
        // Start new chapter
        chapters.push(currentChapter);
        currentChapter = [current];
        continue;
      }
    }
    
    // Same chapter
    currentChapter.push(current);
    
    // Cap chapter size
    if (currentChapter.length >= 20) {
      chapters.push(currentChapter);
      currentChapter = [];
    }
  }
  
  // Push remaining photos
  if (currentChapter.length > 0) {
    chapters.push(currentChapter);
  }
  
  return chapters;
}

/**
 * Select hero photos (best quality, faces, interesting moments)
 */
export function selectHeroPhotos(photos: Photo[], count: number = 3): Photo[] {
  return photos
    .filter(p => (p.qualityScore || 0) > 70) // High quality only
    .sort((a, b) => {
      // Prioritize face photos
      if (a.hasFaces && !b.hasFaces) return -1;
      if (!a.hasFaces && b.hasFaces) return 1;
      
      // Then by quality
      return (b.qualityScore || 0) - (a.qualityScore || 0);
    })
    .slice(0, count);
}
