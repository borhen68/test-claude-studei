import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

// Initialize S3 client for Cloudflare R2 or AWS S3
const s3Client = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT, // For R2: https://<account-id>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'frametale-uploads';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

export interface UploadOptions {
  contentType: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

/**
 * Upload file buffer to S3/R2 with proper error handling
 */
export async function uploadToStorage(
  buffer: Buffer,
  key: string,
  options: UploadOptions
): Promise<{ url: string; key: string }> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: options.contentType,
      Metadata: options.metadata,
      CacheControl: options.cacheControl || 'public, max-age=31536000',
    });

    await s3Client.send(command);

    const url = `${PUBLIC_URL}/${key}`;
    
    return { url, key };
  } catch (error) {
    console.error('S3 upload failed:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate presigned URL for direct client-side upload
 */
export async function generatePresignedUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Failed to generate presigned URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}

/**
 * Generate presigned URL for viewing/downloading
 */
export async function generateViewUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Failed to generate view URL:', error);
    throw new Error('Failed to generate view URL');
  }
}

/**
 * Delete file from storage
 */
export async function deleteFromStorage(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete failed:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate unique storage key for a file
 */
export function generateStorageKey(bookId: string, filename: string, prefix: string = 'uploads'): string {
  const ext = filename.split('.').pop();
  const uniqueId = nanoid(12);
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${prefix}/${bookId}/${uniqueId}-${sanitizedName}`;
}

/**
 * Batch delete multiple files
 */
export async function batchDeleteFromStorage(keys: string[]): Promise<void> {
  const deletePromises = keys.map(key => deleteFromStorage(key));
  
  try {
    await Promise.allSettled(deletePromises);
  } catch (error) {
    console.error('Batch delete failed:', error);
  }
}

/**
 * Upload with retry logic for production reliability
 */
export async function uploadWithRetry(
  buffer: Buffer,
  key: string,
  options: UploadOptions,
  maxRetries: number = 3
): Promise<{ url: string; key: string }> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadToStorage(buffer, key, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Upload failed');
      console.warn(`Upload attempt ${attempt}/${maxRetries} failed:`, lastError.message);
      
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw lastError || new Error('Upload failed after retries');
}
