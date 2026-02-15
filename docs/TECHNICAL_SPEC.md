# Frametale - Technical Specification

**Version:** 2.0  
**Last Updated:** February 15, 2026  
**Status:** Architecture Design

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────┐
│   Client    │  Next.js 15 (App Router)
│  (Browser)  │  React 19, TypeScript, Tailwind
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────┐
│   Next.js   │  API Routes + Server Actions
│   Server    │  Edge Runtime where possible
└──────┬──────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼
  ┌────────┐    ┌─────────┐    ┌────────┐    ┌─────────┐
  │Supabase│    │ Stripe  │    │Printful│    │  R2/S3  │
  │Postgres│    │   API   │    │   API  │    │ Storage │
  └────────┘    └─────────┘    └────────┘    └─────────┘
```

### Why This Stack

**Frontend: Next.js 15 + React 19**
- ✅ Server Components → faster initial loads
- ✅ Server Actions → no explicit API layer needed
- ✅ App Router → better routing, layouts
- ✅ Built-in image optimization
- ✅ Easy Vercel deployment

**Database: Supabase (Postgres)**
- ✅ Generous free tier
- ✅ Real-time subscriptions (if needed later)
- ✅ Built-in auth (when we add accounts)
- ✅ Row-level security
- ✅ S3-compatible storage included

**Payments: Stripe**
- ✅ Industry standard
- ✅ Great UX (Checkout, Payment Links)
- ✅ Webhooks for order tracking
- ✅ Dispute handling built-in

**Printing: Printful**
- ✅ No minimum order quantity
- ✅ Quality photo books
- ✅ API for automation
- ✅ Handles shipping, tracking
- ✅ Fallback: Gelato (similar API)

**Image Storage: Cloudflare R2 or AWS S3**
- ✅ Cheaper egress than S3 (R2)
- ✅ CDN-backed
- ✅ Pre-signed URLs for uploads
- ✅ Automatic cleanup of old files

---

## Technology Stack

### Core

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| **Runtime** | Node.js | 20 LTS | Stable, long-term support |
| **Framework** | Next.js | 15.x | Latest features, app router |
| **Language** | TypeScript | 5.x | Type safety, better DX |
| **UI Library** | React | 19.x | Server Components |
| **Styling** | Tailwind CSS | 4.x | Utility-first, fast |
| **Components** | shadcn/ui | Latest | Accessible, customizable |
| **Database** | PostgreSQL (Supabase) | 15+ | Relational, proven |
| **ORM** | Drizzle ORM | Latest | Type-safe, fast, lightweight |

### Image Processing

| Tool | Purpose | Why |
|------|---------|-----|
| **sharp** | Server-side image manipulation | Fastest Node.js image library |
| **exifr** | EXIF metadata extraction | Lightweight, modern |
| **node-vibrant** | Color palette extraction | Fast, no AI needed |
| **@cloudflare/stream** | Face detection (optional) | Free tier, no external API |

**NOT using:**
- ❌ OpenAI Vision API ($$$)
- ❌ Anthropic Claude Vision ($$$)
- ❌ Google Cloud Vision ($$)
- ❌ AWS Rekognition ($$)

### PDF Generation

| Tool | Purpose | Why |
|------|---------|-----|
| **react-pdf/renderer** | PDF generation from React | Declarative, type-safe |
| **pdfkit** | Fallback/custom PDF logic | Lower-level control |

**NOT using:**
- ❌ Puppeteer (too slow, heavy)
- ❌ wkhtmltopdf (deprecated)
- ❌ Canvas API → PDF (no bleed support)

### Deployment

| Service | Purpose | Why |
|---------|---------|-----|
| **Vercel** | Hosting (Next.js) | Zero-config Next.js deployment |
| **Cloudflare R2** | Image storage | Cheaper than S3, fast CDN |
| **Supabase Cloud** | Database + storage | Free tier, managed |
| **Stripe** | Payments | Standard choice |
| **Printful** | Print fulfillment | No MOQ, good API |

---

## System Components

### 1. Upload System

**Flow:**
```
User selects files
    ↓
Client: Validate (type, size, count)
    ↓
Client: Generate pre-signed upload URLs (Server Action)
    ↓
Client: Direct upload to R2/S3 (parallel, with progress)
    ↓
Server: Process uploaded files
    ↓
Server: Extract metadata, analyze, store in DB
    ↓
Client: Show processing progress (polling or WebSocket)
```

**Tech Details:**
- Max 200 photos per session
- Max 20MB per photo
- Supported formats: JPEG, PNG, HEIC
- Client-side preview generation (for instant feedback)
- Server-side processing queue (background jobs)

**Storage Strategy:**
- Original photos: R2 bucket `/uploads/{sessionId}/{photoId}.jpg`
- Processed (optimized): `/processed/{sessionId}/{photoId}-{size}.jpg`
- Finals (in PDF): Embedded, not stored separately
- Cleanup: Delete uploads after 7 days if not purchased

### 2. Photo Analysis Engine

**Pipeline:**
```javascript
async function analyzePhoto(photoBuffer: Buffer) {
  // 1. Extract EXIF metadata
  const exif = await exifr.parse(photoBuffer);
  const dateTaken = exif.DateTimeOriginal || null;
  const orientation = exif.Orientation || 1;
  
  // 2. Detect faces (optional, using sharp or Cloudflare Workers AI)
  const faces = await detectFaces(photoBuffer); // returns [{x, y, width, height}]
  const hasFaces = faces.length > 0;
  
  // 3. Calculate quality score
  const metadata = await sharp(photoBuffer).metadata();
  const qualityScore = calculateQualityScore({
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    hasExif: !!exif,
    sharpness: await estimateSharpness(photoBuffer), // Laplacian variance
  });
  
  // 4. Extract dominant colors
  const palette = await Vibrant.from(photoBuffer).getPalette();
  const dominantColor = palette.Vibrant?.hex || '#000000';
  
  // 5. Calculate aspect ratio category
  const aspectRatio = metadata.width / metadata.height;
  const orientation = aspectRatio > 1.2 ? 'landscape' 
                     : aspectRatio < 0.8 ? 'portrait' 
                     : 'square';
  
  return {
    id: generatePhotoId(),
    width: metadata.width,
    height: metadata.height,
    aspectRatio,
    orientation,
    qualityScore, // 0-100
    hasFaces,
    faceCount: faces.length,
    dominantColor,
    dateTaken,
    exifOrientation: orientation,
  };
}
```

**Quality Scoring Algorithm:**
```javascript
function calculateQualityScore(params) {
  let score = 50; // baseline
  
  // Resolution
  const megapixels = (params.width * params.height) / 1_000_000;
  if (megapixels >= 12) score += 20;
  else if (megapixels >= 8) score += 15;
  else if (megapixels >= 5) score += 10;
  else if (megapixels >= 2) score += 5;
  else score -= 10; // too low-res
  
  // Sharpness
  if (params.sharpness > 100) score += 15;
  else if (params.sharpness > 50) score += 10;
  else score -= 10; // blurry
  
  // Has EXIF (usually higher quality)
  if (params.hasExif) score += 10;
  
  // Format bonus
  if (params.format === 'jpeg') score += 5;
  
  return Math.max(0, Math.min(100, score));
}
```

### 3. Smart Sorting Algorithm

**Sorting Strategy:**
```javascript
function sortPhotos(photos: AnalyzedPhoto[]): AnalyzedPhoto[] {
  return photos.sort((a, b) => {
    // 1. Chronological first (if dates available)
    if (a.dateTaken && b.dateTaken) {
      const timeDiff = a.dateTaken.getTime() - b.dateTaken.getTime();
      if (Math.abs(timeDiff) > 86400000) return timeDiff; // >1 day apart
    }
    
    // 2. Quality-weighted if same day or no dates
    const scoreA = a.qualityScore + (a.hasFaces ? 15 : 0);
    const scoreB = b.qualityScore + (b.hasFaces ? 15 : 0);
    return scoreB - scoreA;
  });
}
```

**Grouping Logic:**
```javascript
function groupPhotosIntoPages(photos: AnalyzedPhoto[], targetPages: number) {
  const photosPerPage = Math.ceil(photos.length / targetPages);
  const pages = [];
  
  for (let i = 0; i < photos.length; i += photosPerPage) {
    const pagePhotos = photos.slice(i, i + photosPerPage);
    const template = selectTemplate(pagePhotos);
    pages.push({ template, photos: pagePhotos });
  }
  
  return pages;
}
```

### 4. Layout Engine

**Template Selection Logic:**
```javascript
const TEMPLATES = {
  HERO: { photoCount: 1, aspectRatios: ['any'] },
  DUO_HORIZONTAL: { photoCount: 2, aspectRatios: ['landscape', 'square'] },
  DUO_VERTICAL: { photoCount: 2, aspectRatios: ['portrait'] },
  TRIO_ASYMMETRIC: { photoCount: 3, aspectRatios: ['mixed'] },
  QUAD_GRID: { photoCount: 4, aspectRatios: ['square', 'mixed'] },
  GALLERY_6: { photoCount: 6, aspectRatios: ['any'] },
  QUOTE: { photoCount: 1, aspectRatios: ['any'], hasText: true },
};

function selectTemplate(photos: AnalyzedPhoto[]) {
  const count = photos.length;
  
  // Prioritize face photos for hero layouts
  if (count === 1 && photos[0].hasFaces) {
    return TEMPLATES.HERO;
  }
  
  // Match photo count and orientations
  if (count === 2) {
    const bothLandscape = photos.every(p => p.orientation === 'landscape');
    return bothLandscape ? TEMPLATES.DUO_HORIZONTAL : TEMPLATES.DUO_VERTICAL;
  }
  
  if (count === 3) return TEMPLATES.TRIO_ASYMMETRIC;
  if (count === 4) return TEMPLATES.QUAD_GRID;
  if (count >= 6) return TEMPLATES.GALLERY_6;
  
  // Fallback
  return TEMPLATES.HERO;
}
```

**Smart Cropping:**
```javascript
async function cropPhoto(photo, targetAspectRatio, faceRegions) {
  const image = sharp(photo.buffer);
  const { width, height } = await image.metadata();
  
  // If faces detected, use face-aware cropping
  if (faceRegions.length > 0) {
    const faceBounds = calculateBoundingBox(faceRegions);
    const cropRegion = expandRegionToAspectRatio(faceBounds, targetAspectRatio, width, height);
    return image.extract(cropRegion);
  }
  
  // Otherwise, use entropy-based cropping (focus on interesting areas)
  return image.extract(await smartCrop(image, targetAspectRatio));
}
```

### 5. PDF Generation

**Structure:**
```
Book PDF (8x8" + 0.125" bleed = 8.25" x 8.25")
├── Cover (front, spine, back)
├── Inside front cover (blank or dedication)
├── Pages (20-60, always even number)
└── Inside back cover (blank or logo)
```

**react-pdf Implementation:**
```jsx
import { Document, Page, Image, View, Text } from '@react-pdf/renderer';

const BookPDF = ({ pages, coverImage, theme }) => (
  <Document>
    {/* Cover */}
    <Page size={{ width: 8.25 * 72, height: 8.25 * 72 }}>
      <Image src={coverImage} style={{ width: '100%', height: '100%' }} />
    </Page>
    
    {/* Content Pages */}
    {pages.map((page, index) => (
      <Page key={index} size={{ width: 8.25 * 72, height: 8.25 * 72 }}>
        <LayoutTemplate 
          template={page.template} 
          photos={page.photos} 
          theme={theme} 
        />
      </Page>
    ))}
  </Document>
);
```

**Print Requirements (Printful):**
- Resolution: 300 DPI
- Color space: CMYK (convert from RGB)
- Bleed: 0.125" on all sides
- Safe zone: 0.25" from trim edge
- File format: PDF/X-1a or PDF/X-4
- Max file size: 500MB

### 6. Order Workflow

**State Machine:**
```
CREATED → PAYMENT_PENDING → PAID → PROCESSING → SENT_TO_PRINTER 
   → PRINTING → SHIPPED → DELIVERED
   
Failed states:
   → PAYMENT_FAILED (retry allowed)
   → PROCESSING_ERROR (manual review)
   → PRINT_REJECTED (refund)
```

**Stripe Integration:**
```javascript
// Server Action
async function createCheckoutSession(bookId: string) {
  const book = await db.book.findUnique({ where: { id: bookId } });
  
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Frametale Photo Book (8x8")' },
        unit_amount: 3900, // $39.00
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${env.APP_URL}/order/${bookId}/success`,
    cancel_url: `${env.APP_URL}/book/${bookId}`,
    metadata: { bookId },
  });
  
  return session.url;
}

// Webhook handler
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const event = stripe.webhooks.constructEvent(await req.text(), sig, env.STRIPE_WEBHOOK_SECRET);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await handlePaymentSuccess(session.metadata.bookId, session);
  }
  
  return new Response(null, { status: 200 });
}
```

**Printful Integration:**
```javascript
async function sendToPrintful(orderId: string) {
  const order = await db.order.findUnique({ 
    where: { id: orderId },
    include: { book: true },
  });
  
  // Generate final PDF
  const pdfBuffer = await generateBookPDF(order.book);
  
  // Upload to Printful
  const fileUpload = await printful.post('/files', {
    type: 'default',
    url: await uploadToR2(pdfBuffer, `pdfs/${orderId}.pdf`),
  });
  
  // Create Printful order
  const printfulOrder = await printful.post('/orders', {
    recipient: {
      name: order.shippingName,
      address1: order.shippingAddress,
      city: order.shippingCity,
      state_code: order.shippingState,
      country_code: 'US',
      zip: order.shippingZip,
    },
    items: [{
      sync_variant_id: env.PRINTFUL_BOOK_VARIANT_ID,
      quantity: 1,
      files: [{ id: fileUpload.id }],
    }],
  });
  
  // Update order with tracking
  await db.order.update({
    where: { id: orderId },
    data: {
      printfulOrderId: printfulOrder.id,
      status: 'SENT_TO_PRINTER',
    },
  });
}
```

---

## Database Schema

See DATA_MODEL.md for full schema.

**Core Tables:**
- `books` - User sessions, uploaded photos, settings
- `photos` - Individual photo metadata, analysis results
- `pages` - Generated layout pages
- `orders` - Payment, shipping, fulfillment
- `analytics` - Events for funnel tracking

---

## API Endpoints

See API_SPEC.md for full endpoint documentation.

**Key endpoints:**
- `POST /api/books` - Create new book session
- `POST /api/upload/presigned-url` - Get S3 upload URL
- `POST /api/photos/analyze` - Trigger photo analysis
- `GET /api/books/:id/preview` - Get book preview data
- `POST /api/checkout` - Create Stripe session
- `POST /api/webhooks/stripe` - Handle payment events
- `POST /api/webhooks/printful` - Handle fulfillment events

---

## Security

**Authentication (Post-MVP):**
- Supabase Auth (email/password + OAuth)
- JWT tokens in httpOnly cookies
- Row-level security in Postgres

**Data Protection:**
- All uploads encrypted at rest (R2/S3 encryption)
- HTTPS everywhere (Vercel auto-SSL)
- Photo URLs: pre-signed, time-limited (1 hour)
- No public photo access after 7 days

**Payment Security:**
- Stripe handles all card data (PCI compliant)
- No card data ever touches our servers
- Webhook signature verification

**Rate Limiting:**
- Uploads: 200 photos per session, 5 sessions per IP per day
- API: 100 requests per minute per IP
- Checkout: 10 attempts per hour per IP

---

## Performance Optimization

**Image Optimization:**
- Next.js Image component (automatic WebP, lazy load)
- Sharp for server-side resizing
- Cloudflare CDN for R2 assets

**Caching:**
- Static pages: CDN edge cache (Vercel)
- Preview generation: Cache for 1 hour
- Database queries: React cache, Vercel KV for hot data

**Background Jobs:**
- Photo analysis: Queue via Vercel Queue or Inngest
- PDF generation: Offload to background job
- Email sending: Queue with Resend API

**Database:**
- Indexed columns: bookId, orderId, userId (post-MVP)
- Connection pooling (Supabase Supavisor)
- Read replicas for analytics (if needed)

---

## Monitoring & Observability

**Tools:**
- **Vercel Analytics** - Web Vitals, user behavior
- **Sentry** - Error tracking, performance monitoring
- **PostHog** - Product analytics, funnels
- **Stripe Dashboard** - Payment metrics
- **Printful Dashboard** - Fulfillment tracking

**Key Metrics to Track:**
- Upload success rate
- Photo analysis completion time
- Preview generation time
- Checkout funnel drop-off points
- Order fulfillment status
- Customer support tickets

**Alerts:**
- Payment webhook failures
- PDF generation errors (>1% failure rate)
- Upload errors (>5% failure rate)
- Printful API errors
- Server errors (>0.1% error rate)

---

## Development Workflow

**Local Setup:**
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in: Supabase, Stripe, Printful, R2 credentials

# Run database migrations
npm run db:push

# Start dev server
npm run dev
```

**Testing:**
- Unit tests: Vitest
- E2E tests: Playwright
- Visual regression: Percy (optional)

**CI/CD:**
- GitHub Actions → Vercel preview deployments
- Main branch → Auto-deploy to production
- PRs → Preview URLs for testing

**Code Quality:**
- ESLint + Prettier (enforced)
- TypeScript strict mode
- Pre-commit hooks (Husky + lint-staged)

---

## Deployment Checklist

**Pre-Launch:**
- [ ] All environment variables set (Vercel)
- [ ] Database migrations applied (Supabase)
- [ ] Stripe webhooks configured
- [ ] Printful API credentials tested
- [ ] R2 buckets created and CORS configured
- [ ] Domain configured (frametale.com)
- [ ] SSL certificate active
- [ ] Error tracking enabled (Sentry)
- [ ] Analytics enabled (PostHog, Vercel)

**Launch Day:**
- [ ] Monitor error rates
- [ ] Check payment flow (test order)
- [ ] Verify Printful integration (test print)
- [ ] Watch upload success rates
- [ ] Monitor performance metrics

---

## Future Technical Debt

**Known Limitations (Accept for MVP):**
- No user accounts (guest checkout only)
- No draft saving (must complete in one session)
- US shipping only
- Single product SKU
- No A/B testing framework
- Basic analytics

**Post-MVP Technical Improvements:**
- Add Redis for session storage (faster than DB)
- Implement WebSocket for real-time upload progress
- Add image CDN (Cloudinary or Imgix) for dynamic resizing
- Set up dedicated job queue (BullMQ or Inngest)
- Implement full-text search for photos (if user accounts)
- Add backup strategy (Supabase backups + S3 archival)

---

**Next Document:** UX_FLOW.md
