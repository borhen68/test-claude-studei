/**
 * Main PDF Generator Service
 * Orchestrates cover + interior PDF generation for CloudPrinter
 */

import { db } from '../db';
import { books, pages, photos } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateCoverPDF, generateSimpleCoverPDF } from './cover';
import { generateInteriorPagesPDF, type BookPage } from './pages';
import { uploadPDFWithMD5 } from '../cloudprinter/files';
import { getBookSize } from './config';

export interface GeneratePDFResult {
  success: boolean;
  coverUrl?: string;
  coverMd5?: string;
  interiorUrl?: string;
  interiorMd5?: string;
  warnings?: string[];
  error?: string;
}

/**
 * Generate complete book PDFs (cover + interior) for CloudPrinter
 */
export async function generateBookPDF(bookId: string): Promise<GeneratePDFResult> {
  const warnings: string[] = [];

  try {
    console.log(`\n📚 Generating PDFs for book: ${bookId}`);

    // Fetch book data
    const [book] = await db.select().from(books).where(eq(books.id, bookId));
    if (!book) {
      throw new Error(`Book not found: ${bookId}`);
    }

    // Fetch pages
    const bookPages = await db
      .select()
      .from(pages)
      .where(eq(pages.bookId, bookId))
      .orderBy(pages.pageNumber);

    if (bookPages.length === 0) {
      throw new Error('No pages found for book');
    }

    // Fetch all photos
    const bookPhotos = await db
      .select()
      .from(photos)
      .where(eq(photos.bookId, bookId));

    console.log(`Found ${bookPages.length} pages and ${bookPhotos.length} photos`);

    // Determine book size (default to 8x8 if not specified)
    const bookSize = book.theme || '8x8'; // Assuming theme stores size
    const sizeSpec = getBookSize(bookSize);

    console.log(`Book size: ${sizeSpec.name}`);

    // Generate cover PDF
    console.log('\n📄 Generating cover PDF...');
    const coverPDF = await generateCover(book, bookPhotos, bookPages.length, bookSize);
    
    // Upload cover
    const coverUpload = await uploadPDFWithMD5(
      coverPDF,
      `${bookId}_cover.pdf`,
      'cloudprinter/books'
    );
    console.log(`✓ Cover uploaded: ${coverUpload.url}`);

    // Generate interior pages PDF
    console.log('\n📄 Generating interior pages PDF...');
    const interiorPDF = await generateInterior(bookPages, bookPhotos, bookSize);
    
    // Upload interior
    const interiorUpload = await uploadPDFWithMD5(
      interiorPDF,
      `${bookId}_interior.pdf`,
      'cloudprinter/books'
    );
    console.log(`✓ Interior uploaded: ${interiorUpload.url}`);

    console.log('\n✅ PDF generation complete!');

    return {
      success: true,
      coverUrl: coverUpload.url,
      coverMd5: coverUpload.md5sum,
      interiorUrl: interiorUpload.url,
      interiorMd5: interiorUpload.md5sum,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    console.error('PDF generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      warnings,
    };
  }
}

/**
 * Generate cover PDF
 */
async function generateCover(
  book: any,
  bookPhotos: any[],
  pageCount: number,
  bookSize: string
): Promise<Buffer> {
  // Use first photo or cover image as front cover
  const coverPhoto = book.coverImageUrl || bookPhotos[0]?.processedUrl || bookPhotos[0]?.originalUrl;

  if (!coverPhoto) {
    throw new Error('No cover image available');
  }

  // Use last photo as back cover (optional)
  const backPhoto = bookPhotos[bookPhotos.length - 1]?.processedUrl || bookPhotos[bookPhotos.length - 1]?.originalUrl;

  return await generateCoverPDF({
    bookSize,
    pageCount,
    frontCoverImage: coverPhoto,
    backCoverImage: backPhoto,
    title: book.title || 'Your Photos',
    spineText: book.title || 'Photo Book',
  });
}

/**
 * Generate interior pages PDF
 */
async function generateInterior(
  bookPages: any[],
  bookPhotos: any[],
  bookSize: string
): Promise<Buffer> {
  // Map photos by ID for quick lookup
  const photoMap = new Map(bookPhotos.map((p) => [p.id, p]));

  // Build pages with photo URLs
  const pagesData: BookPage[] = bookPages.map((page) => {
    const photoIds = page.photoIds as string[];
    const layoutData = page.layoutData as any;

    const pagePhotos = photoIds.map((photoId, index) => {
      const photo = photoMap.get(photoId);
      if (!photo) {
        console.warn(`Photo not found: ${photoId}`);
        return null;
      }

      return {
        id: photoId,
        url: photo.processedUrl || photo.originalUrl,
        layout: layoutData[index] || {
          photoId,
          position: { x: 0.05, y: 0.05, width: 0.9, height: 0.9 },
        },
      };
    }).filter((p) => p !== null) as any[];

    return {
      pageNumber: page.pageNumber,
      template: page.template,
      photos: pagePhotos,
      textContent: page.textContent,
    };
  });

  return await generateInteriorPagesPDF({
    bookSize,
    pages: pagesData,
  });
}

/**
 * Regenerate PDFs and update book record
 */
export async function regenerateBookPDF(bookId: string): Promise<GeneratePDFResult> {
  const result = await generateBookPDF(bookId);

  if (result.success) {
    // Update book record with PDF URLs
    await db
      .update(books)
      .set({
        coverImageUrl: result.coverUrl,
        finalPdfUrl: result.interiorUrl,
        updatedAt: new Date(),
      })
      .where(eq(books.id, bookId));
  }

  return result;
}

/**
 * Get PDF generation status
 */
export async function getPDFStatus(bookId: string): Promise<{
  hasCover: boolean;
  hasInterior: boolean;
  coverUrl?: string;
  interiorUrl?: string;
}> {
  const [book] = await db.select().from(books).where(eq(books.id, bookId));

  if (!book) {
    throw new Error(`Book not found: ${bookId}`);
  }

  return {
    hasCover: !!book.coverImageUrl,
    hasInterior: !!book.finalPdfUrl,
    coverUrl: book.coverImageUrl || undefined,
    interiorUrl: book.finalPdfUrl || undefined,
  };
}
