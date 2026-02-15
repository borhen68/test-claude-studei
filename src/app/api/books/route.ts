import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { books } from '@/lib/db/schema';

/**
 * POST /api/books
 * Create a new book session
 */
export async function POST(request: NextRequest) {
  try {
    const sessionToken = nanoid(32);
    
    const [book] = await db.insert(books).values({
      sessionToken,
      status: 'uploading',
      title: 'Your Photos',
      theme: 'auto',
    }).returning();
    
    return NextResponse.json({
      success: true,
      book: {
        id: book.id,
        sessionToken: book.sessionToken,
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
 * GET /api/books?sessionToken=xxx
 * Get book by session token
 */
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.nextUrl.searchParams.get('sessionToken');
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Session token required' },
        { status: 400 }
      );
    }
    
    const book = await db.query.books.findFirst({
      where: (books, { eq }) => eq(books.sessionToken, sessionToken),
    });
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      book,
    });
  } catch (error) {
    console.error('Failed to get book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get book' },
      { status: 500 }
    );
  }
}
