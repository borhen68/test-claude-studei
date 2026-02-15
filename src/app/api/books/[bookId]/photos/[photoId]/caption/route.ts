import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { photos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * PUT /api/books/:bookId/photos/:photoId/caption
 * Update photo caption
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { bookId: string; photoId: string } }
) {
  try {
    const { photoId } = params;
    const body = await request.json();

    const { caption, captionPosition, captionSize } = body;

    // Build update object
    const updateData: any = {};

    if (caption !== undefined) updateData.caption = caption;
    if (captionPosition !== undefined) updateData.captionPosition = captionPosition;
    if (captionSize !== undefined) updateData.captionSize = captionSize;

    // Update the photo
    const [updatedPhoto] = await db
      .update(photos)
      .set(updateData)
      .where(eq(photos.id, photoId))
      .returning();

    if (!updatedPhoto) {
      return NextResponse.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      photo: updatedPhoto,
    });
  } catch (error) {
    console.error('Failed to update caption:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update caption' },
      { status: 500 }
    );
  }
}
