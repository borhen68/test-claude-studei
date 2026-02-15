/**
 * CloudPrinter Order Service
 * High-level service for creating and managing CloudPrinter orders
 */

import { cloudPrinterClient } from './client';
import { getProductById, calculatePrice } from './products';
import { uploadPDFWithMD5, mockFileUpload } from './files';
import type {
  CreateOrderParams,
  CloudPrinterOrderRequest,
  CloudPrinterOrderResponse,
  CloudPrinterAddress,
  CloudPrinterItem,
  ShippingLevel,
} from './types';

/**
 * Create a CloudPrinter order from Frametale order data
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
    files,
    shippingLevel = 'cp_standard',
  } = params;

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

  // Prepare files with MD5
  let coverFile, contentFile;

  if (process.env.CLOUDPRINTER_API_KEY === 'your_api_key_here') {
    // Mock mode
    coverFile = mockFileUpload(`${bookId}_cover.pdf`);
    contentFile = mockFileUpload(`${bookId}_content.pdf`);
  } else {
    // Real mode - files URLs should already be uploaded
    // In production, you'd pass buffers and upload here
    coverFile = { url: files.coverUrl, md5sum: 'computed_from_buffer' };
    contentFile = { url: files.contentUrl, md5sum: 'computed_from_buffer' };
  }

  // Build CloudPrinter item
  const item: CloudPrinterItem = {
    reference: `item_${bookId}`,
    product: product.sku,
    shipping_level: shippingLevel,
    title: 'Custom Photo Book',
    count: '1',
    files: [
      {
        type: 'cover',
        url: coverFile.url,
        md5sum: coverFile.md5sum,
      },
      {
        type: 'book',
        url: contentFile.url,
        md5sum: contentFile.md5sum,
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
    },
  };

  // Create order via CloudPrinter API
  const response = await cloudPrinterClient.createOrder(orderRequest);

  if (!response.success) {
    throw new Error(
      `CloudPrinter order creation failed: ${response.errors?.map(e => e.message).join(', ')}`
    );
  }

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
