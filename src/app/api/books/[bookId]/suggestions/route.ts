import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { photos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSuggestedPhotos } from '@/lib/photo-processing/suggestions';

export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const { bookId } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '60');

    // Fetch all photos for this book
    const bookPhotos = await db
      .select()
      .from(photos)
      .where(eq(photos.bookId, bookId));

    if (bookPhotos.length === 0) {
      return NextResponse.json({
        success: true,
        suggested: [],
        total: 0,
        message: 'No photos found for this book',
      });
    }

    // Get suggested photos
    const suggested = getSuggestedPhotos(bookPhotos, limit);

    return NextResponse.json({
      success: true,
      suggested,
      total: bookPhotos.length,
      suggestedCount: suggested.length,
      message: `Found ${suggested.length} recommended photos out of ${bookPhotos.length}`,
    });
  } catch (error) {
    console.error('Error getting photo suggestions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate photo suggestions',
      },
      { status: 500 }
    );
  }
}
