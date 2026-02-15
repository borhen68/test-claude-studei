# Feature Implementation Plan

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite (better-sqlite3) + Drizzle ORM
- **Storage:** AWS S3 (Cloudflare R2 compatible)
- **Payments:** Stripe
- **Email:** Resend
- **UI:** Tailwind CSS, Framer Motion, Lucide Icons
- **Forms:** React Hook Form + Zod validation
- **Images:** Sharp, Exifr (EXIF extraction), node-vibrant (colors)
- **PDF:** @react-pdf/renderer

## Current State Analysis

### Already Implemented ✅
1. Photo upload with drag & drop
2. Book creation and session management
3. Photo processing (quality scoring, face detection, color extraction)
4. Page layout engine (6 templates)
5. Preview system
6. Checkout flow with Stripe
7. Order management
8. Database schema for books, photos, pages, orders
9. CloudPrinter integration (partially)
10. Admin panel structure
11. Email notifications

### Database Schema
- books: id, userId, sessionToken, title, theme, pageCount, status, coverImageUrl, previewPdfUrl, finalPdfUrl
- photos: id, bookId, originalUrl, processedUrl, thumbnailUrl, width, height, qualityScore, hasFaces, faceCount, dominantColor, colorPalette, dateTaken, sortOrder
- pages: id, bookId, pageNumber, template, photoIds, layoutData, textContent
- orders: id, bookId, email, shipping info, payment info, fulfillment status

## Feature Prioritization Matrix

### TIER 1: Quick Wins (High Impact, Low Effort) - 30-45 min total
1. **Custom Calendar Dates** (10 min)
2. **Flexible Calendar Start** (8 min)
3. **Quick Reorder** (12 min)
4. **Photo Quality Enhancement** (15 min)

### TIER 2: Differentiators (High Impact, Medium Effort) - 60-90 min total
5. **Google Photos Import** (45 min)
6. **Instagram Import** (30 min)
7. **Smart Photo Suggestions** (20 min)

### TIER 3: Revenue Drivers (Medium Impact, Medium Effort) - 45-60 min
8. **Batch Card Sending** (30 min)
9. **Gift Scheduling** (25 min)
10. **Family Collaboration** (30 min)

## Status

**Waiting for research completion...**

Monitoring:
- /root/.openclaw/workspace/frametale/docs/CUSTOMER_RESEARCH_INSIGHTS.md
- /root/.openclaw/workspace/frametale/docs/FEATURE_RESEARCH_REPORT.md

Ready to implement TOP 5 features as soon as research is available.
