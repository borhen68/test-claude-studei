/**
 * Photo Processing Pipeline
 * 
 * Main orchestration module that coordinates all photo analysis steps:
 * 1. Extract image dimensions and metadata
 * 2. Parse EXIF data (date, camera, GPS)
 * 3. Calculate quality scores
 * 4. Analyze colors and extract palette
 * 5. Detect faces (TODO)
 * 6. Determine orientation
 * 
 * This is the entry point called by the upload API route.
 */

import sharp from 'sharp';
import { extractExifData } from './exif';
import { calculateQualityScore } from './quality';
import { extractColors } from './colors';

/**
 * Complete analyzed photo data structure
 * 
 * Contains all metadata needed for:
 * - Layout decisions (orientation, aspect ratio)
 * - Quality warnings (qualityScore)
 * - Chronological sorting (dateTaken)
 * - Theme selection (dominantColor)
 * - Smart features (faces for cover selection)
 */
export interface ProcessedPhotoData {
  // Dimensions
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'portrait' | 'landscape' | 'square';
  
  // EXIF metadata
  dateTaken: Date | null;
  cameraMake: string | null;
  cameraModel: string | null;
  exifOrientation: number;
  
  // Quality metrics
  qualityScore: number;         // 0-100, higher = better print quality
  sharpnessScore: number;       // Blur detection metric
  
  // Color analysis
  dominantColor: string;        // Hex color code
  colorPalette: any[];          // Array of color swatches
  
  // Content analysis
  hasFaces: boolean;            // TODO: implement face detection
  faceCount: number;            // Number of faces detected
}

/**
 * Main photo processing pipeline
 * 
 * Analyzes a single uploaded photo and extracts all relevant metadata.
 * All analysis steps run in parallel where possible for performance.
 * 
 * @param buffer - Image file buffer from upload
 * @returns Promise with complete ProcessedPhotoData
 * @throws Error if image is corrupted or processing fails
 * 
 * @example
 * const fileBuffer = await uploadedFile.arrayBuffer();
 * const buffer = Buffer.from(fileBuffer);
 * const analysis = await processPhoto(buffer);
 * console.log(`Quality: ${analysis.qualityScore}/100`);
 */
export async function processPhoto(buffer: Buffer): Promise<ProcessedPhotoData> {
  // Step 1: Get basic image metadata (fast, synchronous Sharp operation)
  const metadata = await sharp(buffer).metadata();
  const { width = 0, height = 0 } = metadata;
  
  // Step 2: Extract EXIF data (camera, date, GPS)
  // Can fail gracefully if no EXIF present
  const exif = await extractExifData(buffer);
  
  // Step 3: Calculate quality score
  // Uses resolution + sharpness detection + EXIF presence
  const quality = await calculateQualityScore(buffer, !!exif.dateTaken);
  
  // Step 4: Extract dominant colors and palette
  // Used for theme selection and color harmonization
  const colors = await extractColors(buffer);
  
  // Step 5: Determine photo orientation from dimensions
  // Uses aspect ratio thresholds (landscape >1.2, portrait <0.8)
  const aspectRatio = width / height;
  const orientation: 'portrait' | 'landscape' | 'square' = 
    aspectRatio > 1.2 ? 'landscape' :
    aspectRatio < 0.8 ? 'portrait' :
    'square';
  
  // Step 6: Face detection (placeholder for future ML integration)
  // TODO: Integrate face detection model (TensorFlow.js or external API)
  // Would prioritize photos with faces for cover selection
  const hasFaces = false;
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
 * Batch process multiple photos with progress tracking
 * 
 * Processes photos sequentially (to avoid memory issues with large batches).
 * Provides progress callback for UI updates during bulk uploads.
 * 
 * @param photos - Array of { buffer, filename } objects
 * @param onProgress - Optional callback fired after each photo: (current, total) => void
 * @returns Map of filename to ProcessedPhotoData
 * 
 * @example
 * const results = await batchProcessPhotos(
 *   photoFiles.map(f => ({ buffer: f.buffer, filename: f.name })),
 *   (current, total) => {
 *     console.log(`Processing ${current}/${total}...`);
 *     updateProgressBar(current / total * 100);
 *   }
 * );
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
      
      // Trigger progress callback for UI update
      if (onProgress) {
        onProgress(i + 1, photos.length);
      }
    } catch (error) {
      // Log error but continue processing remaining photos
      // UI can show warning for failed photos
      console.error(`Failed to process ${filename}:`, error);
      // Could add failed photos to results with error flag
    }
  }
  
  return results;
}
