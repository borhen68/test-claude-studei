/**
 * CloudPrinter File Upload and MD5 Generation (Updated)
 */

import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import path from 'path';
import { uploadToStorage } from '../storage/pdf-storage';

/**
 * Generate MD5 checksum from file buffer
 */
export function generateMD5(buffer: Buffer): string {
  return createHash('md5').update(buffer).digest('hex');
}

/**
 * Generate MD5 from file path
 */
export async function generateMD5FromFile(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  return generateMD5(buffer);
}

/**
 * Upload PDF to CDN and return public URL with MD5
 */
export async function uploadPDFWithMD5(
  pdfBuffer: Buffer,
  filename: string,
  folder: string = 'cloudprinter'
): Promise<{ url: string; md5sum: string }> {
  // Generate MD5 checksum
  const md5sum = generateMD5(pdfBuffer);

  // Upload to storage (R2/S3 or local fallback)
  const uploadPath = `${folder}/${filename}`;
  const url = await uploadToStorage(pdfBuffer, uploadPath, 'application/pdf');

  return {
    url,
    md5sum,
  };
}

/**
 * Upload PDF from file path
 */
export async function uploadPDFFileWithMD5(
  filePath: string,
  targetFilename?: string,
  folder: string = 'cloudprinter'
): Promise<{ url: string; md5sum: string }> {
  const buffer = await readFile(filePath);
  const filename = targetFilename || path.basename(filePath);

  return uploadPDFWithMD5(buffer, filename, folder);
}

/**
 * Validate PDF file
 */
export function isValidPDF(buffer: Buffer): boolean {
  // Check PDF magic number (%PDF-)
  const pdfHeader = buffer.slice(0, 5).toString();
  return pdfHeader === '%PDF-';
}

/**
 * Get PDF page count (basic implementation)
 */
export async function getPDFPageCount(buffer: Buffer): Promise<number> {
  // Simple regex to count /Type /Page entries
  const content = buffer.toString('binary');
  const matches = content.match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 0;
}
