import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, books } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth/session';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await requireAuth();

    const userOrders = await db
      .select({
        order: orders,
        book: books,
      })
      .from(orders)
      .innerJoin(books, eq(orders.bookId, books.id))
      .where(eq(books.userId, user.id))
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({
      orders: userOrders.map(row => ({
        ...row.order,
        book: row.book,
      })),
    });
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
