import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// Mock database - in production, use real database
const orders: any[] = [];

export async function GET(request: NextRequest) {
  try {
    // In production, filter by user session/auth
    return NextResponse.json({
      success: true,
      orders: orders.slice(0, 20), // Return most recent 20
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookId, config, shipping, pricing } = body;

    // Generate order number
    const orderNumber = `FT${Date.now().toString().slice(-8)}`;
    
    // Calculate estimated delivery (7 business days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    const order = {
      id: nanoid(),
      orderNumber,
      bookId,
      status: 'pending',
      config,
      shipping,
      pricing,
      total: pricing.total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
      customer: {
        name: shipping.name,
        email: shipping.email,
      },
      book: {
        title: 'Your Photo Book', // In production, fetch from database
        coverImageUrl: null,
      },
    };

    // Save to mock database
    orders.unshift(order);

    // In production:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Create fulfillment order with Printful
    // 4. Process payment with Stripe

    console.log('Order created:', order);

    // Mock email sending
    console.log(`📧 Sending confirmation email to ${shipping.email}`);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
