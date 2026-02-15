/**
 * CloudPrinter File Upload and MD5 Generation
 */

import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import path from 'path';
import { uploadToStorage } from '@/lib/storage/unified-storage';

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

/**
 * Prepare book files for CloudPrinter upload
 */
export async function prepareBookFiles(params: {
  coverPdfPath?: string;
  contentPdfPath: string;
  bookId: string;
}): Promise<{
  cover?: { url: string; md5sum: string };
  content: { url: string; md5sum: string };
}> {
  const { coverPdfPath, contentPdfPath, bookId } = params;

  const result: any = {};

  // Upload content PDF (required)
  if (contentPdfPath) {
    result.content = await uploadPDFFileWithMD5(
      contentPdfPath,
      `${bookId}_content.pdf`,
      'cloudprinter/books'
    );
  }

  // Upload cover PDF (optional)
  if (coverPdfPath) {
    result.cover = await uploadPDFFileWithMD5(
      coverPdfPath,
      `${bookId}_cover.pdf`,
      'cloudprinter/books'
    );
  }

  return result;
}

/**
 * Mock file upload for development
 */
export function mockFileUpload(filename: string): { url: string; md5sum: string } {
  const mockMD5 = createHash('md5').update(filename + Date.now()).digest('hex');
  
  return {
    url: `https://cdn.frametale.com/mock/cloudprinter/${filename}`,
    md5sum: mockMD5,
  };
}
