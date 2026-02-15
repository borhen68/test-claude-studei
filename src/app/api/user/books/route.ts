import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth/session';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await requireAuth();

    const userBooks = await db
      .select()
      .from(books)
      .where(eq(books.userId, user.id))
      .orderBy(desc(books.createdAt));

    return NextResponse.json({
      books: userBooks,
    });
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Fetch books error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
