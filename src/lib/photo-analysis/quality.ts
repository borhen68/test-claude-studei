import sharp from 'sharp';

/**
 * Calculate quality score (0-100) based on resolution, sharpness, and metadata
 */
export async function calculateQualityScore(buffer: Buffer, hasExif: boolean): Promise<{
  score: number;
  sharpness: number;
  megapixels: number;
}> {
  const metadata = await sharp(buffer).metadata();
  const { width = 0, height = 0, format } = metadata;
  
  let score = 50; // baseline
  
  // 1. Resolution scoring
  const megapixels = (width * height) / 1_000_000;
  if (megapixels >= 12) score += 20;
  else if (megapixels >= 8) score += 15;
  else if (megapixels >= 5) score += 10;
  else if (megapixels >= 2) score += 5;
  else score -= 10; // too low-res
  
  // 2. Sharpness estimation using Laplacian variance
  const sharpness = await estimateSharpness(buffer);
  if (sharpness > 100) score += 15;
  else if (sharpness > 50) score += 10;
  else score -= 10; // blurry
  
  // 3. Format bonus
  if (format === 'jpeg' || format === 'png') score += 5;
  
  // 4. EXIF presence (usually indicates higher quality source)
  if (hasExif) score += 10;
  
  return {
    score: Math.max(0, Math.min(100, score)),
    sharpness,
    megapixels,
  };
}

/**
 * Estimate sharpness using Laplacian variance
 * Higher values = sharper image
 */
async function estimateSharpness(buffer: Buffer): Promise<number> {
  try {
    // Convert to grayscale and get stats
    const stats = await sharp(buffer)
      .greyscale()
      .resize(800, 800, { fit: 'inside' }) // resize for performance
      .stats();
    
    // Use standard deviation as proxy for sharpness
    // Sharp images have higher variance in pixel values
    const sharpness = stats.channels[0].stdev || 0;
    
    return Math.round(sharpness);
  } catch (error) {
    console.error('Sharpness estimation failed:', error);
    return 50; // fallback to neutral score
  }
}

/**
 * Check if image meets minimum quality standards for printing
 */
export function meetsMinimumQuality(score: number, width: number, height: number): boolean {
  const minScore = 30;
  const minResolution = 1200; // pixels on shortest side
  
  const shortestSide = Math.min(width, height);
  
  return score >= minScore && shortestSide >= minResolution;
}
