import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, orders } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const body = await request.json();
    const session = await getServerSession(authOptions);

    // Get the original book
    const [book] = await db.select().from(books).where(eq(books.id, bookId)).limit(1);

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Check if user owns this book (if logged in)
    if (session?.user && book.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Find the most recent order for this book
    let lastOrder = null;
    if (body.lastOrderId) {
      [lastOrder] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, body.lastOrderId))
        .limit(1);
    } else {
      // Find most recent order for this book
      [lastOrder] = await db
        .select()
        .from(orders)
        .where(eq(orders.bookId, bookId))
        .orderBy(desc(orders.createdAt))
        .limit(1);
    }

    // Create checkout session with pre-filled data
    const checkoutData: any = {
      bookId,
      reorder: true,
    };

    if (body.useLastShipping && lastOrder) {
      // Pre-fill shipping info from last order
      checkoutData.prefill = {
        email: lastOrder.email,
        shippingName: lastOrder.shippingName,
        shippingAddressLine1: lastOrder.shippingAddressLine1,
        shippingAddressLine2: lastOrder.shippingAddressLine2,
        shippingCity: lastOrder.shippingCity,
        shippingState: lastOrder.shippingState,
        shippingZip: lastOrder.shippingZip,
        shippingCountry: lastOrder.shippingCountry,
        phone: lastOrder.phone,
      };
    }

    // Build checkout URL
    const params = new URLSearchParams();
    params.set('bookId', bookId);
    params.set('reorder', 'true');
    
    if (checkoutData.prefill) {
      params.set('prefill', JSON.stringify(checkoutData.prefill));
    }

    const checkoutUrl = `/checkout?${params.toString()}`;

    return NextResponse.json({
      success: true,
      message: 'Reorder initiated',
      checkoutUrl,
      bookId,
      lastOrder: lastOrder
        ? {
            id: lastOrder.id,
            total: lastOrder.total,
            createdAt: lastOrder.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process reorder' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch reorder information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;

    // Get book
    const [book] = await db.select().from(books).where(eq(books.id, bookId)).limit(1);

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Get all orders for this book
    const bookOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.bookId, bookId))
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({
      success: true,
      book: {
        id: book.id,
        title: book.title,
        status: book.status,
      },
      orders: bookOrders.map((order) => ({
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        shippedAt: order.shippedAt,
      })),
      canReorder: bookOrders.length > 0,
    });
  } catch (error) {
    console.error('Failed to fetch reorder info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reorder information' },
      { status: 500 }
    );
  }
}
