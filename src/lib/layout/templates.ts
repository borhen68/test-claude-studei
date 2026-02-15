import { Photo } from '../db/schema';

export type TemplateType = 
  | 'hero' 
  | 'duo_horizontal' 
  | 'duo_vertical' 
  | 'trio_asymmetric' 
  | 'quad_grid' 
  | 'gallery_6' 
  | 'quote';

export interface LayoutPosition {
  x: number; // 0-1 (percentage)
  y: number;
  width: number;
  height: number;
}

export interface PhotoLayout {
  photoId: string;
  position: LayoutPosition;
  crop?: { x: number; y: number; width: number; height: number };
  rotation?: number;
}

export interface TemplateDefinition {
  type: TemplateType;
  photoCount: number;
  layouts: (photos: Photo[]) => PhotoLayout[];
  description: string;
}

/**
 * Template definitions
 */
export const TEMPLATES: Record<TemplateType, TemplateDefinition> = {
  hero: {
    type: 'hero',
    photoCount: 1,
    description: 'Single large photo, perfect for hero shots',
    layouts: (photos) => [{
      photoId: photos[0].id,
      position: { x: 0.05, y: 0.05, width: 0.9, height: 0.9 },
    }],
  },
  
  duo_horizontal: {
    type: 'duo_horizontal',
    photoCount: 2,
    description: 'Two landscape photos side by side',
    layouts: (photos) => [
      {
        photoId: photos[0].id,
        position: { x: 0.02, y: 0.1, width: 0.47, height: 0.8 },
      },
      {
        photoId: photos[1].id,
        position: { x: 0.51, y: 0.1, width: 0.47, height: 0.8 },
      },
    ],
  },
  
  duo_vertical: {
    type: 'duo_vertical',
    photoCount: 2,
    description: 'Two portrait photos stacked',
    layouts: (photos) => [
      {
        photoId: photos[0].id,
        position: { x: 0.15, y: 0.02, width: 0.7, height: 0.47 },
      },
      {
        photoId: photos[1].id,
        position: { x: 0.15, y: 0.51, width: 0.7, height: 0.47 },
      },
    ],
  },
  
  trio_asymmetric: {
    type: 'trio_asymmetric',
    photoCount: 3,
    description: 'Three photos in asymmetric layout',
    layouts: (photos) => [
      {
        photoId: photos[0].id,
        position: { x: 0.02, y: 0.02, width: 0.6, height: 0.96 },
      },
      {
        photoId: photos[1].id,
        position: { x: 0.64, y: 0.02, width: 0.34, height: 0.47 },
      },
      {
        photoId: photos[2].id,
        position: { x: 0.64, y: 0.51, width: 0.34, height: 0.47 },
      },
    ],
  },
  
  quad_grid: {
    type: 'quad_grid',
    photoCount: 4,
    description: 'Four photos in balanced grid',
    layouts: (photos) => [
      {
        photoId: photos[0].id,
        position: { x: 0.02, y: 0.02, width: 0.47, height: 0.47 },
      },
      {
        photoId: photos[1].id,
        position: { x: 0.51, y: 0.02, width: 0.47, height: 0.47 },
      },
      {
        photoId: photos[2].id,
        position: { x: 0.02, y: 0.51, width: 0.47, height: 0.47 },
      },
      {
        photoId: photos[3].id,
        position: { x: 0.51, y: 0.51, width: 0.47, height: 0.47 },
      },
    ],
  },
  
  gallery_6: {
    type: 'gallery_6',
    photoCount: 6,
    description: 'Six photos in mosaic layout',
    layouts: (photos) => [
      {
        photoId: photos[0].id,
        position: { x: 0.02, y: 0.02, width: 0.3, height: 0.3 },
      },
      {
        photoId: photos[1].id,
        position: { x: 0.35, y: 0.02, width: 0.3, height: 0.3 },
      },
      {
        photoId: photos[2].id,
        position: { x: 0.68, y: 0.02, width: 0.3, height: 0.3 },
      },
      {
        photoId: photos[3].id,
        position: { x: 0.02, y: 0.35, width: 0.3, height: 0.3 },
      },
      {
        photoId: photos[4].id,
        position: { x: 0.35, y: 0.35, width: 0.3, height: 0.3 },
      },
      {
        photoId: photos[5].id,
        position: { x: 0.68, y: 0.35, width: 0.3, height: 0.3 },
      },
    ],
  },
  
  quote: {
    type: 'quote',
    photoCount: 1,
    description: 'Photo with text space for quotes/captions',
    layouts: (photos) => [{
      photoId: photos[0].id,
      position: { x: 0.05, y: 0.05, width: 0.9, height: 0.6 },
    }],
  },
};

/**
 * Select best template based on photo characteristics
 */
export function selectTemplate(photos: Photo[]): TemplateType {
  const count = photos.length;
  
  if (count === 0) return 'hero';
  if (count === 1) {
    // Use hero for high-quality face photos
    return photos[0].hasFaces && (photos[0].qualityScore || 0) > 70 
      ? 'hero' 
      : 'hero';
  }
  
  if (count === 2) {
    const orientations = photos.map(p => p.orientation);
    const allLandscape = orientations.every(o => o === 'landscape');
    const allPortrait = orientations.every(o => o === 'portrait');
    
    return allLandscape ? 'duo_horizontal' : 
           allPortrait ? 'duo_vertical' : 
           'duo_horizontal'; // default
  }
  
  if (count === 3) return 'trio_asymmetric';
  if (count === 4) return 'quad_grid';
  if (count >= 6) return 'gallery_6';
  
  // Fallback
  return 'hero';
}
