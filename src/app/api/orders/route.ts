import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, books } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * POST /api/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookId,
      productId,
      quantity,
      shipping,
      subtotal,
      shippingCost,
      tax,
      total,
    } = body;
    
    if (!bookId || !shipping) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify book exists
    const [book] = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Create order
    const [order] = await db.insert(orders).values({
      bookId,
      email: shipping.email,
      shippingName: shipping.name,
      shippingAddressLine1: shipping.address,
      shippingCity: shipping.city,
      shippingState: shipping.state,
      shippingZip: shipping.zip,
      shippingCountry: shipping.country || 'US',
      subtotal,
      shippingCost,
      tax,
      total,
      status: 'paid', // Mock payment - in production would be 'pending'
      paidAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    // Update book status
    await db.update(books)
      .set({ status: 'ordered', updatedAt: new Date() })
      .where(eq(books.id, bookId));
    
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
      },
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders?email=xxx
 * Get orders for an email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Missing email parameter' },
        { status: 400 }
      );
    }
    
    const userOrders = await db.select().from(orders).where(eq(orders.email, email));
    
    return NextResponse.json({
      success: true,
      orders: userOrders,
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
