/**
 * Photo Quality Enhancement
 * Automatically improves photos using Sharp image processing
 */

import sharp from 'sharp';

export type EnhancementLevel = 'none' | 'auto' | 'high';

export interface EnhancementOptions {
  level: EnhancementLevel;
  brightness?: number;  // 1.0 = no change, 1.1 = 10% brighter
  saturation?: number;  // 1.0 = no change, 1.1 = 10% more saturated
  sharpness?: number;   // 0-3, higher = sharper
  normalize?: boolean;  // Auto-levels
}

/**
 * Enhance a photo buffer
 * Returns enhanced buffer ready for upload
 */
export async function enhancePhoto(
  buffer: Buffer,
  options: EnhancementOptions = { level: 'auto' }
): Promise<Buffer> {
  // Skip enhancement if disabled
  if (options.level === 'none') {
    return buffer;
  }

  try {
    let image = sharp(buffer);
    const metadata = await image.metadata();

    // Auto mode: subtle enhancements
    if (options.level === 'auto') {
      image = image
        .normalize() // Auto-levels (improves contrast)
        .sharpen({ sigma: 1.0 }) // Subtle sharpening
        .modulate({
          brightness: 1.05,  // 5% brighter
          saturation: 1.08,  // 8% more saturated
        });
    }

    // High mode: more aggressive
    if (options.level === 'high') {
      image = image
        .normalize()
        .sharpen({ sigma: 2.0 }) // More sharpening
        .modulate({
          brightness: 1.10,  // 10% brighter
          saturation: 1.15,  // 15% more saturated
        });
    }

    // Custom mode: use provided values
    if (options.brightness || options.saturation) {
      image = image.modulate({
        brightness: options.brightness || 1.0,
        saturation: options.saturation || 1.0,
      });
    }

    if (options.sharpness) {
      image = image.sharpen({ sigma: options.sharpness });
    }

    if (options.normalize !== false) {
      image = image.normalize();
    }

    // Return processed buffer
    return await image.toBuffer();
  } catch (error) {
    console.error('Error enhancing photo:', error);
    // Return original if enhancement fails
    return buffer;
  }
}

/**
 * Batch enhance multiple photos
 */
export async function enhancePhotoBatch(
  photos: { buffer: Buffer; id: string }[],
  options: EnhancementOptions = { level: 'auto' }
): Promise<{ id: string; buffer: Buffer; enhanced: boolean }[]> {
  const results = await Promise.all(
    photos.map(async (photo) => {
      try {
        const enhancedBuffer = await enhancePhoto(photo.buffer, options);
        return {
          id: photo.id,
          buffer: enhancedBuffer,
          enhanced: true,
        };
      } catch (error) {
        console.error(`Failed to enhance photo ${photo.id}:`, error);
        return {
          id: photo.id,
          buffer: photo.buffer,
          enhanced: false,
        };
      }
    })
  );

  return results;
}

/**
 * Check if enhancement should be applied based on photo metadata
 * (e.g., don't enhance already professional photos)
 */
export function shouldEnhancePhoto(metadata: sharp.Metadata): boolean {
  // Skip very high quality photos (likely professional)
  if (metadata.density && metadata.density > 300) {
    return false;
  }

  // Skip very large photos (likely already edited)
  const megapixels = (metadata.width || 0) * (metadata.height || 0) / 1000000;
  if (megapixels > 24) {
    return false; // 24MP+ cameras usually produce great photos
  }

  return true;
}
