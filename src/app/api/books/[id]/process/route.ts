import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, photos, pages } from '@/lib/db/schema';
import { generateBookLayout } from '@/lib/layout/generator';
import { eq } from 'drizzle-orm';

/**
 * POST /api/books/:id/process
 * Generate book layout from uploaded photos
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    
    // Get book
    const book = await db.query.books.findFirst({
      where: eq(books.id, bookId),
    });
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Get all photos for this book
    const bookPhotos = await db.query.photos.findMany({
      where: eq(photos.bookId, bookId),
      orderBy: (photos, { asc }) => [asc(photos.createdAt)],
    });
    
    if (bookPhotos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No photos uploaded' },
        { status: 400 }
      );
    }
    
    // Generate layout
    const generatedPages = await generateBookLayout(bookPhotos);
    
    // Save pages to database
    for (const page of generatedPages) {
      await db.insert(pages).values({
        bookId,
        pageNumber: page.pageNumber,
        template: page.template,
        photoIds: page.photoIds,
        layoutData: page.layoutData,
        textContent: page.textContent,
      });
    }
    
    // Update book status
    await db.update(books)
      .set({
        status: 'ready',
        pageCount: generatedPages.length,
        updatedAt: new Date(),
      })
      .where(eq(books.id, bookId));
    
    return NextResponse.json({
      success: true,
      pageCount: generatedPages.length,
      book: {
        id: bookId,
        status: 'ready',
        pageCount: generatedPages.length,
      },
    });
  } catch (error) {
    console.error('Processing failed:', error);
    return NextResponse.json(
      { success: false, error: 'Processing failed' },
      { status: 500 }
    );
  }
}
