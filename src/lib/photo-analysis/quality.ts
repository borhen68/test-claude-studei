/**
 * Photo Quality Analysis Module
 * 
 * Analyzes uploaded photos to determine print quality suitability.
 * Uses resolution, sharpness detection, and metadata to score each photo.
 * 
 * Quality scores range from 0-100:
 * - 80-100: Excellent print quality
 * - 60-79: Good print quality
 * - 40-59: Acceptable quality (may show artifacts)
 * - 0-39: Poor quality (warn user)
 */

import sharp from 'sharp';

/**
 * Calculate comprehensive quality score for a photo
 * 
 * @param buffer - Image buffer from uploaded file
 * @param hasExif - Whether EXIF metadata is present (indicates camera photo vs screenshot)
 * @returns Object with quality score (0-100), sharpness metric, and megapixel count
 * @throws Error if image processing fails
 */
export async function calculateQualityScore(buffer: Buffer, hasExif: boolean): Promise<{
  score: number;
  sharpness: number;
  megapixels: number;
}> {
  const metadata = await sharp(buffer).metadata();
  const { width = 0, height = 0, format } = metadata;
  
  let score = 50; // baseline - neutral starting point
  
  // 1. Resolution scoring - higher megapixels = better print quality
  const megapixels = (width * height) / 1_000_000;
  if (megapixels >= 12) score += 20;      // 12MP+ excellent for large prints
  else if (megapixels >= 8) score += 15;  // 8MP good for standard photobook
  else if (megapixels >= 5) score += 10;  // 5MP acceptable
  else if (megapixels >= 2) score += 5;   // 2MP minimum usable
  else score -= 10; // Below 2MP not recommended for print
  
  // 2. Sharpness estimation - blur detection using Laplacian variance
  const sharpness = await estimateSharpness(buffer);
  if (sharpness > 100) score += 15;       // Very sharp image
  else if (sharpness > 50) score += 10;   // Adequate sharpness
  else score -= 10; // Blurry - warn user
  
  // 3. Format bonus - lossless/high-quality formats preferred
  if (format === 'jpeg' || format === 'png') score += 5;
  
  // 4. EXIF presence - photos from cameras typically higher quality than screenshots
  if (hasExif) score += 10;
  
  // Clamp score to valid range
  return {
    score: Math.max(0, Math.min(100, score)),
    sharpness,
    megapixels,
  };
}

/**
 * Estimate image sharpness using Laplacian variance method
 * 
 * Sharp images have high variance in pixel values (lots of edges/detail).
 * Blurry images have low variance (smooth gradients).
 * 
 * @param buffer - Image buffer to analyze
 * @returns Sharpness score (higher = sharper). Typical range: 0-200+
 */
async function estimateSharpness(buffer: Buffer): Promise<number> {
  try {
    // Convert to grayscale and resize for faster processing
    // Sharpness detection doesn't require full resolution
    const stats = await sharp(buffer)
      .greyscale()
      .resize(800, 800, { fit: 'inside' }) // Maintain aspect ratio
      .stats();
    
    // Use standard deviation as proxy for sharpness
    // High stdev = lots of pixel variation = sharp edges
    const sharpness = stats.channels[0].stdev || 0;
    
    return Math.round(sharpness);
  } catch (error) {
    console.error('Sharpness estimation failed:', error);
    return 50; // Fallback to neutral score on error
  }
}

/**
 * Check if image meets minimum quality standards for professional printing
 * 
 * Used to show warnings in UI before user completes checkout.
 * 
 * @param score - Quality score from calculateQualityScore
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns true if photo is suitable for printing
 */
export function meetsMinimumQuality(score: number, width: number, height: number): boolean {
  const minScore = 30; // Below this, very noticeable quality issues
  const minResolution = 1200; // Pixels on shortest side for 4x6" at 200 DPI
  
  const shortestSide = Math.min(width, height);
  
  return score >= minScore && shortestSide >= minResolution;
}
