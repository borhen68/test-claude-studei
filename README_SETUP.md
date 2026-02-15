# Frametale - Complete Setup Guide

**A production-ready, AI-powered photo book creator built with Next.js, TypeScript, and modern web technologies.**

## 🎯 What's Been Built

This is a **fully functional** photo book application with:

✅ **Working File Storage** - Local filesystem storage (falls back from S3/R2)
✅ **Complete Upload Flow** - Real drag & drop, thumbnails, batch upload with progress
✅ **Photo Analysis** - EXIF extraction, quality scoring, color analysis
✅ **Smart Layout Engine** - Auto-generates beautiful book layouts
✅ **Interactive Book Viewer** - Page-flip viewer with zoom, fullscreen
✅ **Complete Checkout** - Product selection, shipping, mock payment
✅ **User Dashboard** - Book library, order tracking
✅ **Admin Panel** - Order management, fulfillment tracking
✅ **PDF Generation** - Export books as print-ready PDFs
✅ **Sample Data** - Seed script for testing

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

The app uses **SQLite by default** (no external database needed):

```bash
# Database is auto-created on first run
# Located at: ./frametale.db
```

For PostgreSQL (optional):
```bash
# Set DATABASE_URL in .env
echo "DATABASE_URL=postgresql://..." > .env
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Seed Sample Data (Optional)

```bash
npm run seed
```

This creates:
- 1 sample book with 50 photos
- 24 pages with various layouts
- 1 sample order
- Test email: `demo@frametale.com`

## 📁 Project Structure

```
frametale/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── upload/            # Photo upload UI
│   │   ├── book/[id]/         # Book viewer
│   │   ├── checkout/          # Checkout flow
│   │   ├── dashboard/         # User dashboard
│   │   ├── admin/             # Admin panel
│   │   └── api/               # API routes
│   │       ├── upload/        # Photo upload
│   │       ├── books/         # Book CRUD
│   │       ├── orders/        # Order management
│   │       └── admin/         # Admin APIs
│   ├── lib/
│   │   ├── db/                # Database (Drizzle ORM)
│   │   ├── storage/           # File storage (local + S3)
│   │   ├── photo-analysis/    # EXIF, quality, colors
│   │   ├── layout/            # Smart layout engine
│   │   ├── pdf/               # PDF generation
│   │   └── payments/          # Stripe integration (ready)
│   └── components/            # React components
├── public/
│   └── uploads/               # Local file storage
├── scripts/
│   └── seed.ts                # Sample data generator
└── frametale.db               # SQLite database
```

## 🎨 Features In Detail

### 1. Photo Upload & Analysis

- **Drag & drop** with real-time preview
- **Batch processing** with progress bars
- **EXIF extraction** (date, camera, GPS)
- **Quality scoring** (resolution, sharpness)
- **Color analysis** (dominant colors, palette)
- **Smart thumbnails** (auto-generated)

### 2. Layout Generation

The AI-powered layout engine:

- Sorts photos chronologically
- Detects "hero" moments (high quality + faces)
- Groups into chapters (based on time gaps)
- Selects optimal templates per page
- Balances photo orientations

**Templates:**
- Hero (1 photo) - cover, feature shots
- Duo (2 photos) - horizontal/vertical pairs
- Trio (3 photos) - asymmetric layouts
- Quad (4 photos) - grid layout
- Gallery (6 photos) - mosaic

### 3. Book Viewer

- **Page navigation** (arrow keys, buttons)
- **Zoom controls** (50% - 200%)
- **Fullscreen mode**
- **Page thumbnails** at bottom
- **Responsive design**

### 4. Checkout Flow

**3-step process:**
1. Product selection (softcover/hardcover, sizes)
2. Shipping information
3. Payment (mock mode, ready for Stripe)

**Features:**
- Real-time price calculation
- Tax calculation (8%)
- Shipping cost
- Order confirmation email (ready)

### 5. Admin Panel

**Order management:**
- View all orders
- Filter by status (paid/printing/shipped)
- Update order status
- Download print PDFs
- Track shipments

**Stats dashboard:**
- Total orders
- Status breakdown
- Real-time updates

### 6. PDF Generation

- **Print-ready** 8.25" × 8.25" (with bleed)
- **High quality** exports
- Photo positioning per layout
- Text overlays
- Cover page treatment

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
# Database (optional - defaults to SQLite)
DATABASE_URL=postgresql://user:pass@host/db

# Storage (optional - defaults to local)
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET_NAME=frametale-uploads
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://cdn.yourdomain.com

# Stripe (optional - mock payment works without)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...

# Email (optional)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Storage Options

**Default: Local Filesystem**
- No setup required
- Stores in `public/uploads/`
- Works immediately

**Production: Cloudflare R2 or AWS S3**
- Set R2/S3 credentials
- Auto-switches when configured
- CDN support

## 🧪 Testing

### Manual Testing Flow

1. **Upload photos** at `/upload`
2. **Wait for processing** (auto-generates layout)
3. **View book** at `/book/[id]`
4. **Order print** via checkout
5. **Check dashboard** at `/dashboard` (use email from order)
6. **Admin panel** at `/admin` (view/manage orders)

### With Sample Data

```bash
npm run seed
# Then visit the URLs shown in output
```

## 📦 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

**Notes:**
- SQLite doesn't persist on Vercel (use PostgreSQL)
- Set `DATABASE_URL` in Vercel environment
- Configure R2/S3 for file storage

### Other Platforms

Works on any Node.js platform:
- Netlify
- Railway
- Render
- Docker

## 🎯 Production Checklist

Before going live:

- [ ] Set up PostgreSQL database (Neon, Supabase, etc.)
- [ ] Configure R2/S3 for file storage
- [ ] Add Stripe API keys for real payments
- [ ] Set up email (Resend) for notifications
- [ ] Add authentication (NextAuth.js)
- [ ] Implement admin authentication
- [ ] Configure printful.com for fulfillment
- [ ] Set up monitoring (Sentry)
- [ ] Add analytics (Posthog, Google Analytics)
- [ ] Test print quality with sample orders

## 🔐 Security Notes

**Current State (MVP):**
- No authentication (email-based for demo)
- Admin panel is open
- Mock payment processing

**Production Requirements:**
- Add NextAuth.js or Clerk
- Protect admin routes
- Use real Stripe payment
- Add CSRF protection
- Rate limiting on uploads
- Input validation everywhere

## 📚 API Reference

### Books

```bash
# Create book
POST /api/books
{ "title": "My Book", "source": "web" }

# Get book
GET /api/books?id=xxx or ?sessionToken=xxx

# Update book
PATCH /api/books
{ "id": "xxx", "title": "New Title", "status": "ready" }

# Process book (generate layout)
POST /api/books/[id]/process

# Generate PDF
GET /api/books/[id]/pdf
```

### Photos

```bash
# Upload photo
POST /api/upload
FormData { bookId, file }

# Get photos
GET /api/upload?bookId=xxx
```

### Orders

```bash
# Create order
POST /api/orders
{ bookId, shipping, subtotal, total, ... }

# Get orders
GET /api/orders?email=xxx
```

### Admin

```bash
# Get all orders
GET /api/admin/orders

# Update order status
PATCH /api/admin/orders/[id]
{ "status": "printing" }
```

## 🐛 Troubleshooting

**"Database not found"**
- App creates SQLite DB automatically
- For PostgreSQL, check DATABASE_URL

**"Upload failed"**
- Check `public/uploads/` exists and is writable
- Check file size < 20MB

**"Layout generation failed"**
- Need at least 1 photo
- Check photos have valid dimensions

**"PDF generation slow"**
- PDFs with many photos take time
- Large images slow down generation

## 🎨 Customization

### Adding Templates

Edit `src/lib/layout/templates.ts`:

```typescript
export const TEMPLATES: Record<TemplateType, TemplateDefinition> = {
  my_template: {
    type: 'my_template',
    photoCount: 3,
    description: 'Custom layout',
    layouts: (photos) => [
      { photoId: photos[0].id, position: { x: 0, y: 0, width: 1, height: 0.5 } },
      // ...
    ],
  },
};
```

### Styling

- Uses **Tailwind CSS 4**
- Edit `src/app/globals.css` for global styles
- Component-level styling in each file

### Adding Payment Provider

Replace mock payment in `src/app/checkout/page.tsx`:

```typescript
// Add Stripe
import { loadStripe } from '@stripe/stripe-js';
// Then use Stripe Checkout or Elements
```

## 📄 License

MIT License - feel free to use for commercial projects

## 🙏 Credits

Built with:
- Next.js 16
- TypeScript
- Tailwind CSS 4
- Drizzle ORM
- Sharp (image processing)
- React PDF
- Exifr
- Node Vibrant

---

**Ready to create beautiful photo books!** 📸 ✨

For questions or issues, check the code comments or create an issue on GitHub.
