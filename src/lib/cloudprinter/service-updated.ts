/**
 * CloudPrinter Order Service (Updated with PDF Generator)
 * High-level service for creating and managing CloudPrinter orders
 */

import { cloudPrinterClient } from './client';
import { getProductById, calculatePrice } from './products';
import { generateMD5 } from './files';
import { generateBookPDF } from '../pdf/print-generator';
import type {
  CreateOrderParams,
  CloudPrinterOrderRequest,
  CloudPrinterOrderResponse,
  CloudPrinterAddress,
  CloudPrinterItem,
  ShippingLevel,
} from './types';

/**
 * Create a CloudPrinter order with auto-generated PDFs
 */
export async function createCloudPrinterOrder(
  params: CreateOrderParams
): Promise<CloudPrinterOrderResponse> {
  const {
    bookId,
    orderId,
    email,
    shippingAddress,
    product,
    shippingLevel = 'cp_standard',
  } = params;

  console.log(`\n📦 Creating CloudPrinter order for book: ${bookId}`);

  // Generate PDFs if not already done
  console.log('Generating print-ready PDFs...');
  const pdfResult = await generateBookPDF(bookId);

  if (!pdfResult.success) {
    throw new Error(`PDF generation failed: ${pdfResult.error}`);
  }

  console.log('✓ PDFs generated successfully');
  if (pdfResult.warnings && pdfResult.warnings.length > 0) {
    console.warn('⚠️ Warnings:', pdfResult.warnings);
  }

  // Build CloudPrinter address
  const address: CloudPrinterAddress = {
    type: 'delivery',
    firstname: shippingAddress.firstName,
    lastname: shippingAddress.lastName,
    street1: shippingAddress.addressLine1,
    street2: shippingAddress.addressLine2,
    city: shippingAddress.city,
    state: shippingAddress.state,
    zip: shippingAddress.zip,
    country: shippingAddress.country,
    email: email,
    phone: shippingAddress.phone,
  };

  // Build CloudPrinter item with generated PDFs
  const item: CloudPrinterItem = {
    reference: `item_${bookId}`,
    product: product.sku,
    shipping_level: shippingLevel,
    title: 'Custom Photo Book',
    count: '1',
    files: [
      {
        type: 'cover',
        url: pdfResult.coverUrl!,
        md5sum: pdfResult.coverMd5!,
      },
      {
        type: 'book',
        url: pdfResult.interiorUrl!,
        md5sum: pdfResult.interiorMd5!,
      },
    ],
    options: [
      {
        type: 'total_pages',
        count: String(product.pageCount),
      },
      {
        type: product.paperType || 'paper_130mcg',
        count: String(product.pageCount),
      },
    ],
  };

  // Build final order request
  const orderRequest: Omit<CloudPrinterOrderRequest, 'apikey'> = {
    reference: orderId,
    email: email,
    addresses: [address],
    items: [item],
    meta: {
      bookId: bookId,
      source: 'frametale',
      pdfGeneratedAt: new Date().toISOString(),
    },
  };

  console.log('Submitting order to CloudPrinter...');

  // Create order via CloudPrinter API
  const response = await cloudPrinterClient.createOrder(orderRequest);

  if (!response.success) {
    throw new Error(
      `CloudPrinter order creation failed: ${response.errors?.map(e => e.message).join(', ')}`
    );
  }

  console.log(`✅ CloudPrinter order created: ${response.order_id}`);

  return response;
}

/**
 * Get order status from CloudPrinter
 */
export async function getCloudPrinterOrderStatus(cloudprinterId: string) {
  return await cloudPrinterClient.getOrderStatus(cloudprinterId);
}

/**
 * Sync order status with database
 */
export async function syncOrderStatus(orderId: string, cloudprinterId: string) {
  const status = await getCloudPrinterOrderStatus(cloudprinterId);

  if (!status.success || !status.order) {
    throw new Error('Failed to get order status from CloudPrinter');
  }

  return {
    status: status.order.status,
    tracking: status.order.items[0]?.tracking,
    updatedAt: status.order.updated_at,
  };
}

/**
 * Map CloudPrinter status to Frametale order status
 */
export function mapCloudPrinterStatus(cpStatus: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'processing',
    'processing': 'processing',
    'in_production': 'printing',
    'shipped': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'cancelled',
    'error': 'failed',
  };

  return statusMap[cpStatus] || 'processing';
}
