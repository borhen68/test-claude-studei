import { NextRequest, NextResponse } from 'next/server';
import { BOOK_THEMES } from '@/lib/themes';

/**
 * GET /api/themes
 * Get all available themes
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      themes: BOOK_THEMES,
    });
  } catch (error) {
    console.error('Failed to get themes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get themes' },
      { status: 500 }
    );
  }
}
