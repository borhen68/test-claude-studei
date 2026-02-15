import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, photos, pages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateBookPDF } from '@/lib/pdf/generator';
import { uploadFile } from '@/lib/storage/unified-storage';

/**
 * GET /api/books/:id/pdf
 * Generate and download PDF for a book
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get book with photos and pages
    const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    const bookPhotos = await db.select().from(photos).where(eq(photos.bookId, id));
    const bookPages = await db.select().from(pages).where(eq(pages.bookId, id));
    
    if (bookPages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Book has no pages' },
        { status: 400 }
      );
    }
    
    // Build photo map
    const photoMap = new Map(bookPhotos.map(p => [p.id, p]));
    
    // Generate PDF
    const pdfPages = bookPages
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .map(page => {
        const layouts = page.layoutData?.layouts || [];
        const pagePhotos = layouts
          .map((layout: any) => {
            const photo = photoMap.get(layout.photoId);
            return photo ? { url: photo.processedUrl || photo.originalUrl, layout } : null;
          })
          .filter((p: any) => p !== null);
        
        return {
          photos: pagePhotos,
          textContent: page.textContent,
          isCover: page.pageNumber === 1,
        };
      });
    
    const pdfBuffer = await generateBookPDF({
      pages: pdfPages,
      metadata: {
        title: book.title || 'Photo Book',
        author: 'Frametale',
        subject: 'Photo Book',
      },
    });
    
    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${book.title || 'photobook'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'PDF generation failed' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/books/:id/pdf
 * Generate PDF and save it to storage
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get book with photos and pages
    const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    const bookPhotos = await db.select().from(photos).where(eq(photos.bookId, id));
    const bookPages = await db.select().from(pages).where(eq(pages.bookId, id));
    
    // Build photo map
    const photoMap = new Map(bookPhotos.map(p => [p.id, p]));
    
    // Generate PDF
    const pdfPages = bookPages
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .map(page => {
        const layouts = page.layoutData?.layouts || [];
        const pagePhotos = layouts
          .map((layout: any) => {
            const photo = photoMap.get(layout.photoId);
            return photo ? { url: photo.processedUrl || photo.originalUrl, layout } : null;
          })
          .filter((p: any) => p !== null);
        
        return {
          photos: pagePhotos,
          textContent: page.textContent,
          isCover: page.pageNumber === 1,
        };
      });
    
    const pdfBuffer = await generateBookPDF({
      pages: pdfPages,
      metadata: {
        title: book.title || 'Photo Book',
        author: 'Frametale',
      },
    });
    
    // Upload PDF to storage
    const upload = await uploadFile(
      pdfBuffer,
      id,
      `${book.title || 'photobook'}.pdf`,
      { contentType: 'application/pdf' }
    );
    
    // Update book with PDF URL
    await db.update(books)
      .set({ finalPdfUrl: upload.url, updatedAt: new Date() })
      .where(eq(books.id, id));
    
    return NextResponse.json({
      success: true,
      pdfUrl: upload.url,
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'PDF generation failed' },
      { status: 500 }
    );
  }
}
