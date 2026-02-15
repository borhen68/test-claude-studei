import { NextRequest, NextResponse } from 'next/server';
import { getPDFStatus } from '@/lib/pdf/print-generator';

export const dynamic = 'force-dynamic';

/**
 * GET /api/pdf/status/[id]
 * Check PDF generation status for a book
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;

    const status = await getPDFStatus(bookId);

    return NextResponse.json(status);
  } catch (error) {
    console.error('PDF status error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
