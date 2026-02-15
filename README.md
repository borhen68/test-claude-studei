# Frametale - Smart Photo Book Creator

Transform your photos into beautiful books, calendars, and cards with AI-powered layouts and zero design skills needed.

## Features

- 🎨 **Smart Layouts** - AI analyzes photos and creates professional designs automatically
- 📸 **Photo Analysis** - EXIF extraction, quality scoring, color analysis
- 🎯 **Intelligent Sorting** - Chronological + quality-weighted sorting
- 📖 **6 Professional Templates** - Hero, duo, trio, quad, gallery, quote layouts
- 💳 **Stripe Payments** - Secure checkout
- 📦 **Print Fulfillment** - Integration with Printful
- ✨ **Beautiful UI** - Framer Motion animations, modern design

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Database:** PostgreSQL (via Supabase) with Drizzle ORM
- **Storage:** Cloudflare R2 or AWS S3
- **Payments:** Stripe
- **Printing:** Printful API
- **Image Processing:** Sharp, EXIFR, Node-Vibrant

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/borhen68/test-claude-studei.git
cd test-claude-studei
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your credentials:

- **Supabase:** Database URL (https://supabase.com)
- **Cloudflare R2:** Storage keys (or AWS S3)
- **Stripe:** API keys (https://stripe.com)
- **Printful:** API key (https://printful.com)

### 4. Set up database

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Drizzle Studio
npm run db:studio
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                      # Next.js app router
│   ├── page.tsx              # Landing page
│   ├── upload/               # Photo upload
│   ├── processing/           # Processing page
│   ├── book/[id]/            # Book preview
│   ├── checkout/             # Checkout flow
│   └── api/                  # API routes
├── components/               # React components
├── lib/
│   ├── db/                   # Database schema & client
│   ├── storage/              # R2/S3 client
│   ├── photo-analysis/       # Image processing
│   │   ├── exif.ts           # EXIF extraction
│   │   ├── quality.ts        # Quality scoring
│   │   ├── colors.ts         # Color analysis
│   │   └── processor.ts      # Main pipeline
│   ├── layout/               # Layout engine
│   │   ├── templates.ts      # 6 templates
│   │   ├── sorter.ts         # Smart sorting
│   │   └── generator.ts      # Page generation
│   └── utils/                # Utilities
└── docs/                     # Complete documentation
```

## Documentation

See `/docs` folder for complete specs:

- `START_HERE.md` - Quick start guide
- `PRD.md` - Product requirements
- `TECHNICAL_SPEC.md` - Architecture
- `UX_FLOW.md` - User experience design
- `DATA_MODEL.md` - Database schema
- `ROADMAP.md` - Development roadmap

## Development

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Database
npm run db:generate    # Generate migrations
npm run db:push        # Push schema
npm run db:studio      # Open Drizzle Studio
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual

```bash
npm run build
npm start
```

## Environment Variables

Required:

```env
DATABASE_URL=              # Supabase Postgres
DIRECT_URL=                # Direct connection

R2_ACCESS_KEY_ID=          # Cloudflare R2
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

STRIPE_SECRET_KEY=         # Stripe
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

PRINTFUL_API_KEY=          # Printful

NEXT_PUBLIC_APP_URL=       # Your domain
```

## Features Status

- ✅ Landing page (beautiful, animated)
- ✅ Upload page (drag & drop)
- ✅ Photo analysis (EXIF, quality, colors)
- ✅ Smart sorting & layout engine
- ✅ Processing page (with progress)
- ✅ Book preview page
- ✅ Checkout page
- ✅ Database schema
- ✅ API routes
- ⏳ PDF generation (next)
- ⏳ Stripe integration (needs keys)
- ⏳ Printful integration (needs keys)
- ⏳ Email notifications

## Contributing

This is a private project. For questions, contact the team.

## License

Proprietary - All rights reserved
