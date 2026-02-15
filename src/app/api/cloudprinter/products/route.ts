/**
 * CloudPrinter Products API
 * GET /api/cloudprinter/products - Get product catalog
 */

import { NextResponse } from 'next/server';
import { cloudPrinterClient } from '@/lib/cloudprinter/client';
import { FRAMETALE_PRODUCTS } from '@/lib/cloudprinter/products';

export async function GET() {
  try {
    // Get CloudPrinter catalog
    const cpProducts = await cloudPrinterClient.getProducts();

    // Return combined data: Frametale products + CloudPrinter catalog
    return NextResponse.json({
      success: true,
      frametaleProducts: FRAMETALE_PRODUCTS,
      cloudprinterCatalog: cpProducts.products || [],
    });

  } catch (error) {
    console.error('CloudPrinter products fetch error:', error);
    
    // Fallback to Frametale products only
    return NextResponse.json({
      success: true,
      frametaleProducts: FRAMETALE_PRODUCTS,
      cloudprinterCatalog: [],
      error: 'Could not fetch CloudPrinter catalog',
    });
  }
}
