import { db } from '../src/lib/db';
import { books, photos, pages, orders } from '../src/lib/db/schema';

const SAMPLE_PHOTOS = [
  { width: 3000, height: 2000, orientation: 'landscape' as const },
  { width: 2000, height: 3000, orientation: 'portrait' as const },
  { width: 2500, height: 2500, orientation: 'square' as const },
];

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create sample book
    const [book] = await db.insert(books).values({
      sessionToken: 'sample-session-' + Date.now(),
      title: 'Summer Vacation 2024',
      status: 'ready',
      theme: 'warm',
      pageCount: 24,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    console.log(`✅ Created book: ${book.id}`);

    // Create sample photos
    const samplePhotos = [];
    for (let i = 0; i < 50; i++) {
      const photoType = SAMPLE_PHOTOS[i % 3];
      
      const [photo] = await db.insert(photos).values({
        bookId: book.id,
        originalUrl: `/sample/photo-${i + 1}.jpg`,
        processedUrl: `/sample/photo-${i + 1}.jpg`,
        thumbnailUrl: `/sample/thumb-${i + 1}.jpg`,
        filename: `photo-${i + 1}.jpg`,
        fileSize: Math.floor(Math.random() * 5000000) + 1000000,
        mimeType: 'image/jpeg',
        width: photoType.width,
        height: photoType.height,
        aspectRatio: (photoType.width / photoType.height).toFixed(4),
        orientation: photoType.orientation,
        qualityScore: Math.floor(Math.random() * 30) + 70, // 70-100
        sharpnessScore: (Math.random() * 50 + 50).toFixed(2),
        dominantColor: '#' + Math.floor(Math.random()*16777215).toString(16),
        colorPalette: [],
        dateTaken: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      }).returning();

      samplePhotos.push(photo);
    }

    console.log(`✅ Created ${samplePhotos.length} photos`);

    // Create sample pages
    for (let i = 0; i < 24; i++) {
      const template = i === 0 ? 'hero' : ['duo_horizontal', 'trio_asymmetric', 'quad_grid'][i % 3];
      const photoCount = template === 'hero' ? 1 : template === 'duo_horizontal' ? 2 : template === 'trio_asymmetric' ? 3 : 4;
      const startIdx = i * 2;
      const pagePhotoIds = samplePhotos.slice(startIdx, startIdx + photoCount).map(p => p.id);

      await db.insert(pages).values({
        bookId: book.id,
        pageNumber: i + 1,
        template,
        photoIds: pagePhotoIds,
        layoutData: { layouts: [] },
        textContent: i === 0 ? 'Summer Vacation 2024' : undefined,
        createdAt: new Date(),
      });
    }

    console.log(`✅ Created 24 pages`);

    // Create sample order
    const [order] = await db.insert(orders).values({
      bookId: book.id,
      email: 'demo@frametale.com',
      shippingName: 'Demo User',
      shippingAddressLine1: '123 Main St',
      shippingCity: 'San Francisco',
      shippingState: 'CA',
      shippingZip: '94102',
      shippingCountry: 'US',
      subtotal: 4999,
      shippingCost: 999,
      tax: 399,
      total: 6397,
      status: 'paid',
      paidAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    console.log(`✅ Created order: ${order.id}`);

    console.log('');
    console.log('🎉 Seeding complete!');
    console.log(`📚 Book ID: ${book.id}`);
    console.log(`📧 Test Email: demo@frametale.com`);
    console.log('');
    console.log('You can now:');
    console.log(`- View book: http://localhost:3000/book/${book.id}`);
    console.log(`- Dashboard: http://localhost:3000/dashboard`);
    console.log(`- Admin: http://localhost:3000/admin`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
