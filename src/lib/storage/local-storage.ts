import { writeFile, unlink, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { nanoid } from 'nanoid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'public', 'uploads');
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export interface UploadOptions {
  contentType: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

/**
 * Ensure upload directory exists
 */
async function ensureDir(path: string) {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
}

/**
 * Upload file buffer to local filesystem
 */
export async function uploadToLocalStorage(
  buffer: Buffer,
  key: string,
  options: UploadOptions
): Promise<{ url: string; key: string }> {
  try {
    const filePath = join(UPLOAD_DIR, key);
    const dirPath = join(UPLOAD_DIR, key.split('/').slice(0, -1).join('/'));
    
    await ensureDir(dirPath);
    await writeFile(filePath, buffer);
    
    const url = `/uploads/${key}`;
    
    return { url, key };
  } catch (error) {
    console.error('Local storage upload failed:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate unique storage key for a file
 */
export function generateStorageKey(bookId: string, filename: string, prefix: string = 'books'): string {
  const ext = filename.split('.').pop();
  const uniqueId = nanoid(12);
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${prefix}/${bookId}/${uniqueId}-${sanitizedName}`;
}

/**
 * Delete file from local storage
 */
export async function deleteFromLocalStorage(key: string): Promise<void> {
  try {
    const filePath = join(UPLOAD_DIR, key);
    
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error('Local storage delete failed:', error);
  }
}

/**
 * Batch delete multiple files
 */
export async function batchDeleteFromLocalStorage(keys: string[]): Promise<void> {
  const deletePromises = keys.map(key => deleteFromLocalStorage(key));
  await Promise.allSettled(deletePromises);
}

/**
 * Read file from local storage
 */
export async function readFromLocalStorage(key: string): Promise<Buffer> {
  try {
    const filePath = join(UPLOAD_DIR, key);
    return await readFile(filePath);
  } catch (error) {
    console.error('Local storage read failed:', error);
    throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
