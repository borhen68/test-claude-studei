# PDF Generation System

Print-ready PDF generation for CloudPrinter fulfillment.

## Quick Start

```typescript
import { generateBookPDF } from '@/lib/pdf';

// Generate PDFs for a book
const result = await generateBookPDF('book-uuid');

if (result.success) {
  console.log('Cover:', result.coverUrl);
  console.log('Interior:', result.interiorUrl);
}
```

## Files

- **config.ts** - Book sizes, DPI settings, quality parameters
- **image-processor.ts** - Image processing, RGB→CMYK conversion, 300 DPI
- **cover.ts** - Cover PDF generation (front + spine + back)
- **pages.ts** - Interior pages with layout templates
- **print-generator.ts** - Main orchestration service
- **index.ts** - Public API exports

## Features

✅ **300 DPI Resolution** - Sharp, professional prints  
✅ **CMYK Color Profile** - Print-ready color conversion  
✅ **3mm Bleed Margins** - Proper trim allowance  
✅ **Multiple Book Sizes** - 8×8", 10×10", 12×12"  
✅ **Layout Templates** - Hero, duo, trio, quad, gallery  
✅ **Quality Validation** - Image resolution checks  
✅ **MD5 Checksums** - File verification  

## Book Sizes

| Size   | Trim      | Bleed        | Pixels       |
|--------|-----------|--------------|--------------|
| 8×8"   | 8" × 8"   | 8.24" × 8.24"| 2400×2400px  |
| 10×10" | 10" × 10" | 10.24" × 10.24" | 3000×3000px |
| 12×12" | 12" × 12" | 12.24" × 12.24" | 3600×3600px |

## Usage Examples

### Generate Cover Only

```typescript
import { generateCoverPDF } from '@/lib/pdf';

const coverPDF = await generateCoverPDF({
  bookSize: '8x8',
  pageCount: 24,
  frontCoverImage: 'path/to/cover.jpg',
  title: 'My Photo Book',
});
```

### Generate Interior Only

```typescript
import { generateInteriorPagesPDF } from '@/lib/pdf';

const interiorPDF = await generateInteriorPagesPDF({
  bookSize: '10x10',
  pages: [
    {
      pageNumber: 1,
      template: 'hero',
      photos: [{ id: '1', url: 'photo.jpg', layout: {...} }],
    },
    // ... more pages
  ],
});
```

### Process Image for Print

```typescript
import { processImageForPrint } from '@/lib/pdf';

const result = await processImageForPrint('image.jpg', {
  targetWidthInches: 8,
  targetHeightInches: 8,
  fit: 'cover',
});

// result.buffer is now 300 DPI, print-ready
// result.warnings contains any quality issues
```

### Validate Image Quality

```typescript
import { validateImageResolution } from '@/lib/pdf';

const validation = validateImageResolution(
  2400, // image width in pixels
  2400, // image height in pixels
  8,    // target width in inches
  8     // target height in inches
);

if (!validation.valid) {
  console.error(validation.message);
}
```

## Configuration

### Book Sizes

```typescript
import { BOOK_SIZES, getBookSize } from '@/lib/pdf';

// Get size specification
const size = getBookSize('8x8');
console.log(size.trimWidth, size.bleedWidth, size.pixelWidth);

// All available sizes
Object.keys(BOOK_SIZES); // ['8x8', '10x10', '12x12']
```

### Quality Settings

```typescript
import { QUALITY_SETTINGS } from '@/lib/pdf';

console.log(QUALITY_SETTINGS.minDPI);           // 150
console.log(QUALITY_SETTINGS.recommendedDPI);   // 300
console.log(QUALITY_SETTINGS.jpegQuality);      // 95
```

### Safe Zones

```typescript
import { SAFE_ZONES } from '@/lib/pdf';

console.log(SAFE_ZONES.textMargin);     // 0.5 inches
console.log(SAFE_ZONES.imageBleed);     // 0.118 inches (3mm)
console.log(SAFE_ZONES.bindingGutter);  // 0.25 inches
```

## Layout Templates

Available templates in `LAYOUT_TEMPLATES`:

- **hero** - Single large photo (1 photo)
- **duo_horizontal** - Two side-by-side (2 photos)
- **duo_vertical** - Two stacked (2 photos)
- **trio_asymmetric** - One large + two small (3 photos)
- **quad_grid** - 2×2 grid (4 photos)
- **gallery_6** - 3×2 grid (6 photos)

## Error Handling

The system provides detailed warnings and errors:

```typescript
const result = await generateBookPDF('book-id');

if (!result.success) {
  console.error('Error:', result.error);
}

if (result.warnings) {
  result.warnings.forEach(warning => {
    console.warn('Warning:', warning);
  });
}
```

Common warnings:
- "Image resolution too low: XXX DPI (minimum: 150 DPI)"
- "Image resolution acceptable but not optimal: XXX DPI"
- "CMYK conversion not available, using sRGB"
- "ImageMagick not available for CMYK conversion"

## CMYK Conversion

### With ImageMagick (Recommended)

Install ImageMagick for true CMYK conversion:

```bash
# Ubuntu/Debian
sudo apt-get install imagemagick

# macOS
brew install imagemagick
```

The system auto-detects and uses it.

### Fallback (sRGB)

Without ImageMagick, images use sRGB color space (still print-ready).

### Manual CMYK Conversion

```typescript
import { processImageWithCMYK, checkCMYKSupport } from '@/lib/pdf';

// Check if CMYK is available
const hasCMYK = await checkCMYKSupport();

// Process with CMYK if available
const result = await processImageWithCMYK('image.jpg', {
  targetWidthInches: 8,
  targetHeightInches: 8,
});
```

## Performance

Generation times (approximate):

- 8×8" book (24 pages): 15-30 seconds
- 10×10" book (24 pages): 20-40 seconds
- 12×12" book (24 pages): 30-60 seconds

Factors affecting speed:
- Number of pages
- Source image sizes
- Server CPU/memory
- CMYK conversion (if enabled)

## Dependencies

- **pdfkit** - PDF generation
- **sharp** - Image processing
- **ImageMagick** (optional) - True CMYK conversion

## Documentation

- **[PDF_GENERATION.md](../../../PDF_GENERATION.md)** - Complete technical guide
- **[PDF_QUICK_START.md](../../../PDF_QUICK_START.md)** - Quick reference
- **[INTEGRATION_CHECKLIST.md](../../../INTEGRATION_CHECKLIST.md)** - Setup guide

## Support

For issues or questions:
1. Check the main documentation
2. Review console logs
3. Verify image quality
4. Test with sample data

## License

Proprietary - Frametale, Inc.
