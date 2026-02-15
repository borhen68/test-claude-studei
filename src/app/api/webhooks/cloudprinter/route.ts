/**
 * CloudPrinter Webhook Handler
 * POST /api/webhooks/cloudprinter - Receive order status updates
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { mapCloudPrinterStatus } from '@/lib/cloudprinter/service';
import type { CloudPrinterWebhook } from '@/lib/cloudprinter/types';
import { createHash, timingSafeEqual } from 'crypto';

const WEBHOOK_SECRET = process.env.CLOUDPRINTER_WEBHOOK_SECRET;

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(body: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) {
    console.warn('⚠️  Webhook signature verification skipped - no secret configured');
    return true; // Skip verification in development
  }

  const expectedSignature = createHash('sha256')
    .update(body + WEBHOOK_SECRET)
    .digest('hex');

  try {
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-cloudprinter-signature');

    // Verify signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhook: CloudPrinterWebhook = JSON.parse(body);
    console.log('📬 CloudPrinter webhook received:', webhook.event, webhook.reference);

    // Find order by CloudPrinter ID (stored in printfulOrderId field)
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.printfulOrderId, webhook.order_id))
      .limit(1);

    if (!order) {
      console.warn(`⚠️  Order not found for CloudPrinter ID: ${webhook.order_id}`);
      return NextResponse.json({ received: true });
    }

    // Map CloudPrinter status to Frametale status
    const newStatus = mapCloudPrinterStatus(webhook.data.status);

    // Update order
    const updates: any = {
      status: newStatus,
      updatedAt: new Date(),
    };

    // Handle tracking info
    if (webhook.data.items && webhook.data.items.length > 0) {
      const firstItem = webhook.data.items[0];
      if (firstItem.tracking) {
        updates.trackingNumber = firstItem.tracking.number;
        updates.trackingUrl = firstItem.tracking.url;
        
        if (webhook.data.status === 'shipped') {
          updates.shippedAt = new Date();
        }
      }
    }

    // Handle delivery
    if (webhook.data.status === 'delivered') {
      updates.deliveredAt = new Date();
    }

    await db
      .update(orders)
      .set(updates)
      .where(eq(orders.id, order.id));

    console.log(`✅ Order ${order.id} updated to status: ${newStatus}`);

    // TODO: Send customer notification email based on status

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('CloudPrinter webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
