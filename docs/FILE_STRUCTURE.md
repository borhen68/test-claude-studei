# Frametale - Project File Structure

**Complete directory layout for the Next.js project**

---

## Root Structure

```
frametale/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Run tests on PR
│       └── deploy.yml                # Auto-deploy to Vercel
│
├── docs/                             # All documentation (these files!)
│   ├── README.md
│   ├── PRD.md
│   ├── TECHNICAL_SPEC.md
│   ├── UX_FLOW.md
│   ├── DATA_MODEL.md
│   ├── ROADMAP.md
│   └── FILE_STRUCTURE.md            # This file
│
├── public/
│   ├── images/
│   │   ├── hero-book-example.jpg
│   │   ├── feature-simple.svg
│   │   ├── feature-fast.svg
│   │   └── feature-quality.svg
│   ├── fonts/                        # Custom fonts (if needed)
│   └── favicon.ico
│
├── src/
│   ├── app/                          # Next.js 15 app router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   │
│   │   ├── upload/
│   │   │   └── page.tsx              # Upload photos page
│   │   │
│   │   ├── processing/
│   │   │   └── page.tsx              # Processing/loading page
│   │   │
│   │   ├── book/
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Preview book page
│   │   │       └── edit/
│   │   │           └── page.tsx      # Edit book (post-MVP)
│   │   │
│   │   ├── checkout/
│   │   │   └── page.tsx              # Checkout page
│   │   │
│   │   ├── order/
│   │   │   └── [id]/
│   │   │       ├── success/
│   │   │       │   └── page.tsx      # Order confirmation
│   │   │       └── track/
│   │   │           └── page.tsx      # Order tracking
│   │   │
│   │   ├── api/
│   │   │   ├── books/
│   │   │   │   ├── route.ts          # POST /api/books
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts      # GET/PATCH /api/books/:id
│   │   │   │       ├── photos/
│   │   │   │       │   └── route.ts  # POST /api/books/:id/photos
│   │   │   │       ├── pages/
│   │   │   │       │   └── route.ts  # GET /api/books/:id/pages
│   │   │   │       └── pdf/
│   │   │   │           └── route.ts  # GET /api/books/:id/pdf
│   │   │   │
│   │   │   ├── upload/
│   │   │   │   └── presigned-url/
│   │   │   │       └── route.ts      # POST /api/upload/presigned-url
│   │   │   │
│   │   │   ├── checkout/
│   │   │   │   └── route.ts          # POST /api/checkout
│   │   │   │
│   │   │   └── webhooks/
│   │   │       ├── stripe/
│   │   │       │   └── route.ts      # POST /api/webhooks/stripe
│   │   │       └── printful/
│   │   │           └── route.ts      # POST /api/webhooks/printful
│   │   │
│   │   ├── globals.css               # Global styles (Tailwind)
│   │   ├── fonts.ts                  # Font optimization
│   │   └── providers.tsx             # Context providers
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── progress.tsx
│   │   │   └── ... (all shadcn components)
│   │   │
│   │   ├── upload/
│   │   │   ├── dropzone.tsx          # Drag & drop area
│   │   │   ├── photo-grid.tsx        # Uploaded photos grid
│   │   │   └── upload-progress.tsx   # Progress bar + status
│   │   │
│   │   ├── preview/
│   │   │   ├── book-viewer.tsx       # Interactive page flipper
│   │   │   ├── page-renderer.tsx     # Single page preview
│   │   │   └── theme-selector.tsx    # Theme picker (post-MVP)
│   │   │
│   │   ├── layout/
│   │   │   ├── header.tsx            # Site header
│   │   │   ├── footer.tsx            # Site footer
│   │   │   └── container.tsx         # Max-width wrapper
│   │   │
│   │   └── checkout/
│   │       ├── order-summary.tsx     # Price breakdown
│   │       └── shipping-form.tsx     # Address inputs
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts              # Database client (Drizzle)
│   │   │   ├── schema.ts             # Drizzle schema definitions
│   │   │   └── queries.ts            # Common queries
│   │   │
│   │   ├── storage/
│   │   │   └── r2.ts                 # Cloudflare R2 client
│   │   │
│   │   ├── payments/
│   │   │   └── stripe.ts             # Stripe client & helpers
│   │   │
│   │   ├── fulfillment/
│   │   │   └── printful.ts           # Printful API client
│   │   │
│   │   ├── photo-analysis/
│   │   │   ├── exif.ts               # EXIF extraction
│   │   │   ├── quality.ts            # Quality scoring
│   │   │   ├── colors.ts             # Color extraction
│   │   │   ├── faces.ts              # Face detection (optional)
│   │   │   └── duplicates.ts         # Duplicate detection
│   │   │
│   │   ├── layout/
│   │   │   ├── templates.ts          # Layout template definitions
│   │   │   ├── selector.ts           # Template selection logic
│   │   │   ├── sorter.ts             # Photo sorting algorithm
│   │   │   └── cropper.ts            # Smart cropping logic
│   │   │
│   │   ├── pdf/
│   │   │   ├── generator.tsx         # React-PDF book generator
│   │   │   ├── templates/            # PDF page templates
│   │   │   │   ├── cover.tsx
│   │   │   │   ├── hero.tsx
│   │   │   │   ├── duo.tsx
│   │   │   │   ├── trio.tsx
│   │   │   │   ├── quad.tsx
│   │   │   │   └── gallery.tsx
│   │   │   └── utils.ts              # PDF helpers (bleed, color conversion)
│   │   │
│   │   ├── email/
│   │   │   ├── client.ts             # Email client (Resend)
│   │   │   └── templates/
│   │   │       ├── order-confirmation.tsx
│   │   │       └── shipping-notification.tsx
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts                 # Tailwind class merger
│   │   │   ├── format.ts             # Date/currency formatting
│   │   │   └── session.ts            # Session token generation
│   │   │
│   │   └── types/
│   │       ├── book.ts               # Book types
│   │       ├── photo.ts              # Photo types
│   │       ├── page.ts               # Page types
│   │       └── order.ts              # Order types
│   │
│   ├── hooks/
│   │   ├── use-upload.ts             # Upload state management
│   │   ├── use-book.ts               # Book data fetching
│   │   └── use-checkout.ts           # Checkout flow
│   │
│   └── middleware.ts                 # Next.js middleware (auth, rate limiting)
│
├── drizzle/
│   └── migrations/                   # Database migrations
│       ├── 0001_create_books.sql
│       ├── 0002_create_photos.sql
│       └── ...
│
├── tests/
│   ├── unit/
│   │   ├── photo-analysis.test.ts
│   │   ├── layout-selector.test.ts
│   │   └── quality-scorer.test.ts
│   │
│   ├── integration/
│   │   ├── upload-flow.test.ts
│   │   └── checkout-flow.test.ts
│   │
│   └── e2e/
│       ├── full-purchase.spec.ts
│       └── preview.spec.ts
│
├── scripts/
│   ├── cleanup-old-uploads.ts        # Cron job to delete old files
│   ├── seed-database.ts              # Seed test data
│   └── test-printful.ts              # Test Printful integration
│
├── .env.example                      # Example environment variables
├── .env.local                        # Local secrets (gitignored)
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── next.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── drizzle.config.ts
├── postcss.config.js
├── vitest.config.ts                  # For unit tests
├── playwright.config.ts              # For E2E tests
└── README.md                         # Project README (setup instructions)
```

---

## Environment Variables

**`.env.local` (development):**

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # Supabase direct connection

# Storage
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="frametale-uploads"
R2_PUBLIC_URL="https://cdn.frametale.com"

# Payments
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Fulfillment
PRINTFUL_API_KEY="..."
PRINTFUL_BOOK_VARIANT_ID="..."

# Email
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_SECRET="random-secret-key"

# Analytics (optional)
POSTHOG_API_KEY="..."
SENTRY_DSN="..."
```

**`.env.production` (Vercel):**
Same variables, but production values.

---

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx scripts/seed-database.ts",
    
    "test": "vitest",
    "test:unit": "vitest run tests/unit",
    "test:e2e": "playwright test",
    
    "cleanup": "tsx scripts/cleanup-old-uploads.ts"
  }
}
```

---

## Git Workflow

**Branches:**
- `main` → Production (auto-deploy to Vercel)
- `develop` → Staging (preview deployments)
- `feature/*` → Feature branches
- `fix/*` → Bug fixes

**Commit Convention:**
```
feat(upload): add drag-and-drop zone
fix(pdf): correct bleed calculation
docs(prd): update pricing section
chore(deps): upgrade Next.js to 15.1
```

---

## Deployment

**Vercel (Production):**
- Auto-deploy from `main` branch
- Environment variables set in Vercel dashboard
- Edge functions for API routes (where possible)

**Preview Deployments:**
- Every PR gets a preview URL
- Test before merging to main

**Database Migrations:**
```bash
# Run migrations on deploy (Vercel build script)
npm run db:push
```

---

## Monitoring

**Vercel Analytics:**
- Web Vitals (LCP, FID, CLS)
- Page load times
- Error rates

**Sentry:**
- Error tracking
- Performance monitoring
- Release tracking

**PostHog:**
- User behavior funnels
- Conversion tracking
- A/B tests

**Custom Dashboards:**
- Stripe Dashboard (payments)
- Printful Dashboard (fulfillment)
- Cloudflare R2 Dashboard (storage)

---

## Next Steps

1. ✅ Create project directory
2. ✅ Initialize Next.js project: `npx create-next-app@latest frametale`
3. ✅ Install dependencies: Tailwind, shadcn/ui, Drizzle, etc.
4. ✅ Set up Supabase project
5. ✅ Configure Cloudflare R2 bucket
6. ✅ Create Stripe account
7. ✅ Create Printful account
8. ✅ Set up environment variables
9. ✅ Initialize Git repository
10. ⏳ Start coding (Sprint 1!)

---

**Ready to scaffold the project? Let's build!** 🏗️
