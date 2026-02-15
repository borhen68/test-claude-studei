/**
 * Photo Upload API Route
 * 
 * Handles photo uploads with full processing pipeline:
 * 1. Receive multipart/form-data with photo file
 * 2. Validate book exists and user has access
 * 3. Analyze photo (EXIF, quality, colors, dimensions)
 * 4. Generate multiple sizes (original, preview, thumbnail)
 * 5. Upload all variants to storage (S3/R2/local)
 * 6. Save metadata to database
 * 
 * POST /api/upload - Upload single photo
 * GET /api/upload?bookId=xxx - List all photos in book
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, photos } from '@/lib/db/schema';
import { processPhoto } from '@/lib/photo-analysis/processor';
import { uploadFile, generateAndUploadThumbnail, generateAndUploadPreview } from '@/lib/storage/unified-storage';
import { eq } from 'drizzle-orm';

/**
 * POST /api/upload
 * 
 * Upload and process a single photo for a book.
 * 
 * Request:
 * - Content-Type: multipart/form-data
 * - bookId: string (UUID of target book)
 * - file: File (image file, max 50MB recommended)
 * 
 * Response:
 * - success: boolean
 * - photo: { id, url, thumbnailUrl, qualityScore, dominantColor, orientation }
 * - error: string (if failed)
 * 
 * @throws 400 - Missing bookId or file
 * @throws 404 - Book not found
 * @throws 500 - Upload or processing failed
 */
export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const bookId = formData.get('bookId') as string;
    const file = formData.get('file') as File;
    
    // Validate required fields
    if (!bookId || !file) {
      return NextResponse.json(
        { success: false, error: 'Missing bookId or file' },
        { status: 400 }
      );
    }
    
    // Verify book exists in database
    // TODO: Add user authentication check - ensure user owns this book
    const [book] = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Convert File object to Buffer for processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Process photo - extract all metadata and quality metrics
    // This is the expensive operation (EXIF parsing, color extraction, quality analysis)
    const analysis = await processPhoto(buffer);
    
    // Upload in parallel for speed:
    // 1. Original full-resolution image
    // 2. Thumbnail (150x150) for UI grids
    // 3. Preview (1200px max) for viewer
    const [originalUpload, thumbnailUpload, previewUpload] = await Promise.all([
      uploadFile(buffer, bookId, file.name, { contentType: file.type }),
      generateAndUploadThumbnail(buffer, bookId, file.name),
      generateAndUploadPreview(buffer, bookId, file.name),
    ]);
    
    // Save photo metadata to database
    const [photo] = await db.insert(photos).values({
      bookId,
      
      // Storage URLs
      originalUrl: originalUpload.url,
      processedUrl: previewUpload.url,
      thumbnailUrl: thumbnailUpload.url,
      
      // File metadata
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      
      // Dimensions
      width: analysis.width,
      height: analysis.height,
      aspectRatio: analysis.aspectRatio.toString(),
      orientation: analysis.orientation,
      
      // EXIF data
      dateTaken: analysis.dateTaken,
      cameraMake: analysis.cameraMake,
      cameraModel: analysis.cameraModel,
      exifOrientation: analysis.exifOrientation,
      
      // Quality metrics
      qualityScore: analysis.qualityScore,
      sharpnessScore: analysis.sharpnessScore.toString(),
      
      // Color analysis
      dominantColor: analysis.dominantColor,
      colorPalette: analysis.colorPalette,
      
      // Face detection (if implemented)
      hasFaces: analysis.hasFaces,
      faceCount: analysis.faceCount,
    }).returning();
    
    // Return minimal photo data for UI update
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
    
    // Return user-friendly error message
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload?bookId=xxx
 * 
 * Retrieve all photos for a specific book.
 * Used to load existing photos when user returns to editing.
 * 
 * Query Parameters:
 * - bookId: string (UUID)
 * 
 * Response:
 * - success: boolean
 * - photos: Photo[] (array of all photo records)
 * 
 * @throws 400 - Missing bookId
 * @throws 500 - Database query failed
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
    
    // Fetch all photos for this book
    // TODO: Add pagination for books with 100+ photos
    // TODO: Add user auth check - ensure user owns this book
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
