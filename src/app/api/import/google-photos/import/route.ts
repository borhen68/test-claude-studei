import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, photos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Import photos from Google Photos
 * POST /api/import/google-photos/import
 */
export async function POST(request: NextRequest) {
  try {
    const { bookId, code } = await request.json();

    if (!bookId || !code) {
      return NextResponse.json(
        { success: false, error: 'bookId and code required' },
        { status: 400 }
      );
    }

    // Verify book exists
    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Token exchange failed:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to get access token' },
        { status: 500 }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Fetch recent photos from Google Photos
    // Note: Google Photos API requires specific mediaItems endpoint
    const photosResponse = await fetch(
      'https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!photosResponse.ok) {
      const error = await photosResponse.text();
      console.error('Failed to fetch photos:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch photos from Google' },
        { status: 500 }
      );
    }

    const { mediaItems = [] } = await photosResponse.json();

    // Filter only images
    const imageItems = mediaItems.filter(
      (item: any) => item.mimeType?.startsWith('image/')
    );

    // Import photos to our system
    let importedCount = 0;
    
    for (const item of imageItems.slice(0, 60)) {  // Limit to 60 photos
      try {
        // Download image
        const imageUrl = `${item.baseUrl}=d`; // =d for download
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();

        // Save to uploads directory
        const filename = item.filename || `google-photo-${Date.now()}.jpg`;
        const uploadPath = `uploads/${bookId}/${filename}`;
        
        // Here you would typically:
        // 1. Save the file
        // 2. Process it (analyze, enhance, etc.)
        // 3. Create photo record
        
        // For now, create photo record with Google URL
        await db.insert(photos).values({
          bookId: book.id,
          originalUrl: item.baseUrl,
          filename: item.filename,
          width: parseInt(item.mediaMetadata?.width) || 0,
          height: parseInt(item.mediaMetadata?.height) || 0,
          dateTaken: item.mediaMetadata?.creationTime 
            ? new Date(item.mediaMetadata.creationTime) 
            : null,
          mimeType: item.mimeType,
        });

        importedCount++;
      } catch (photoError) {
        console.error(`Failed to import photo ${item.id}:`, photoError);
        // Continue with other photos
      }
    }

    // Update book status
    await db
      .update(books)
      .set({
        status: 'processing',
        source: 'google-photos',
      })
      .where(eq(books.id, bookId));

    return NextResponse.json({
      success: true,
      photoCount: importedCount,
      message: `Imported ${importedCount} photos from Google Photos`,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Import failed',
      },
      { status: 500 }
    );
  }
}
