import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, photos } from '@/lib/db/schema';
import { processPhoto } from '@/lib/photo-analysis/processor';
import { uploadFile, generateAndUploadThumbnail, generateAndUploadPreview } from '@/lib/storage/unified-storage';
import { eq } from 'drizzle-orm';

/**
 * POST /api/upload
 * Handle photo upload and analysis
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const bookId = formData.get('bookId') as string;
    const file = formData.get('file') as File;
    
    if (!bookId || !file) {
      return NextResponse.json(
        { success: false, error: 'Missing bookId or file' },
        { status: 400 }
      );
    }
    
    // Verify book exists
    const [book] = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Process photo (analyze) - this extracts EXIF, quality, colors
    const analysis = await processPhoto(buffer);
    
    // Upload original, thumbnail, and preview in parallel
    const [originalUpload, thumbnailUpload, previewUpload] = await Promise.all([
      uploadFile(buffer, bookId, file.name, { contentType: file.type }),
      generateAndUploadThumbnail(buffer, bookId, file.name),
      generateAndUploadPreview(buffer, bookId, file.name),
    ]);
    
    // Save to database
    const [photo] = await db.insert(photos).values({
      bookId,
      originalUrl: originalUpload.url,
      processedUrl: previewUpload.url,
      thumbnailUrl: thumbnailUpload.url,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      
      width: analysis.width,
      height: analysis.height,
      aspectRatio: analysis.aspectRatio.toString(),
      orientation: analysis.orientation,
      
      dateTaken: analysis.dateTaken,
      cameraMake: analysis.cameraMake,
      cameraModel: analysis.cameraModel,
      exifOrientation: analysis.exifOrientation,
      
      qualityScore: analysis.qualityScore,
      sharpnessScore: analysis.sharpnessScore.toString(),
      
      dominantColor: analysis.dominantColor,
      colorPalette: analysis.colorPalette,
      
      hasFaces: analysis.hasFaces,
      faceCount: analysis.faceCount,
    }).returning();
    
    return NextResponse.json({
      success: true,
      photo: {
        id: photo.id,
        url: photo.processedUrl,
        thumbnailUrl: photo.thumbnailUrl,
        qualityScore: photo.qualityScore,
        dominantColor: photo.dominantColor,
        orientation: photo.orientation,
      },
    });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload?bookId=xxx
 * Get all photos for a book
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    
    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'Missing bookId' },
        { status: 400 }
      );
    }
    
    const bookPhotos = await db.select().from(photos).where(eq(photos.bookId, bookId));
    
    return NextResponse.json({
      success: true,
      photos: bookPhotos,
    });
  } catch (error) {
    console.error('Failed to fetch photos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
