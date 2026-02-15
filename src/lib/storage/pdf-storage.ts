/**
 * PDF Storage Helper
 * Upload PDFs to R2/S3 storage
 */

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'frametale';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://cdn.frametale.com';

/**
 * Upload buffer to storage and return public URL
 */
export async function uploadToStorage(
  buffer: Buffer,
  key: string,
  contentType: string = 'application/pdf'
): Promise<string> {
  // Check if R2 is configured
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.warn('⚠️ R2 not configured, using local storage fallback');
    return await uploadToLocalStorage(buffer, key, contentType);
  }

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000',
      })
    );

    const url = `${PUBLIC_URL}/${key}`;
    console.log(`✓ Uploaded to R2: ${url}`);
    return url;
  } catch (error) {
    console.error('R2 upload failed, falling back to local storage:', error);
    return await uploadToLocalStorage(buffer, key, contentType);
  }
}

/**
 * Fallback to local storage
 */
async function uploadToLocalStorage(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const { writeFile, mkdir } = await import('fs/promises');
  const { join, dirname } = await import('path');

  const storagePath = join(process.cwd(), 'public', 'storage', key);
  const dir = dirname(storagePath);

  // Ensure directory exists
  await mkdir(dir, { recursive: true });

  // Write file
  await writeFile(storagePath, buffer);

  // Return public URL
  const url = `/storage/${key}`;
  console.log(`✓ Uploaded to local storage: ${url}`);
  return url;
}
