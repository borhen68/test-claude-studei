import exifr from 'exifr';

export async function extractExifData(buffer: Buffer) {
  try {
    const exif = await exifr.parse(buffer, {
      pick: [
        'DateTimeOriginal',
        'CreateDate',
        'Make',
        'Model',
        'Orientation',
        'GPSLatitude',
        'GPSLongitude',
      ],
    });

    return {
      dateTaken: exif?.DateTimeOriginal || exif?.CreateDate || null,
      cameraMake: exif?.Make || null,
      cameraModel: exif?.Model || null,
      orientation: exif?.Orientation || 1,
      gps: exif?.GPSLatitude && exif?.GPSLongitude 
        ? { lat: exif.GPSLatitude, lng: exif.GPSLongitude }
        : null,
    };
  } catch (error) {
    console.error('EXIF extraction failed:', error);
    return {
      dateTaken: null,
      cameraMake: null,
      cameraModel: null,
      orientation: 1,
      gps: null,
    };
  }
}

export function normalizeOrientation(orientation: number): 'portrait' | 'landscape' | 'square' {
  // EXIF orientations 5,6,7,8 are rotated 90 degrees
  const isRotated = [5, 6, 7, 8].includes(orientation);
  return isRotated ? 'portrait' : 'landscape';
}
