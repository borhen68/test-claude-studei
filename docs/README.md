# Frametale Documentation

**Complete Product Specification & Architecture**  
**Version:** 2.0  
**Status:** Ready for Development

---

## 📚 Documentation Index

This folder contains the complete product specification for Frametale, a radically simple photo book creation service.

### Core Documents

1. **[PRD.md](./PRD.md)** - Product Requirements Document
   - Executive summary
   - Problem & solution
   - User personas
   - Features (must-have vs. nice-to-have)
   - Business model & economics
   - Success metrics
   - Competitive analysis
   - **Read this first**

2. **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)** - Technical Architecture
   - System architecture
   - Technology stack & rationale
   - Component breakdown (upload, processing, layout, PDF, checkout)
   - Database schema overview
   - API design
   - Security & performance
   - Deployment strategy

3. **[UX_FLOW.md](./UX_FLOW.md)** - User Experience Design
   - User journey map
   - Page-by-page wireframes
   - Mobile responsive design
   - Interactions & animations
   - Error states
   - Accessibility requirements
   - Copy & tone guidelines

4. **[DATA_MODEL.md](./DATA_MODEL.md)** - Database Design
   - Complete schema (books, photos, pages, orders, payments, fulfillments)
   - Indexes & performance optimization
   - Row-level security (RLS)
   - Data lifecycle & retention
   - Migration strategy

5. **[ROADMAP.md](./ROADMAP.md)** - Development Plan
   - 12-month timeline
   - Phase 1: MVP (Weeks 1-8)
   - Phase 2: Beta (Weeks 9-12)
   - Phase 3: Launch (Month 4)
   - Phase 4: Growth (Months 5-6)
   - Phase 5: Expansion (Months 7-12)
   - Success metrics by phase
   - Risk mitigation

---

## 🎯 Quick Start

**If you're a:**

### Developer
1. Read: TECHNICAL_SPEC.md → DATA_MODEL.md
2. Set up: `npm install` → configure env vars → `npm run dev`
3. Reference: API_SPEC.md (once implemented) for endpoints

### Designer
1. Read: UX_FLOW.md → PRD.md (user personas)
2. Create: High-fidelity mockups in Figma
3. Deliver: Component library (shadcn/ui + Tailwind)

### Product Manager
1. Read: PRD.md → ROADMAP.md
2. Track: Milestones, metrics, feature scope
3. Communicate: With team & stakeholders

### Stakeholder/Investor
1. Read: PRD.md (Business Model section)
2. Review: Competitive analysis, economics, success metrics
3. Ask: Questions in GitHub issues or Slack

---

## 💡 Core Philosophy

**Frametale is built on these principles:**

1. **Radically Simple** - 2 clicks from upload to purchase, <3 minutes total
2. **No Bullshit** - No fake AI, no hidden fees, no dark patterns
3. **Zero AI Costs** - Smart algorithms, not expensive API calls
4. **Quality Over Hype** - Professional results, every time
5. **Speed to Market** - Launch fast, iterate based on real user feedback

---

## 🏗️ Tech Stack Summary

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 15 + React 19 | Server Components, speed |
| **Styling** | Tailwind CSS + shadcn/ui | Fast, accessible, beautiful |
| **Database** | PostgreSQL (Supabase) | Relational, proven, generous free tier |
| **Storage** | Cloudflare R2 | Cheaper egress, fast CDN |
| **Payments** | Stripe | Industry standard, great UX |
| **Printing** | Printful | No MOQ, quality, good API |
| **Hosting** | Vercel | Zero-config Next.js deployment |
| **Image Processing** | sharp + exifr + node-vibrant | Fast, free, no AI APIs |
| **PDF Generation** | react-pdf/renderer | Declarative, type-safe |

**Total ongoing costs:** ~$0 (until scale)  
**Cost per book:** ~$23-26  
**Price per book:** $39  
**Profit margin:** 33-41%

---

## 📊 Business Model

**Product:** 8x8" hardcover photo book, 20-60 pages, premium paper  
**Price:** $39 flat (no tiers, no upsells)  
**Target:** Busy parents, gift givers, memory keepers  
**Differentiation:** Speed + Simplicity vs. complex competitors

**Projections:**
- Month 1-3: MVP + Beta (50-100 books)
- Month 4: Launch (100 orders)
- Month 6: Growth (500 orders/month)
- Month 12: Scale (1,000+ orders/month)

**Revenue at scale (Month 12):**
- 1,000 books/month × $39 = **$39,000/month**
- Profit: ~$14,000/month (36% margin)
- Year 2: Add subscriptions, prints, calendars (3x revenue)

---

## ✅ Decision Log

**Key decisions made:**

1. **No complex editor** - Users want simplicity, not Photoshop
2. **No AI APIs** - Margins matter, deterministic > unpredictable
3. **Guest checkout first** - Reduce friction, add accounts later
4. **US-only MVP** - Simplify shipping, expand internationally later
5. **Single SKU** - One product, one price, perfected
6. **react-pdf over Puppeteer** - Faster, lighter, better for PDFs

**Deferred to post-MVP:**
- User accounts
- Google Photos / Instagram import
- Manual photo editing
- Size/cover variations
- International shipping
- Subscription model

---

## 🚨 Open Questions

1. **Do we offer any editing at all in MVP?**
   - Decision: A/B test at beta (full auto vs. theme picker)

2. **Should we add "dedication page" option in checkout?**
   - Decision: Yes, simple text input (optional, free)

3. **Printful vs. Gelato for fulfillment?**
   - Decision: Start with Printful, evaluate Gelato if quality issues

4. **PostHog vs. Amplitude for analytics?**
   - Decision: PostHog (open-source, cheaper, good enough)

---

## 📅 Next Actions

**Immediate (This Week):**
1. ✅ Review and approve all documentation
2. ⏳ Set up development environment
3. ⏳ Create Figma mockups (high-fidelity)
4. ⏳ Initialize Next.js project
5. ⏳ Set up Supabase project + database
6. ⏳ Configure Cloudflare R2 bucket

**Sprint 1 (Week 1-2):**
- Landing page (hero, features, pricing, FAQ)
- Component library setup
- Database schema implementation
- File upload infrastructure (pre-signed URLs)
- Basic routing structure

**Sprint 2 (Week 3-4):**
- Photo upload UI (drag & drop, progress)
- Photo analysis pipeline (EXIF, quality, colors)
- Duplicate detection
- Processing page with loading states

---

## 🤝 Contributing

**For team members:**
- Branch naming: `feature/upload-ui`, `fix/pdf-generation`, etc.
- PR reviews: Required before merge
- Testing: Unit tests for critical paths (upload, payment, PDF)
- Documentation: Update relevant .md file when changing behavior

**Code standards:**
- TypeScript strict mode
- ESLint + Prettier (auto-format on save)
- Conventional commits (`feat:`, `fix:`, `docs:`, etc.)

---

## 📞 Support & Contact

**Questions about the docs?**
- Open a GitHub issue
- Ping in Slack (#frametale channel)
- Email: dev@frametale.com

---

## 🎉 Let's Build!

All docs are approved. Architecture is solid. Roadmap is clear.

**Time to ship.** 🚀

---

**Last Updated:** February 15, 2026  
**Next Review:** After Beta Testing (Week 12)
