import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, photos, pages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

/**
 * POST /api/books
 * Create a new book session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, source } = body;
    
    const sessionToken = nanoid(32);
    
    const [book] = await db.insert(books).values({
      sessionToken,
      title: title || 'Your Photos',
      status: 'uploading',
      source: source || 'web',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return NextResponse.json({
      success: true,
      book: {
        id: book.id,
        sessionToken: book.sessionToken,
        title: book.title,
        status: book.status,
      },
    });
  } catch (error) {
    console.error('Failed to create book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create book' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/books?sessionToken=xxx or ?id=xxx
 * Get book details
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('sessionToken');
    const id = searchParams.get('id');
    
    if (!sessionToken && !id) {
      return NextResponse.json(
        { success: false, error: 'Missing sessionToken or id' },
        { status: 400 }
      );
    }
    
    const [book] = await db.select()
      .from(books)
      .where(sessionToken ? eq(books.sessionToken, sessionToken) : eq(books.id, id!))
      .limit(1);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Get associated photos
    const bookPhotos = await db.select().from(photos).where(eq(photos.bookId, book.id));
    
    // Get pages if generated
    const bookPages = await db.select().from(pages).where(eq(pages.bookId, book.id));
    
    return NextResponse.json({
      success: true,
      book: {
        ...book,
        photos: bookPhotos,
        pages: bookPages,
      },
    });
  } catch (error) {
    console.error('Failed to fetch book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/books/:id
 * Update book details
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, theme, status } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing book id' },
        { status: 400 }
      );
    }
    
    const updates: any = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (theme !== undefined) updates.theme = theme;
    if (status !== undefined) updates.status = status;
    
    const [book] = await db
      .update(books)
      .set(updates)
      .where(eq(books.id, id))
      .returning();
    
    return NextResponse.json({
      success: true,
      book,
    });
  } catch (error) {
    console.error('Failed to update book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update book' },
      { status: 500 }
    );
  }
}
