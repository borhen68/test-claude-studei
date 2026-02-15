/**
 * CloudPrinter Order API
 * POST /api/cloudprinter/order - Create new CloudPrinter order
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCloudPrinterOrder } from '@/lib/cloudprinter/service';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { CreateOrderParams } from '@/lib/cloudprinter/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, bookId, productSku, pageCount } = body;

    if (!orderId || !bookId || !productSku || !pageCount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get order from database
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Prepare order params
    const orderParams: CreateOrderParams = {
      bookId,
      orderId,
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
        coverUrl: body.coverUrl || `https://cdn.frametale.com/books/${bookId}/cover.pdf`,
        contentUrl: body.contentUrl || `https://cdn.frametale.com/books/${bookId}/content.pdf`,
      },
      shippingLevel: body.shippingLevel || 'cp_standard',
    };

    // Create CloudPrinter order
    const response = await createCloudPrinterOrder(orderParams);

    if (!response.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create CloudPrinter order',
          details: response.errors,
        },
        { status: 500 }
      );
    }

    // Update order with CloudPrinter ID
    await db
      .update(orders)
      .set({
        printfulOrderId: response.order_id, // Reusing printful field for CloudPrinter ID
        status: 'processing',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    return NextResponse.json({
      success: true,
      cloudprinterId: response.order_id,
      reference: response.reference,
    });

  } catch (error) {
    console.error('CloudPrinter order creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create CloudPrinter order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
