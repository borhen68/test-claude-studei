/**
 * Checkout API Route
 * 
 * Creates Stripe checkout sessions for book purchases.
 * Handles pricing calculation based on product SKU and page count.
 * 
 * POST /api/checkout - Create Stripe checkout session
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/payments/stripe-client';

/**
 * POST /api/checkout
 * 
 * Create a Stripe Checkout session for book purchase.
 * Calculates pricing based on selected product and page count,
 * then redirects user to Stripe's hosted checkout page.
 * 
 * Request Body:
 * - bookId: string (UUID) - Required
 * - productSku: string (optional) - Product SKU for pricing
 * - pageCount: number (optional) - Number of pages for pricing
 * 
 * Response:
 * - success: boolean
 * - checkoutUrl: string (Stripe hosted checkout URL)
 * - sessionId: string (Stripe session ID for tracking)
 * - error: string (if failed)
 * 
 * @throws 400 - Missing bookId
 * @throws 500 - Stripe API error or pricing calculation failure
 * 
 * @example
 * POST /api/checkout
 * {
 *   "bookId": "123e4567-e89b-12d3-a456-426614174000",
 *   "productSku": "book_hardcover_30x30",
 *   "pageCount": 48
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "checkoutUrl": "https://checkout.stripe.com/c/pay/...",
 *   "sessionId": "cs_test_..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { bookId, productSku, pageCount } = await request.json();
    
    // Validate required fields
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Book ID required' },
        { status: 400 }
      );
    }

    // Get application URL for redirect URLs
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Calculate price based on product and page count
    // Default: $39.00 for standard 36-page hardcover book
    let priceInCents = 3900;
    
    if (productSku && pageCount) {
      // Dynamic import to avoid loading pricing module if not needed
      const { getProductBySku, calculatePrice } = await import('@/lib/cloudprinter/products');
      const product = getProductBySku(productSku);
      
      if (product) {
        // Calculate actual price based on CloudPrinter product pricing
        priceInCents = calculatePrice(product, pageCount);
      }
    }
    
    // Create Stripe checkout session
    // User will be redirected to Stripe's hosted checkout page
    const session = await createCheckoutSession({
      bookId,
      priceInCents,
      
      // Redirect URLs after payment
      successUrl: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/book/${bookId}`,
      
      // Metadata stored with Stripe session for order fulfillment
      metadata: {
        productSku: productSku || 'book_hardcover_30x30',
        pageCount: String(pageCount || 36),
      },
    });
    
    // Return checkout URL for client-side redirect
    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout creation failed:', error);
    
    // Return user-friendly error
    // Don't expose internal error details to client
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
