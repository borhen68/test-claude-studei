/**
 * CloudPrinter Product Catalog and SKU Mapping
 */

import type { FrametaleProduct } from './types';

/**
 * Frametale Product Catalog mapped to CloudPrinter SKUs
 */
export const FRAMETALE_PRODUCTS: FrametaleProduct[] = [
  {
    id: 'photobook-8x8',
    name: 'Photo Book 8x8"',
    cloudprinterSku: 'book_hardcover_21x21',
    basePrice: 2500,
    sizes: [
      {
        code: '21x21',
        name: '8x8" (21x21cm)',
        dimensions: '21cm x 21cm',
      },
    ],
    paperOptions: [
      {
        code: 'paper_130mcg',
        name: 'Premium Silk',
        weight: '130mcg',
      },
    ],
    minPages: 20,
    maxPages: 60,
  },
  {
    id: 'photobook-10x10',
    name: 'Photo Book 10x10"',
    cloudprinterSku: 'book_hardcover_25x25',
    basePrice: 3200,
    sizes: [
      {
        code: '25x25',
        name: '10x10" (25x25cm)',
        dimensions: '25cm x 25cm',
      },
    ],
    paperOptions: [
      {
        code: 'paper_130mcg',
        name: 'Premium Silk',
        weight: '130mcg',
      },
    ],
    minPages: 20,
    maxPages: 60,
  },
  {
    id: 'photobook-12x12',
    name: 'Photo Book 12x12"',
    cloudprinterSku: 'book_hardcover_30x30',
    basePrice: 3900,
    sizes: [
      {
        code: '30x30',
        name: '12x12" (30x30cm)',
        dimensions: '30cm x 30cm',
      },
    ],
    paperOptions: [
      {
        code: 'paper_130mcg',
        name: 'Premium Silk',
        weight: '130mcg',
      },
    ],
    minPages: 20,
    maxPages: 60,
  },
];

/**
 * Get product by ID
 */
export function getProductById(productId: string): FrametaleProduct | undefined {
  return FRAMETALE_PRODUCTS.find(p => p.id === productId);
}

/**
 * Get product by CloudPrinter SKU
 */
export function getProductBySku(sku: string): FrametaleProduct | undefined {
  return FRAMETALE_PRODUCTS.find(p => p.cloudprinterSku === sku);
}

/**
 * Get default product (most popular)
 */
export function getDefaultProduct(): FrametaleProduct {
  return FRAMETALE_PRODUCTS[2]; // 12x12" is the default/premium option
}

/**
 * Validate page count for a product
 */
export function isValidPageCount(product: FrametaleProduct, pageCount: number): boolean {
  return pageCount >= product.minPages && pageCount <= product.maxPages;
}

/**
 * Calculate price based on product and page count
 */
export function calculatePrice(product: FrametaleProduct, pageCount: number): number {
  if (!isValidPageCount(product, pageCount)) {
    throw new Error(`Invalid page count ${pageCount} for product ${product.name}`);
  }

  // Base price + additional pages
  const basePagesIncluded = 20;
  const extraPages = Math.max(0, pageCount - basePagesIncluded);
  const pricePerExtraPage = 100; // $1.00 per extra page

  return product.basePrice + (extraPages * pricePerExtraPage);
}

/**
 * Get shipping levels with descriptions
 */
export const SHIPPING_LEVELS = {
  cp_saver: {
    name: 'Economy Shipping',
    description: '7-14 business days',
    price: 0,
  },
  cp_standard: {
    name: 'Standard Shipping',
    description: '5-7 business days',
    price: 500,
  },
  cp_express: {
    name: 'Express Shipping',
    description: '2-3 business days',
    price: 1500,
  },
} as const;

/**
 * Format price in dollars
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
