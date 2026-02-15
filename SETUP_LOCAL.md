# Frametale - Local Setup Guide

## Prerequisites

1. **Node.js** - Version 18+ required
   - Download: https://nodejs.org/
   - Check: `node --version`

2. **Git** - To clone the repository
   - Download: https://git-scm.com/
   - Check: `git --version`

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/borhen68/test-claude-studei.git
cd test-claude-studei
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages (~630 packages):
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Drizzle ORM (database)
- Sharp (image processing)
- PDF generation tools
- Authentication libraries
- All other dependencies

### 3. Set Up Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Database (SQLite for local - already works!)
DATABASE_URL="file:./dev.db"

# CloudPrinter (YOUR API KEY - already configured!)
CLOUDPRINTER_API_KEY=ceed9ed7f0ff5d8772c312482f920b98
CLOUDPRINTER_WEBHOOK_SECRET=cloudprinter-webhook-secret
CLOUDPRINTER_API_URL=https://api.cloudprinter.com/cloudcore/1.0

# Storage (Local for development)
UPLOAD_DIR="./uploads"
R2_PUBLIC_URL="http://localhost:3000/uploads"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Secrets (change these!)
SESSION_SECRET="dev-secret-change-in-production"
JWT_SECRET="dev-jwt-secret-change-in-production"

# Optional services (leave empty for mock mode)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
RESEND_API_KEY=""
```

### 4. Initialize Database

```bash
npm run db:push
```

This creates the SQLite database with all tables.

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## What Works Out of the Box

✅ **Upload photos** (no login required)
✅ **Photo processing** (quality scoring, layout generation)
✅ **Book viewer** (beautiful page-flip interface)
✅ **Customization** (cover, captions, themes)
✅ **Checkout** (Stripe in test mode, or skip payment for now)
✅ **CloudPrinter integration** (uses YOUR API key!)
✅ **PDF generation** (print-ready PDFs)

## What Needs Real API Keys

⚠️ **Stripe** - For real payments (test mode works without keys)
⚠️ **Resend/SendGrid** - For sending emails (mock mode logs to console)
⚠️ **Google Photos** - For OAuth import (optional feature)

## Testing the App

### Quick Test Flow:

1. **Homepage** → Click "Create Your Book"
2. **Upload** → Drag & drop 5-10 photos
3. **Processing** → Watch it analyze and create layouts
4. **Viewer** → See your beautiful book with page-flip
5. **Customize** → Change cover, add captions
6. **Checkout** → Test the flow (payment optional)

### Test CloudPrinter Integration:

```bash
# Run the test script
npx tsx scripts/test-cloudprinter.ts
```

This tests the CloudPrinter API with your real API key!

## Troubleshooting

### Build Errors?

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Database Issues?

```bash
# Reset database
rm dev.db
npm run db:push
```

### Port Already in Use?

Change the port:
```bash
npm run dev -- -p 3001
```

## Folder Structure

```
frametale/
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components
│   ├── lib/              # Core logic (PDF, CloudPrinter, etc.)
│   └── styles/           # CSS
├── public/               # Static files
├── uploads/              # Local file storage
├── dev.db                # SQLite database
├── .env.local            # Your environment variables
└── package.json          # Dependencies
```

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
npm run db:push      # Update database schema
npm run db:studio    # Open database GUI
```

## Next Steps

1. ✅ Install Node.js
2. ✅ Clone repository
3. ✅ Run `npm install`
4. ✅ Copy `.env.example` to `.env.local`
5. ✅ Run `npm run db:push`
6. ✅ Run `npm run dev`
7. 🎉 Visit http://localhost:3000

## Need Help?

- Check documentation in `/docs` folder
- Read `README.md` for full details
- All features are documented with examples

---

**You're ready to build amazing photo books!** 📸✨
