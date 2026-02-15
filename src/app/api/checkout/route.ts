import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/payments/stripe-client';

export async function POST(request: NextRequest) {
  try {
    const { bookId } = await request.json();
    
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID required' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const session = await createCheckoutSession({
      bookId,
      priceInCents: 3900, // $39.00
      successUrl: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/book/${bookId}`,
    });
    
    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout creation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
