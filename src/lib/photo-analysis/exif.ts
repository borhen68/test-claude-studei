/**
 * EXIF Metadata Extraction Module
 * 
 * Extracts EXIF (Exchangeable Image File Format) metadata from photos.
 * EXIF data includes:
 * - Capture date/time
 * - Camera make and model
 * - Image orientation
 * - GPS coordinates (if available)
 * 
 * Used for chronological sorting and identifying high-quality camera photos.
 */

import exifr from 'exifr';

/**
 * Extract EXIF metadata from image buffer
 * 
 * Parses EXIF tags embedded in JPEG and other image formats.
 * Only extracts fields we actually use to improve performance.
 * 
 * @param buffer - Image buffer from uploaded file
 * @returns Object with parsed EXIF data, or null values if not present
 */
export async function extractExifData(buffer: Buffer) {
  try {
    // Use exifr's selective parsing for better performance
    // Only extract the specific tags we need
    const exif = await exifr.parse(buffer, {
      pick: [
        'DateTimeOriginal',  // When photo was taken (preferred)
        'CreateDate',        // Fallback date field
        'Make',              // Camera manufacturer (e.g., "Apple", "Canon")
        'Model',             // Camera model (e.g., "iPhone 14 Pro")
        'Orientation',       // Image rotation flag (1-8)
        'GPSLatitude',       // GPS coordinates if geotagged
        'GPSLongitude',
      ],
    });

    return {
      // Prefer DateTimeOriginal (actual capture time) over CreateDate (file creation)
      dateTaken: exif?.DateTimeOriginal || exif?.CreateDate || null,
      
      cameraMake: exif?.Make || null,
      cameraModel: exif?.Model || null,
      
      // Orientation values 1-8 per EXIF spec
      // 1 = normal, 3 = 180° rotated, 6 = 90° CW, 8 = 90° CCW, etc.
      orientation: exif?.Orientation || 1,
      
      // GPS coordinates (only if photo is geotagged)
      gps: exif?.GPSLatitude && exif?.GPSLongitude 
        ? { lat: exif.GPSLatitude, lng: exif.GPSLongitude }
        : null,
    };
  } catch (error) {
    // EXIF parsing can fail for various reasons:
    // - Not a JPEG (PNGs rarely have EXIF)
    // - Corrupted EXIF data
    // - Image from screenshot/editor (no EXIF)
    console.error('EXIF extraction failed:', error);
    return {
      dateTaken: null,
      cameraMake: null,
      cameraModel: null,
      orientation: 1, // Default to normal orientation
      gps: null,
    };
  }
}

/**
 * Determine photo orientation from EXIF orientation flag
 * 
 * EXIF orientation values 5-8 indicate the image is rotated 90° or 270°,
 * meaning width and height are swapped from how the sensor captured it.
 * 
 * @param orientation - EXIF orientation value (1-8)
 * @returns Simplified orientation: portrait, landscape, or square
 */
export function normalizeOrientation(orientation: number): 'portrait' | 'landscape' | 'square' {
  // EXIF orientations 5,6,7,8 are rotated 90 or 270 degrees
  // For these, the image dimensions are effectively swapped
  const isRotated = [5, 6, 7, 8].includes(orientation);
  
  // TODO: Actually compare width/height to determine portrait vs landscape
  // Currently assumes landscape by default for non-rotated images
  return isRotated ? 'portrait' : 'landscape';
}
