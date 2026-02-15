# PDF Generation Quick Start

## 🚀 Generate PDFs for a Book

### Option 1: Via API (Recommended)

```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{"bookId":"your-book-uuid"}'
```

Response:
```json
{
  "success": true,
  "cover": {
    "url": "https://cdn.frametale.com/cloudprinter/books/book-uuid_cover.pdf",
    "md5": "abc123..."
  },
  "interior": {
    "url": "https://cdn.frametale.com/cloudprinter/books/book-uuid_interior.pdf",
    "md5": "def456..."
  }
}
```

### Option 2: In Code

```typescript
import { generateBookPDF } from '@/lib/pdf';

const result = await generateBookPDF('book-uuid');

if (result.success) {
  console.log('PDFs ready:', result.coverUrl, result.interiorUrl);
} else {
  console.error('Failed:', result.error);
}
```

### Option 3: During Order Creation

```typescript
import { createCloudPrinterOrder } from '@/lib/cloudprinter/service';

// PDFs are automatically generated
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
```

## 📦 What Gets Generated

1. **Cover PDF** (`cover.pdf`)
   - Front cover + spine + back cover
   - Full bleed (8.24" × 8.24" for 8×8 book)
   - 300 DPI
   - MD5 checksum

2. **Interior PDF** (`interior.pdf`)
   - All interior pages
   - Applied layouts (hero, duo, trio, quad, gallery)
   - Captions and text
   - 300 DPI
   - MD5 checksum

## 🎨 Supported Book Sizes

- `8x8` - 8" × 8" (2400×2400px)
- `10x10` - 10" × 10" (3000×3000px)
- `12x12` - 12" × 12" (3600×3600px)

## ✅ Quality Checks

The system automatically:

- ✓ Validates image resolution (warns if <300 DPI)
- ✓ Converts to print-friendly color space
- ✓ Adds 3mm bleed margins
- ✓ Generates MD5 checksums
- ✓ Uploads to R2/S3 (or local storage fallback)

## 🐛 Common Issues

### "Image resolution too low"

**Problem:** Source images are smaller than recommended.

**Solutions:**
- Use higher resolution images (recommended: 300 DPI)
- Reduce book size (12×12 → 10×10 → 8×8)
- Accept warning and proceed (not recommended for paid orders)

### "R2 upload failed"

**Problem:** R2/S3 credentials not configured.

**Solution:**
Set environment variables:
```bash
R2_ENDPOINT=https://...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=frametale
R2_PUBLIC_URL=https://cdn.frametale.com
```

Or use local storage (automatic fallback).

### "CMYK conversion not available"

**Problem:** ImageMagick not installed.

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install imagemagick

# macOS
brew install imagemagick
```

Or use sRGB fallback (still print-ready).

## 🧪 Testing

### Generate Test PDFs

```bash
cd /root/.openclaw/workspace/frametale
npx tsx scripts/test-pdf-generation.ts
```

This creates:
- `test-cover.pdf` - Sample cover
- `test-page.pdf` - Sample interior page

### Verify PDF Dimensions

```bash
pdfinfo test-cover.pdf | grep "Page size"
# Expected: 594.96 x 594.96 pts (8.24" x 8.24")
```

### Check MD5

```bash
md5sum test-cover.pdf
```

## 📚 Full Documentation

See `PDF_GENERATION.md` for:
- Architecture details
- CMYK conversion process
- CloudPrinter integration
- Troubleshooting guide
- Performance optimization

## 🔧 Advanced Usage

### Custom Cover

```typescript
import { generateCoverPDF } from '@/lib/pdf';

const coverPDF = await generateCoverPDF({
  bookSize: '10x10',
  pageCount: 48,
  frontCoverImage: 'path/to/front.jpg',
  backCoverImage: 'path/to/back.jpg',
  title: 'Summer Memories',
  subtitle: '2024',
  spineText: 'Summer Memories - 2024',
});
```

### Process Image with CMYK

```typescript
import { processImageWithCMYK } from '@/lib/pdf';

const result = await processImageWithCMYK('image.jpg', {
  targetWidthInches: 8,
  targetHeightInches: 8,
  fit: 'cover',
});

// result.buffer is now print-ready CMYK
```

## 📞 Support

Questions? Check:

1. `PDF_GENERATION.md` - Full documentation
2. Console logs - Detailed generation progress
3. API response - Warnings and errors

---

**Ready to print! 🎉**
