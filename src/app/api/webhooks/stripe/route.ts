import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payments/stripe-client';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendOrderConfirmation } from '@/lib/email/templates';
import { createCloudPrinterOrder } from '@/lib/cloudprinter/service';

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

          // Get updated order
          const [order] = await db
            .select()
            .from(orders)
            .where(eq(orders.bookId, bookId))
            .limit(1);

          if (order) {
            // Send confirmation email
            if (session.customer_details?.email) {
              await sendOrderConfirmation({
                to: session.customer_details.email,
                orderId: order.id,
                bookTitle: 'Your Photos',
                total: session.amount_total || 3900,
                shippingAddress: formatAddress(session.shipping_details?.address),
              });
            }

            // Create CloudPrinter order asynchronously
            const productSku = session.metadata?.productSku || 'book_hardcover_30x30';
            const pageCount = parseInt(session.metadata?.pageCount || '36');

            try {
              const cpResponse = await createCloudPrinterOrder({
                bookId,
                orderId: order.id,
                email: order.email,
                shippingAddress: {
                  firstName: order.shippingName.split(' ')[0] || order.shippingName,
                  lastName: order.shippingName.split(' ').slice(1).join(' ') || '',
                  addressLine1: order.shippingAddressLine1,
                  addressLine2: order.shippingAddressLine2 || undefined,
                  city: order.shippingCity,
                  state: order.shippingState,
                  zip: order.shippingZip,
                  country: order.shippingCountry,
                  phone: order.phone || undefined,
                },
                product: {
                  sku: productSku,
                  pageCount,
                  paperType: 'paper_130mcg',
                },
                files: {
                  coverUrl: `https://cdn.frametale.com/books/${bookId}/cover.pdf`,
                  contentUrl: `https://cdn.frametale.com/books/${bookId}/content.pdf`,
                },
                shippingLevel: 'cp_standard',
              });

              if (cpResponse.success) {
                // Update order with CloudPrinter ID
                await db
                  .update(orders)
                  .set({
                    printfulOrderId: cpResponse.order_id,
                    status: 'processing',
                    updatedAt: new Date(),
                  })
                  .where(eq(orders.id, order.id));

                console.log(`✅ CloudPrinter order created: ${cpResponse.order_id}`);
              }
            } catch (cpError) {
              console.error('❌ Failed to create CloudPrinter order:', cpError);
              // Don't fail the webhook - order is still paid
            }
          }
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
