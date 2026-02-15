import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/payments/stripe-client';

export async function POST(request: NextRequest) {
  try {
    const { bookId, productSku, pageCount } = await request.json();
    
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID required' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Calculate price based on product and page count
    let priceInCents = 3900; // Default $39.00
    
    if (productSku && pageCount) {
      // Import product calculator
      const { getProductBySku, calculatePrice } = await import('@/lib/cloudprinter/products');
      const product = getProductBySku(productSku);
      
      if (product) {
        priceInCents = calculatePrice(product, pageCount);
      }
    }
    
    const session = await createCheckoutSession({
      bookId,
      priceInCents,
      successUrl: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/book/${bookId}`,
      metadata: {
        productSku: productSku || 'book_hardcover_30x30',
        pageCount: String(pageCount || 36),
      },
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
