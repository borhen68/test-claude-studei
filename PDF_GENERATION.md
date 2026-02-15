# PDF Generation System

Complete print-ready PDF generation for CloudPrinter fulfillment.

## Overview

This system generates high-quality, print-ready PDFs that meet CloudPrinter's specifications:

- **300 DPI resolution** for sharp prints
- **CMYK color profile** (converted from RGB)
- **3mm bleed margins** on all sides
- **Separate cover + interior PDFs**
- **Proper page sizing** for each book format
- **MD5 checksums** for file verification

## Architecture

```
┌─────────────────┐
│  Book Data      │
│  (DB)           │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  PDF Generator Service          │
│  src/lib/pdf/print-generator.ts │
└────┬────────────────────┬───────┘
     │                    │
     ▼                    ▼
┌──────────┐        ┌──────────────┐
│  Cover   │        │  Interior    │
│  PDF     │        │  Pages PDF   │
└────┬─────┘        └──────┬───────┘
     │                     │
     └──────────┬──────────┘
                ▼
         ┌──────────────┐
         │  Image       │
         │  Processor   │
         │  (RGB→CMYK)  │
         └──────┬───────┘
                ▼
         ┌──────────────┐
         │  Upload to   │
         │  R2/S3       │
         └──────┬───────┘
                ▼
         ┌──────────────┐
         │  CloudPrinter│
         │  API         │
         └──────────────┘
```

## Book Size Specifications

### 8x8" Square Book (20x20cm)

- **Trim Size:** 8" × 8" (20.32cm × 20.32cm)
- **With Bleed:** 8.24" × 8.24" (20.93cm × 20.93cm)
- **Pixel Dimensions:** 2400×2400px at 300 DPI
- **Use Case:** Small, personal photo books

### 10x10" Square Book (25x25cm)

- **Trim Size:** 10" × 10" (25.4cm × 25.4cm)
- **With Bleed:** 10.24" × 10.24" (26cm × 26cm)
- **Pixel Dimensions:** 3000×3000px at 300 DPI
- **Use Case:** Standard coffee table books

### 12x12" Square Book (30x30cm)

- **Trim Size:** 12" × 12" (30.48cm × 30.48cm)
- **With Bleed:** 12.24" × 12.24" (31.09cm × 31.09cm)
- **Pixel Dimensions:** 3600×3600px at 300 DPI
- **Use Case:** Premium, large format books

## File Structure

```
src/lib/pdf/
├── config.ts              # Book sizes, DPI, quality settings
├── image-processor.ts     # RGB→CMYK conversion, 300 DPI
├── cover.ts               # Cover PDF generation
├── pages.ts               # Interior pages PDF generation
└── print-generator.ts     # Main orchestration service

src/lib/cloudprinter/
├── files.ts               # MD5 generation, upload
├── service.ts             # CloudPrinter order creation
└── types.ts               # TypeScript interfaces

src/app/api/pdf/
├── generate/route.ts      # POST /api/pdf/generate
├── status/[id]/route.ts   # GET /api/pdf/status/:id
└── download/[type]/[bookId]/route.ts  # Download PDFs
```

## Usage

### Generate PDFs Programmatically

```typescript
import { generateBookPDF } from '@/lib/pdf/print-generator';

const result = await generateBookPDF('book-uuid');

if (result.success) {
  console.log('Cover URL:', result.coverUrl);
  console.log('Interior URL:', result.interiorUrl);
  console.log('Cover MD5:', result.coverMd5);
  console.log('Interior MD5:', result.interiorMd5);
} else {
  console.error('Error:', result.error);
}
```

### Via API

```bash
# Generate PDFs
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{"bookId":"book-uuid"}'

# Check status
curl http://localhost:3000/api/pdf/status/book-uuid

# Download cover
curl http://localhost:3000/api/pdf/download/cover/book-uuid

# Download interior
curl http://localhost:3000/api/pdf/download/interior/book-uuid
```

### In CloudPrinter Order Flow

```typescript
import { createCloudPrinterOrder } from '@/lib/cloudprinter/service';

const order = await createCloudPrinterOrder({
  bookId: 'book-uuid',
  orderId: 'order-uuid',
  email: 'customer@example.com',
  shippingAddress: { ... },
  product: {
    sku: 'photobook-8x8',
    pageCount: 24,
  },
});

// PDFs are auto-generated during order creation
```

## Color Conversion (RGB → CMYK)

### Current Implementation

The system uses **Sharp** for image processing, which converts images to **sRGB** color space. This is printer-friendly and works well for most cases.

### True CMYK Conversion (Optional Enhancement)

For production-grade CMYK conversion, install **ImageMagick**:

```bash
# Ubuntu/Debian
apt-get install imagemagick

# macOS
brew install imagemagick
```

The system will automatically detect ImageMagick and use it for true CMYK conversion when available.

**Manual CMYK conversion:**

```typescript
import { processImageWithCMYK } from '@/lib/pdf/image-processor';

const result = await processImageWithCMYK(imageUrl, {
  targetWidthInches: 8,
  targetHeightInches: 8,
});

// result.buffer is now in CMYK
```

## Quality Requirements

### Resolution

- **Minimum:** 150 DPI (system warns user)
- **Recommended:** 300 DPI (optimal print quality)
- **Formula:** pixels = inches × DPI

Example: 8" page at 300 DPI = 2400 pixels

### Image Quality Warnings

The system automatically checks each image and warns if:

- Resolution is below 150 DPI (error)
- Resolution is 150-299 DPI (warning)
- Image is upscaled (warning)

### PDF Quality Settings

```typescript
const QUALITY_SETTINGS = {
  jpegQuality: 95,              // High quality for print
  chromaSubsampling: '4:4:4',   // No chroma subsampling
  compression: 'none',          // No PDF compression
};
```

## Bleed and Margins

### Bleed

- **Size:** 3mm (0.118 inches) on all sides
- **Purpose:** Prevents white edges when trimming
- **Implementation:** Images extend beyond trim line

### Safe Zones

```typescript
const SAFE_ZONES = {
  textMargin: 0.5,        // 0.5" from trim edge
  imageBleed: 0.118,      // 3mm bleed
  bindingGutter: 0.25,    // Extra space near spine
};
```

**Never place important content (text, faces) within 0.5" of the trim edge.**

## Cover Structure

### Full Cover Layout

```
┌─────────────────────────────────────────┐
│ Back Cover │  Spine  │   Front Cover    │
│   8.24"    │ variable│     8.24"        │
└─────────────────────────────────────────┘
```

### Spine Width Calculation

```typescript
function calculateSpineWidth(pageCount: number): number {
  const PAPER_THICKNESS = 0.012; // inches per sheet
  const sheets = Math.ceil(pageCount / 2);
  return sheets * PAPER_THICKNESS;
}
```

Example: 24 pages = 12 sheets × 0.012" = 0.144" spine

## Testing

### Generate Test PDF

```typescript
import { generateSinglePhotoPage } from '@/lib/pdf/pages';

const testPDF = await generateSinglePhotoPage(
  '8x8',
  'path/to/test-image.jpg',
  'Test Caption'
);

// Save to file
await writeFile('test-output.pdf', testPDF);
```

### Verify PDF Dimensions

Use `pdfinfo` (part of poppler-utils):

```bash
pdfinfo test-output.pdf

# Output:
# Page size: 594.96 x 594.96 pts (8.24" x 8.24")
```

### Check CMYK Color Space

```bash
identify -verbose output.pdf | grep Colorspace

# Expected: Colorspace: CMYK (with ImageMagick)
# Fallback: Colorspace: sRGB
```

### Verify Bleed

Open PDF in Adobe Acrobat or similar and check:

1. Trim box: 8" × 8"
2. Bleed box: 8.24" × 8.24"
3. Images extend to bleed edge

### MD5 Verification

```typescript
import { generateMD5 } from '@/lib/cloudprinter/files';

const buffer = await readFile('output.pdf');
const md5 = generateMD5(buffer);

console.log('MD5:', md5); // e.g., 'd41d8cd98f00b204e9800998ecf8427e'
```

## CloudPrinter Integration

### File Requirements

CloudPrinter requires:

1. **Public URLs** - PDFs must be accessible via HTTPS
2. **MD5 checksums** - For file verification
3. **Separate files** - Cover and interior as separate PDFs
4. **Correct file types** - `type: 'cover'` and `type: 'book'`

### Order Payload

```json
{
  "reference": "order-123",
  "items": [{
    "files": [
      {
        "type": "cover",
        "url": "https://cdn.frametale.com/books/cover.pdf",
        "md5sum": "abc123..."
      },
      {
        "type": "book",
        "url": "https://cdn.frametale.com/books/interior.pdf",
        "md5sum": "def456..."
      }
    ]
  }]
}
```

## Troubleshooting

### "Image resolution too low"

**Cause:** Source image is smaller than target dimensions at 150 DPI.

**Solution:**

- Use higher resolution source images
- Reduce book size (12×12 → 10×10 → 8×8)
- Accept warning and proceed (image will be upscaled)

### "CMYK conversion not available"

**Cause:** ImageMagick not installed.

**Solution:**

- Install ImageMagick (see CMYK section above)
- Or accept sRGB fallback (still print-ready)

### PDF too large

**Cause:** High-resolution images with no compression.

**Solution:**

- Reduce JPEG quality (default: 95)
- Enable light compression (not recommended for print)

### Spine too narrow/wide

**Cause:** Incorrect page count or paper thickness.

**Solution:**

- Verify `pageCount` is accurate
- Adjust `PAPER_THICKNESS` constant if using different paper

### Upload fails

**Cause:** R2/S3 credentials not configured.

**Solution:**

- Set environment variables:
  - `R2_ENDPOINT`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET_NAME`
- Or use local storage fallback (automatic)

## Performance

### Generation Times

- **8x8 book (24 pages):** ~15-30 seconds
- **10x10 book (24 pages):** ~20-40 seconds
- **12x12 book (24 pages):** ~30-60 seconds

Times vary based on:

- Number of pages
- Source image sizes
- Server CPU/memory
- CMYK conversion (if enabled)

### Optimization

```typescript
// Process images in parallel
const images = await Promise.all(
  photos.map(photo => processImageForPrint(photo.url, options))
);
```

## Future Enhancements

- [ ] PDF/X-1a:2001 compliance (industry standard)
- [ ] Native CMYK support without ImageMagick
- [ ] Trim/bleed box metadata
- [ ] Progress callbacks for large books
- [ ] Background job queue for async generation
- [ ] PDF preview thumbnails
- [ ] Batch generation for multiple books

## Support

For issues or questions:

1. Check logs: `console.log` statements throughout
2. Verify image resolution: `validateImageResolution()`
3. Test with single page: `generateSinglePhotoPage()`
4. Check CloudPrinter API status

## License

Proprietary - Frametale, Inc.
