import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, photos } from '@/lib/db/schema';
import { processPhoto } from '@/lib/photo-analysis/processor';
import { uploadFile } from '@/lib/storage/r2';
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
    const book = await db.query.books.findFirst({
      where: eq(books.id, bookId),
    });
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Process photo (analyze)
    const analysis = await processPhoto(buffer);
    
    // Upload to storage
    const fileKey = `${bookId}/${file.name}`;
    const upload = await uploadFile(buffer, fileKey, file.type);
    
    // Save to database
    const [photo] = await db.insert(photos).values({
      bookId,
      originalUrl: upload.url,
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
        url: photo.originalUrl,
        qualityScore: photo.qualityScore,
      },
    });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
