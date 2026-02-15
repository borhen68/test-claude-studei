import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * GET /api/pdf/download/[type]/[bookId]
 * Download cover or interior PDF
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; bookId: string } }
) {
  try {
    const { type, bookId } = params;

    if (type !== 'cover' && type !== 'interior') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "cover" or "interior"' },
        { status: 400 }
      );
    }

    // Fetch book
    const [book] = await db.select().from(books).where(eq(books.id, bookId));

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    const url = type === 'cover' ? book.coverImageUrl : book.finalPdfUrl;

    if (!url) {
      return NextResponse.json(
        { error: `${type} PDF not found` },
        { status: 404 }
      );
    }

    // Redirect to the PDF URL
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('PDF download error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
