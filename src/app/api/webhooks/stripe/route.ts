import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payments/stripe-client';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendOrderConfirmation } from '@/lib/email/templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const event = verifyWebhookSignature(body, signature);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const bookId = session.metadata?.bookId;
        
        if (bookId) {
          // Update order in database
          await db.update(orders)
            .set({
              stripeCheckoutSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string,
              paidAt: new Date(),
              status: 'paid',
            })
            .where(eq(orders.bookId, bookId));

          // Send confirmation email
          if (session.customer_details?.email) {
            await sendOrderConfirmation({
              to: session.customer_details.email,
              orderId: bookId,
              bookTitle: 'Your Photos',
              total: session.amount_total || 3900,
              shippingAddress: formatAddress(session.shipping_details?.address),
            });
          }

          // TODO: Trigger PDF generation
          // TODO: Submit to Printful
        }
        break;

      case 'charge.refunded':
        // Handle refund
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}

function formatAddress(address: any): string {
  if (!address) return 'Address not provided';
  
  return [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.postal_code}`,
    address.country,
  ].filter(Boolean).join('\n');
}
