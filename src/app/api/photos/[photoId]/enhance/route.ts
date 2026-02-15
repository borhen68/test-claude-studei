import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { photos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { enhancePhoto, EnhancementLevel } from '@/lib/photo-processing/enhance';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  try {
    const { photoId } = params;
    const body = await request.json();
    const level: EnhancementLevel = body.level || 'auto';

    // Get photo from database
    const [photo] = await db
      .select()
      .from(photos)
      .where(eq(photos.id, photoId))
      .limit(1);

    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    // If already enhanced at this level, return existing
    if (photo.enhancedUrl && photo.enhancementLevel === level) {
      return NextResponse.json({
        success: true,
        photo,
        message: 'Photo already enhanced',
      });
    }

    // Download original from S3
    const originalKey = photo.originalUrl.split('/').pop();
    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: originalKey,
    });

    const response = await s3Client.send(getCommand);
    const originalBuffer = Buffer.from(await response.Body!.transformToByteArray());

    // Enhance photo
    const enhancedBuffer = await enhancePhoto(originalBuffer, { level });

    // Upload enhanced version to S3
    const enhancedKey = `enhanced/${photoId}.jpg`;
    const putCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: enhancedKey,
      Body: enhancedBuffer,
      ContentType: 'image/jpeg',
    });

    await s3Client.send(putCommand);

    const enhancedUrl = `${process.env.S3_PUBLIC_URL}/${enhancedKey}`;

    // Update database
    await db
      .update(photos)
      .set({
        enhancedUrl,
        enhancementLevel: level,
      })
      .where(eq(photos.id, photoId));

    // Fetch updated photo
    const [updatedPhoto] = await db
      .select()
      .from(photos)
      .where(eq(photos.id, photoId))
      .limit(1);

    return NextResponse.json({
      success: true,
      photo: updatedPhoto,
      message: `Photo enhanced with ${level} settings`,
    });
  } catch (error) {
    console.error('Error enhancing photo:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to enhance photo',
      },
      { status: 500 }
    );
  }
}

// Batch enhance all photos in a book
export async function PUT(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  try {
    const body = await request.json();
    const { bookId, level = 'auto' } = body;

    if (!bookId) {
      return NextResponse.json(
        { success: false, error: 'bookId required' },
        { status: 400 }
      );
    }

    // Get all photos for book
    const bookPhotos = await db
      .select()
      .from(photos)
      .where(eq(photos.bookId, bookId));

    // Enhance each photo
    const results = await Promise.allSettled(
      bookPhotos.map(async (photo) => {
        // Skip if already enhanced
        if (photo.enhancedUrl && photo.enhancementLevel === level) {
          return { photoId: photo.id, status: 'skipped' };
        }

        // Download original
        const originalKey = photo.originalUrl.split('/').pop()!;
        const getCommand = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: originalKey,
        });

        const response = await s3Client.send(getCommand);
        const originalBuffer = Buffer.from(await response.Body!.transformToByteArray());

        // Enhance
        const enhancedBuffer = await enhancePhoto(originalBuffer, { level });

        // Upload
        const enhancedKey = `enhanced/${photo.id}.jpg`;
        const putCommand = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: enhancedKey,
          Body: enhancedBuffer,
          ContentType: 'image/jpeg',
        });

        await s3Client.send(putCommand);

        const enhancedUrl = `${process.env.S3_PUBLIC_URL}/${enhancedKey}`;

        // Update DB
        await db
          .update(photos)
          .set({
            enhancedUrl,
            enhancementLevel: level,
          })
          .where(eq(photos.id, photo.id));

        return { photoId: photo.id, status: 'enhanced' };
      })
    );

    const enhanced = results.filter(r => r.status === 'fulfilled' && (r.value as any).status === 'enhanced').length;
    const skipped = results.filter(r => r.status === 'fulfilled' && (r.value as any).status === 'skipped').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      results: {
        total: bookPhotos.length,
        enhanced,
        skipped,
        failed,
      },
      message: `Enhanced ${enhanced} photos, skipped ${skipped}, failed ${failed}`,
    });
  } catch (error) {
    console.error('Error batch enhancing photos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to batch enhance photos',
      },
      { status: 500 }
    );
  }
}
