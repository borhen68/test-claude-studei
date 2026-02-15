/**
 * Test PDF Generation
 * Verifies the PDF generation system works correctly
 */

import { generateSinglePhotoPage } from '../src/lib/pdf/pages';
import { generateSimpleCoverPDF } from '../src/lib/pdf/cover';
import { getBookSize, validateImageResolution } from '../src/lib/pdf/config';
import { generateMD5 } from '../src/lib/cloudprinter/files';
import { writeFile } from 'fs/promises';

async function testPDFGeneration() {
  console.log('\n🧪 Testing PDF Generation System\n');

  try {
    // Test 1: Book size configuration
    console.log('📏 Test 1: Book Size Configuration');
    const size8x8 = getBookSize('8x8');
    console.log(`✓ 8x8 Book: ${size8x8.name}`);
    console.log(`  - Trim: ${size8x8.trimWidth}" × ${size8x8.trimHeight}"`);
    console.log(`  - Bleed: ${size8x8.bleedWidth}" × ${size8x8.bleedHeight}"`);
    console.log(`  - Pixels: ${size8x8.pixelWidth}×${size8x8.pixelHeight}px at 300 DPI\n`);

    // Test 2: Resolution validation
    console.log('📐 Test 2: Image Resolution Validation');
    const goodRes = validateImageResolution(2400, 2400, 8, 8);
    console.log(`✓ 2400×2400px for 8" page: ${goodRes.actualDPI} DPI - ${goodRes.valid ? 'VALID' : 'INVALID'}`);
    
    const lowRes = validateImageResolution(1200, 1200, 8, 8);
    console.log(`⚠️  1200×1200px for 8" page: ${Math.round(lowRes.actualDPI)} DPI - ${lowRes.message}\n`);

    // Test 3: Generate simple cover
    console.log('📄 Test 3: Generate Simple Cover PDF');
    console.log('Using placeholder image...');
    
    // Create a simple test image URL (you can replace with actual image)
    const testImageUrl = 'https://picsum.photos/2400/2400';
    
    try {
      const coverPDF = await generateSimpleCoverPDF(
        '8x8',
        testImageUrl,
        'Test Photo Book'
      );
      
      console.log(`✓ Cover PDF generated: ${coverPDF.length} bytes`);
      
      // Calculate MD5
      const md5 = generateMD5(coverPDF);
      console.log(`✓ MD5 checksum: ${md5}`);
      
      // Save to file
      await writeFile('test-cover.pdf', coverPDF);
      console.log(`✓ Saved to: test-cover.pdf\n`);
    } catch (error) {
      console.error('✗ Cover generation failed:', error);
      console.log('  (This may fail if network/image is unavailable)\n');
    }

    // Test 4: Generate single page
    console.log('📄 Test 4: Generate Single Interior Page');
    try {
      const pagePDF = await generateSinglePhotoPage(
        '8x8',
        testImageUrl,
        'Beautiful sunset over the ocean'
      );
      
      console.log(`✓ Interior PDF generated: ${pagePDF.length} bytes`);
      
      await writeFile('test-page.pdf', pagePDF);
      console.log(`✓ Saved to: test-page.pdf\n`);
    } catch (error) {
      console.error('✗ Page generation failed:', error);
      console.log('  (This may fail if network/image is unavailable)\n');
    }

    console.log('✅ All tests completed!\n');
    console.log('Next steps:');
    console.log('1. Open test-cover.pdf and test-page.pdf to verify output');
    console.log('2. Check dimensions with: pdfinfo test-cover.pdf');
    console.log('3. Test with real book: npm run generate-pdf -- <bookId>\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testPDFGeneration();
