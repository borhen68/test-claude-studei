# Frametale - Product Requirements Document

**Version:** 2.0  
**Last Updated:** February 15, 2026  
**Status:** Pre-Development - Architecture Phase

---

## Executive Summary

Frametale is a **zero-bullshit photo book creator** that transforms messy photo collections into beautiful, professional books without AI costs, fake magic, or complicated editing.

**Core Promise:** Upload photos → Get a beautiful book in 2 clicks → Pay $39 → Receive it printed.

**Differentiation:** 
- No complex editor (unlike Shutterfly)
- No subscription trap (unlike Chatbooks)
- No AI costs eating margins (unlike everyone)
- Just smart algorithms + good design

---

## The Problem

**Current Solutions Suck:**

1. **Traditional photo book sites** (Shutterfly, Mixbook, Snapfish)
   - Overwhelming: 100+ templates, fonts, layouts
   - Time-consuming: 2-3 hours to make one book
   - Analysis paralysis: Too many choices
   - Result: 80% of people abandon without buying

2. **"AI-powered" competitors** (ChatBooks, etc.)
   - Expensive AI API costs → lower margins or higher prices
   - Unpredictable results (AI hallucinations)
   - Privacy concerns (photos sent to third-party APIs)
   - Ongoing costs scale with volume

3. **DIY print shops**
   - No guidance, just upload and pray
   - Usually look amateur
   - No curation or sorting

**What people actually want:**
- "Just make it look good, I trust you"
- Fast process (<5 minutes)
- Predictable, professional results
- Fair price

---

## The Solution

### Core Product

**Frametale Photo Book**
- 8x8" hardcover, 20-60 pages
- Premium paper (180gsm)
- Lay-flat binding
- Matte or glossy finish
- Ships in 5-7 business days

### The Experience

**Step 1: Upload (30 seconds)**
- Drag & drop 20-200 photos
- Or connect Google Photos/Instagram
- Progress bar, no waiting

**Step 2: Auto-Magic (instant)**
- Smart analysis: faces, quality, colors, dates
- Intelligent sorting: chronological or thematic
- Layout generation: professional templates
- Theme extraction: colors from your photos

**Step 3: Preview (1 minute)**
- Flip through the book
- See every page
- Optional: swap photos, change theme
- No complex editing tools

**Step 4: Checkout (1 minute)**
- One price: $39 (no tiers, no upsells)
- Stripe payment
- Add dedication page (optional)
- Done

**Total time: ~3 minutes from upload to purchase**

---

## User Personas

### Primary: The Busy Parent (Sarah, 34)
**Needs:**
- Preserve family memories without effort
- Gift grandparents something meaningful
- No time for complex editing

**Behaviors:**
- Has 1000+ unorganized phone photos
- Values quality over customization
- Willing to pay for convenience
- Shares photos on Instagram (aesthetic sense)

**Pain Points:**
- Overwhelmed by traditional photo book sites
- Never finishes projects she starts
- Guilty about not printing photos

### Secondary: The Gift Giver (Mike, 28)
**Needs:**
- Thoughtful gift for girlfriend/mom
- Looks professional without effort
- Fast turnaround

**Behaviors:**
- Not a "creative" person
- Trusts automated solutions
- Price-conscious but values quality
- Shops last-minute

### Tertiary: The Memory Keeper (Linda, 58)
**Needs:**
- Preserve vacation/wedding photos
- Share with family
- Tangible, archival quality

**Behaviors:**
- Has photos on multiple devices
- Values storytelling over design
- Willing to make multiple books
- Shares physical gifts

---

## Core Features (MVP)

### Must-Have (Launch Blockers)

**Photo Management**
- ✅ Drag & drop upload (20-200 photos)
- ✅ Duplicate detection and removal
- ✅ Format support: JPG, PNG, HEIC
- ✅ Max 20MB per photo
- ✅ Automatic rotation based on EXIF
- ✅ Quality filtering (reject too low-res)

**Smart Processing**
- ✅ Face detection (prioritize people photos)
- ✅ Quality scoring (sharpness, exposure, noise)
- ✅ Color extraction (build theme palette)
- ✅ Date extraction from EXIF
- ✅ Intelligent sorting (chronological + quality-weighted)

**Layout Engine**
- ✅ 6 professional templates:
  - Hero (1 large photo)
  - Duo (2 photos, balanced)
  - Trio (3 photos, asymmetric)
  - Quad (4 photos, grid)
  - Gallery (6-9 small photos, mosaic)
  - Quote (1 photo + text space)
- ✅ Automatic template selection based on photo aspect ratios
- ✅ Smart cropping (preserve faces/important content)
- ✅ Balanced page flow (no repetitive layouts)

**Book Preview**
- ✅ Interactive page flipper
- ✅ Full-resolution preview
- ✅ Cover preview (front + spine + back)
- ✅ Page count calculator (based on photos)

**Checkout**
- ✅ Single SKU: $39 book
- ✅ Stripe integration
- ✅ Order confirmation email
- ✅ Shipping address collection
- ✅ Optional dedication page text

**Order Fulfillment**
- ✅ Generate print-ready PDF (CMYK, 300 DPI, bleed)
- ✅ Send to Printful API
- ✅ Tracking number email
- ✅ Order status page

### Nice-to-Have (Post-MVP)

**Enhanced Editing**
- ⏸ Reorder photos manually (drag & drop)
- ⏸ Swap photo positions
- ⏸ Change page layout template
- ⏸ Add captions to specific pages
- ⏸ Choose cover color/theme

**Social Features**
- ⏸ Google Photos import
- ⏸ Instagram import
- ⏸ iCloud Photos import
- ⏸ Share preview link (before buying)

**Product Variations**
- ⏸ Size options (6x6", 8x8", 10x10")
- ⏸ Page count tiers (20, 40, 60 pages)
- ⏸ Cover options (hardcover, softcover, leather)
- ⏸ Calendar version
- ⏸ Prints (individual photos)

**Business Features**
- ⏸ Promo codes
- ⏸ Gift wrapping
- ⏸ Multi-book discount (3 for $99)
- ⏸ Subscription (1 book/quarter auto-generated)

### Explicitly NOT Building (Anti-Features)

❌ Complex design editor (like Canva)
❌ 100+ template library
❌ Font customization
❌ Stickers, borders, effects
❌ Video integration
❌ Social sharing of book content
❌ User accounts (until post-MVP)
❌ Save drafts for later
❌ Collaboration features

**Philosophy:** Every feature request should answer: "Does this make buying a book FASTER and EASIER?" If no, cut it.

---

## Business Model

### Pricing

**Single Product, Single Price:**
- $39 per book (8x8", 20-60 pages, hardcover)
- Free shipping over $50 (2-book minimum)
- No hidden fees, no tiers, no upsells

**Cost Breakdown:**
- Print cost: $15-18 (Printful)
- Shipping: $7 (domestic US)
- Payment processing: 2.9% + $0.30 (~$1.43)
- **Total cost:** ~$23-26
- **Profit per book:** $13-16 (33-41% margin)

**Why $39?**
- Competitive (Chatbooks: $30-50, Shutterfly: $35-60)
- Psychological anchor (under $40)
- Covers costs + healthy margin
- Room for discounts/promos

### Revenue Model

**Phase 1 (Months 1-6): Direct Sales**
- Target: 100 books/month
- Revenue: $3,900/month
- Profit: ~$1,400/month
- Marketing: Organic + small ad budget

**Phase 2 (Months 7-12): Scale**
- Target: 500 books/month
- Revenue: $19,500/month
- Profit: ~$7,000/month
- Marketing: Paid ads, influencer partnerships

**Phase 3 (Year 2): Product Expansion**
- Add prints, calendars, cards
- Introduce subscription ($99/year = 3 books)
- B2B (wedding photographers, events)
- Target: 1,000+ books/month

---

## Success Metrics

### Key Performance Indicators

**Product Metrics:**
- **Conversion rate:** Upload → Purchase (target: >15%)
- **Average time to purchase:** <5 minutes (target: <3 min)
- **Cart abandonment rate:** <50% (target: <30%)
- **Customer satisfaction (NPS):** >50
- **Repeat purchase rate:** >20% within 6 months

**Business Metrics:**
- **Monthly revenue:** Track against targets
- **Customer Acquisition Cost (CAC):** <$15
- **Lifetime Value (LTV):** >$80 (2+ books)
- **Profit margin:** >35%
- **Fulfillment success rate:** >98%

**Technical Metrics:**
- **Upload success rate:** >99%
- **Processing time:** <10 seconds for 100 photos
- **Preview load time:** <2 seconds
- **Checkout completion time:** <60 seconds
- **PDF generation success rate:** >99.5%

---

## Launch Strategy

### Pre-Launch (Weeks 1-4)
- Build MVP features
- Test with 10 beta users (friends/family)
- Iterate based on feedback
- Prepare marketing materials (landing page, social assets)

### Soft Launch (Week 5-8)
- Launch to small audience (email list, Instagram followers)
- Offer launch discount ($29 early bird)
- Collect testimonials
- Monitor metrics, fix critical bugs

### Public Launch (Week 9+)
- Press release
- Paid ads (Facebook, Instagram)
- Influencer partnerships (parenting, lifestyle)
- SEO content (blog posts about photo organization)

**Marketing Channels:**
1. Instagram ads (visual product)
2. Facebook (parent groups, gift giving)
3. Pinterest (high intent, longtail)
4. Google Ads (branded + "photo book" keywords)
5. Affiliate program (mommy bloggers)

---

## Competitive Analysis

| Feature | Frametale | Chatbooks | Shutterfly | Mixbook |
|---------|-----------|-----------|------------|---------|
| **Price** | $39 flat | $30-50 | $35-60 | $40-80 |
| **Ease of use** | 2 clicks | Moderate | Complex | Complex |
| **Time to create** | <3 min | ~10 min | 2-3 hours | 2-3 hours |
| **Customization** | Minimal | Low | High | Very high |
| **AI costs** | $0 | $$$ | $ | $ |
| **Shipping** | 5-7 days | 7-10 days | 5-7 days | 7-14 days |
| **Quality** | Premium | Good | Good | Premium |

**Our advantage:** Speed + Simplicity + Predictable quality + No AI costs

---

## Risks & Mitigations

### Risk 1: Users Want More Control
**Likelihood:** Medium  
**Impact:** High (abandonments)  
**Mitigation:** 
- Offer "basic editing" (swap photos, themes) post-MVP
- A/B test: full auto vs. light editing
- Clearly set expectations upfront

### Risk 2: Print Quality Issues
**Likelihood:** Low (using Printful/Gelato)  
**Impact:** Critical (reputation)  
**Mitigation:**
- Order test books from all vendors
- QA checklist before sending to print
- Easy refund/reprint policy
- Monitor reviews obsessively

### Risk 3: Scaling Costs
**Likelihood:** Medium  
**Impact:** Medium  
**Mitigation:**
- Margins support 2x customer acquisition cost
- Can raise price to $44 if needed (still competitive)
- Negotiate bulk rates with Printful at 500+ books/month

### Risk 4: Competitors Copy
**Likelihood:** High (easy to clone)  
**Impact:** Medium  
**Mitigation:**
- Speed to market (first-mover advantage)
- Build brand (trust, testimonials)
- Nail the UX (hard to replicate well)
- Own the "anti-complexity" positioning

---

## Technical Constraints

**Must Support:**
- Modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile browsers (iOS Safari, Chrome Android)
- Screen sizes: 375px to 2560px wide
- Upload file sizes: 20MB max per photo
- Concurrent users: 100+ simultaneous uploads

**Performance Targets:**
- Upload: <5s for 50 photos on 4G
- Processing: <10s for 100 photos
- Preview rendering: <2s initial load
- Checkout: <1s page transitions
- PDF generation: <30s for 60-page book

**Reliability:**
- 99.9% uptime
- Zero data loss (photos, orders)
- Graceful degradation (if Printful API down, queue orders)

---

## Open Questions

1. **Do we need user accounts immediately?**
   - Pro: Easier re-orders, saved addresses
   - Con: Friction, more dev time
   - **Decision:** Start guest checkout, add accounts post-MVP

2. **Should we allow partial editing?**
   - Pro: Higher conversion (some control)
   - Con: Scope creep, slower process
   - **Decision:** A/B test at launch

3. **International shipping?**
   - Pro: Bigger market
   - Con: Complex pricing, customs, delays
   - **Decision:** US-only for MVP, expand if traction

4. **Subscription model?**
   - Pro: Recurring revenue, predictability
   - Con: Too early, need proof of concept
   - **Decision:** Phase 3

---

## Next Steps

1. ✅ Approve this PRD
2. ⏳ Write TECHNICAL_SPEC.md (architecture)
3. ⏳ Write UX_FLOW.md (wireframes, interactions)
4. ⏳ Write DATA_MODEL.md (database schema)
5. ⏳ Write PHOTO_ALGORITHM.md (layout logic)
6. ⏳ Write API_SPEC.md (endpoints)
7. ⏳ Write ROADMAP.md (sprints, milestones)
8. ⏳ Write DEVELOPMENT_GUIDE.md (setup, conventions)
9. ⏳ Begin development

---

**Approved by:** _____________  
**Date:** _____________
