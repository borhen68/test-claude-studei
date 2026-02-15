import { NextRequest, NextResponse } from 'next/server';

// Mock orders database (shared with main orders API)
const mockOrders = [
  {
    id: 'ord_001',
    orderNumber: 'FT12345678',
    status: 'pending',
    total: 5999,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
    },
    book: {
      title: 'Summer Vacation 2025',
      coverImageUrl: null,
    },
    config: {
      size: '8x8',
      paperType: 'premium',
      coverType: 'hardcover',
      quantity: 1,
    },
    shipping: {
      address: '123 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
    },
  },
  {
    id: 'ord_002',
    orderNumber: 'FT12345679',
    status: 'processing',
    total: 7999,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      name: 'Michael Chen',
      email: 'michael@example.com',
    },
    book: {
      title: 'Wedding Memories',
      coverImageUrl: null,
    },
    config: {
      size: '10x10',
      paperType: 'lustre',
      coverType: 'premium-hardcover',
      quantity: 2,
    },
    shipping: {
      address: '456 Maple Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
    },
    trackingNumber: '1Z999AA10123456784',
  },
  {
    id: 'ord_003',
    orderNumber: 'FT12345680',
    status: 'shipped',
    total: 4999,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
    },
    book: {
      title: 'Baby\'s First Year',
      coverImageUrl: null,
    },
    config: {
      size: '8x8',
      paperType: 'standard',
      coverType: 'hardcover',
      quantity: 1,
    },
    shipping: {
      address: '789 Pine Rd',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
    },
    trackingNumber: '1Z999AA10123456785',
  },
];

export async function GET(request: NextRequest) {
  try {
    // In production, verify admin authentication
    
    return NextResponse.json({
      success: true,
      orders: mockOrders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
