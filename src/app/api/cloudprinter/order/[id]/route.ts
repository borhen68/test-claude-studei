/**
 * CloudPrinter Order Status API
 * GET /api/cloudprinter/order/[id] - Get order status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCloudPrinterOrderStatus } from '@/lib/cloudprinter/service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cloudprinterId = params.id;

    if (!cloudprinterId) {
      return NextResponse.json(
        { success: false, error: 'CloudPrinter ID required' },
        { status: 400 }
      );
    }

    const status = await getCloudPrinterOrderStatus(cloudprinterId);

    if (!status.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to get order status',
          details: status.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: status.order,
    });

  } catch (error) {
    console.error('CloudPrinter order status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get order status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
