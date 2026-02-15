import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, photos, pages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function POST(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const { bookId } = params;

    // Fetch original book
    const [originalBook] = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!originalBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Check if book was completed (has PDF or was ordered)
    if (originalBook.status !== 'completed' && !originalBook.finalPdfUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Can only reorder completed books' 
        },
        { status: 400 }
      );
    }

    // Create new book (clone)
    const newSessionToken = nanoid(32);
    const [newBook] = await db
      .insert(books)
      .values({
        userId: originalBook.userId,
        sessionToken: newSessionToken,
        title: originalBook.title || 'Your Photos',
        theme: originalBook.theme,
        pageCount: originalBook.pageCount,
        status: 'processing', // Skip upload step
        source: 'reorder',
        conversionFunnel: {
          ...(originalBook.conversionFunnel as any),
          isReorder: true,
          originalBookId: bookId,
        },
      })
      .returning();

    // Clone all photos
    const originalPhotos = await db
      .select()
      .from(photos)
      .where(eq(photos.bookId, bookId));

    if (originalPhotos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No photos found in original book' },
        { status: 400 }
      );
    }

    // Create photo mappings (old ID -> new ID)
    const photoIdMap = new Map<string, string>();

    const clonedPhotos = await Promise.all(
      originalPhotos.map(async (photo) => {
        const [newPhoto] = await db
          .insert(photos)
          .values({
            bookId: newBook.id,
            originalUrl: photo.originalUrl,
            processedUrl: photo.processedUrl,
            enhancedUrl: photo.enhancedUrl,
            thumbnailUrl: photo.thumbnailUrl,
            filename: photo.filename,
            fileSize: photo.fileSize,
            mimeType: photo.mimeType,
            width: photo.width,
            height: photo.height,
            aspectRatio: photo.aspectRatio,
            dateTaken: photo.dateTaken,
            cameraMake: photo.cameraMake,
            cameraModel: photo.cameraModel,
            exifOrientation: photo.exifOrientation,
            qualityScore: photo.qualityScore,
            sharpnessScore: photo.sharpnessScore,
            hasFaces: photo.hasFaces,
            faceCount: photo.faceCount,
            dominantColor: photo.dominantColor,
            colorPalette: photo.colorPalette,
            orientation: photo.orientation,
            isDuplicate: photo.isDuplicate,
            usedInLayout: photo.usedInLayout,
            sortOrder: photo.sortOrder,
            enhancementLevel: photo.enhancementLevel,
          })
          .returning();

        photoIdMap.set(photo.id, newPhoto.id);
        return newPhoto;
      })
    );

    // Clone all pages (update photo IDs)
    const originalPages = await db
      .select()
      .from(pages)
      .where(eq(pages.bookId, bookId));

    await Promise.all(
      originalPages.map(async (page) => {
        // Update photo IDs in the page data
        const oldPhotoIds = page.photoIds as string[];
        const newPhotoIds = oldPhotoIds.map(oldId => photoIdMap.get(oldId) || oldId);

        await db.insert(pages).values({
          bookId: newBook.id,
          pageNumber: page.pageNumber,
          template: page.template,
          photoIds: newPhotoIds,
          layoutData: page.layoutData,
          textContent: page.textContent,
        });
      })
    );

    // Update book status to ready for preview
    await db
      .update(books)
      .set({
        status: 'ready',
        coverImageUrl: originalBook.coverImageUrl,
        previewPdfUrl: originalBook.previewPdfUrl, // Can reuse preview
      })
      .where(eq(books.id, newBook.id));

    return NextResponse.json({
      success: true,
      book: newBook,
      message: `Book cloned successfully. ${clonedPhotos.length} photos copied.`,
      stats: {
        photosCloned: clonedPhotos.length,
        pagesCloned: originalPages.length,
      },
      redirectUrl: `/book/${newBook.id}/preview`,
    });
  } catch (error) {
    console.error('Error reordering book:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reorder book',
      },
      { status: 500 }
    );
  }
}
