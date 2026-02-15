import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * PATCH /api/admin/orders/:id
 * Update order status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check here
    
    const { id } = params;
    const body = await request.json();
    const { status, trackingNumber } = body;
    
    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Missing status' },
        { status: 400 }
      );
    }
    
    const updates: any = { 
      status, 
      updatedAt: new Date() 
    };
    
    if (trackingNumber) {
      updates.trackingNumber = trackingNumber;
    }
    
    if (status === 'shipped' && !updates.shippedAt) {
      updates.shippedAt = new Date();
    }
    
    if (status === 'delivered') {
      updates.deliveredAt = new Date();
    }
    
    const [order] = await db
      .update(orders)
      .set(updates)
      .where(eq(orders.id, id))
      .returning();
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
