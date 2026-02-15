import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, books } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/admin/orders
 * Get all orders for admin panel
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    
    const allOrders = await db.select().from(orders);
    
    // Fetch book details for each order
    const ordersWithBooks = await Promise.all(
      allOrders.map(async (order) => {
        const [book] = await db.select().from(books).where(eq(books.id, order.bookId)).limit(1);
        
        return {
          ...order,
          book: book ? {
            title: book.title,
            pageCount: book.pageCount,
          } : null,
        };
      })
    );
    
    // Sort by created date descending
    ordersWithBooks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json({
      success: true,
      orders: ordersWithBooks,
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
