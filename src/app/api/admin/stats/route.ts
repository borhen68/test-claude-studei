import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In production, calculate from real database
    const stats = {
      totalOrders: 247,
      pendingOrders: 12,
      totalRevenue: 1485300, // $14,853.00
      avgOrderValue: 6012, // $60.12
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
