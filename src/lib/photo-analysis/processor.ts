import sharp from 'sharp';
import { extractExifData } from './exif';
import { calculateQualityScore } from './quality';
import { extractColors } from './colors';

export interface ProcessedPhotoData {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'portrait' | 'landscape' | 'square';
  
  dateTaken: Date | null;
  cameraMake: string | null;
  cameraModel: string | null;
  exifOrientation: number;
  
  qualityScore: number;
  sharpnessScore: number;
  
  dominantColor: string;
  colorPalette: any[];
  
  hasFaces: boolean; // TODO: implement face detection
  faceCount: number;
}

/**
 * Main photo processing pipeline
 * Analyzes a single photo and extracts all metadata
 */
export async function processPhoto(buffer: Buffer): Promise<ProcessedPhotoData> {
  // 1. Get image metadata
  const metadata = await sharp(buffer).metadata();
  const { width = 0, height = 0 } = metadata;
  
  // 2. Extract EXIF data
  const exif = await extractExifData(buffer);
  
  // 3. Calculate quality score
  const quality = await calculateQualityScore(buffer, !!exif.dateTaken);
  
  // 4. Extract colors
  const colors = await extractColors(buffer);
  
  // 5. Determine orientation
  const aspectRatio = width / height;
  const orientation: 'portrait' | 'landscape' | 'square' = 
    aspectRatio > 1.2 ? 'landscape' :
    aspectRatio < 0.8 ? 'portrait' :
    'square';
  
  // 6. Face detection (placeholder - would use ML model)
  const hasFaces = false; // TODO: implement
  const faceCount = 0;
  
  return {
    width,
    height,
    aspectRatio,
    orientation,
    
    dateTaken: exif.dateTaken,
    cameraMake: exif.cameraMake,
    cameraModel: exif.cameraModel,
    exifOrientation: exif.orientation,
    
    qualityScore: quality.score,
    sharpnessScore: quality.sharpness,
    
    dominantColor: colors.dominantColor,
    colorPalette: colors.palette,
    
    hasFaces,
    faceCount,
  };
}

/**
 * Batch process multiple photos with progress callback
 */
export async function batchProcessPhotos(
  photos: { buffer: Buffer; filename: string }[],
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, ProcessedPhotoData>> {
  const results = new Map<string, ProcessedPhotoData>();
  
  for (let i = 0; i < photos.length; i++) {
    const { buffer, filename } = photos[i];
    
    try {
      const data = await processPhoto(buffer);
      results.set(filename, data);
      
      if (onProgress) {
        onProgress(i + 1, photos.length);
      }
    } catch (error) {
      console.error(`Failed to process ${filename}:`, error);
    }
  }
  
  return results;
}
