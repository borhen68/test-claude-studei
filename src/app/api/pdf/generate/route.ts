import { NextRequest, NextResponse } from 'next/server';
import { generateBookPDF } from '@/lib/pdf/print-generator';

export const dynamic = 'force-dynamic';

/**
 * POST /api/pdf/generate
 * Generate cover + interior PDFs for a book
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json(
        { error: 'bookId is required' },
        { status: 400 }
      );
    }

    console.log(`\n📚 PDF generation requested for book: ${bookId}`);

    const result = await generateBookPDF(bookId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, warnings: result.warnings },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cover: {
        url: result.coverUrl,
        md5: result.coverMd5,
      },
      interior: {
        url: result.interiorUrl,
        md5: result.interiorMd5,
      },
      warnings: result.warnings,
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
