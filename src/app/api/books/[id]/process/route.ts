import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, photos, pages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateBookLayout } from '@/lib/layout/generator';

/**
 * POST /api/books/:id/process
 * Generate book layout from uploaded photos
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get book
    const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Get all photos for this book
    const bookPhotos = await db.select().from(photos).where(eq(photos.bookId, id));
    
    if (bookPhotos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No photos to process' },
        { status: 400 }
      );
    }
    
    // Update book status
    await db.update(books)
      .set({ status: 'processing', updatedAt: new Date() })
      .where(eq(books.id, id));
    
    // Generate layout
    const generatedPages = await generateBookLayout(bookPhotos);
    
    // Delete existing pages
    await db.delete(pages).where(eq(pages.bookId, id));
    
    // Insert new pages
    const insertedPages = await Promise.all(
      generatedPages.map(page =>
        db.insert(pages).values({
          bookId: id,
          pageNumber: page.pageNumber,
          template: page.template,
          photoIds: page.photoIds,
          layoutData: page.layoutData,
          textContent: page.textContent,
        }).returning()
      )
    );
    
    // Update book with page count and set to ready
    await db.update(books)
      .set({
        pageCount: generatedPages.length,
        status: 'ready',
        updatedAt: new Date(),
      })
      .where(eq(books.id, id));
    
    return NextResponse.json({
      success: true,
      pageCount: generatedPages.length,
      pages: insertedPages.map(([p]) => p),
    });
  } catch (error) {
    console.error('Failed to process book:', error);
    
    // Update book status to error
    try {
      await db.update(books)
        .set({ status: 'error', updatedAt: new Date() })
        .where(eq(books.id, params.id));
    } catch {}
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/books/:id/process
 * Get processing status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      status: book.status,
      pageCount: book.pageCount,
    });
  } catch (error) {
    console.error('Failed to get status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get status' },
      { status: 500 }
    );
  }
}
