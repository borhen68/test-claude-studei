import { uploadToLocalStorage, generateStorageKey as generateLocalKey, deleteFromLocalStorage } from './local-storage';
import { uploadToStorage as uploadToS3, generateStorageKey as generateS3Key, deleteFromStorage as deleteFromS3 } from './s3-client';
import sharp from 'sharp';

export interface UploadOptions {
  contentType: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

const USE_S3 = process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY;

/**
 * Unified storage interface - automatically uses S3 or local based on config
 */
export async function uploadFile(
  buffer: Buffer,
  bookId: string,
  filename: string,
  options: UploadOptions
): Promise<{ url: string; key: string }> {
  const key = USE_S3 
    ? generateS3Key(bookId, filename, 'uploads')
    : generateLocalKey(bookId, filename, 'books');
  
  if (USE_S3) {
    return await uploadToS3(buffer, key, options);
  } else {
    return await uploadToLocalStorage(buffer, key, options);
  }
}

/**
 * Generate thumbnail and upload
 */
export async function generateAndUploadThumbnail(
  buffer: Buffer,
  bookId: string,
  filename: string
): Promise<{ url: string; key: string }> {
  const thumbnailBuffer = await sharp(buffer)
    .resize(400, 400, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 85 })
    .toBuffer();
  
  const key = USE_S3
    ? generateS3Key(bookId, `thumb_${filename}`, 'thumbnails')
    : generateLocalKey(bookId, `thumb_${filename}`, 'thumbnails');
  
  if (USE_S3) {
    return await uploadToS3(thumbnailBuffer, key, { contentType: 'image/jpeg' });
  } else {
    return await uploadToLocalStorage(thumbnailBuffer, key, { contentType: 'image/jpeg' });
  }
}

/**
 * Generate optimized preview and upload
 */
export async function generateAndUploadPreview(
  buffer: Buffer,
  bookId: string,
  filename: string,
  maxWidth: number = 1200
): Promise<{ url: string; key: string }> {
  const previewBuffer = await sharp(buffer)
    .resize(maxWidth, maxWidth, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 90 })
    .toBuffer();
  
  const key = USE_S3
    ? generateS3Key(bookId, `preview_${filename}`, 'previews')
    : generateLocalKey(bookId, `preview_${filename}`, 'previews');
  
  if (USE_S3) {
    return await uploadToS3(previewBuffer, key, { contentType: 'image/jpeg' });
  } else {
    return await uploadToLocalStorage(previewBuffer, key, { contentType: 'image/jpeg' });
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(key: string): Promise<void> {
  if (USE_S3) {
    await deleteFromS3(key);
  } else {
    await deleteFromLocalStorage(key);
  }
}
