# Frametale - Development Roadmap

**Version:** 2.0  
**Last Updated:** February 15, 2026  

---

## ⚡ ACTUAL PROGRESS UPDATE (Feb 15, 2026)

**Overall Status:** ~75% MVP Complete

### ✅ Completed Beyond Plan:
- Full authentication system
- User dashboard
- Admin panel
- Company website with blog
- CloudPrinter integration (replaced Printful)

### ⚠️ Critical Missing:
- **PDF Generation** - Required for CloudPrinter fulfillment

See `CURRENT_STATUS.md` for detailed progress report.

---

## Timeline Overview

```
Month 1-2: MVP Development
Month 3: Beta Testing & Iteration
Month 4: Public Launch
Month 5-6: Growth & Optimization
Month 7-12: Scale & Expand
```

---

## Phase 1: MVP (Weeks 1-8)

**Goal:** Launch-ready photo book product with core features only.

### Week 1-2: Foundation
- [x] Project setup (Next.js 16, TypeScript, Tailwind)
- [x] Database schema (Drizzle ORM with SQLite/PostgreSQL)
- [x] File storage (Local + S3/R2 ready)
- [x] Component library (Tailwind components)
- [x] Landing page (Journi-style design)
- [x] Basic routing structure

### Week 3-4: Upload & Processing
- [x] Drag & drop upload UI (573 lines, fully functional)
- [x] File upload with progress
- [x] Parallel upload (3 at a time)
- [x] EXIF extraction (date, orientation, location)
- [x] Quality scoring algorithm
- [x] Color extraction (dominant colors)
- [x] Sharpness detection
- [ ] Duplicate detection (not built)
- [ ] Face detection (not built)

### Week 5-6: Layout Engine
- [x] 6 layout templates (hero, duo, trio, quad, gallery, quote)
- [x] Template selection algorithm
- [x] Photo sorting (chronological + quality-weighted)
- [x] Smart cropping logic
- [x] Page generation logic
- [x] Theme extraction from photo colors

### Week 7: Preview & PDF
- [x] Interactive book preview (page flipper) - 596 lines
- [ ] React-PDF setup (not implemented yet)
- [ ] PDF generation (CRITICAL - NOT DONE)
- [ ] Preview caching (not needed yet)

### Week 8: Checkout & Fulfillment
- [x] Stripe integration (checkout session)
- [x] Webhook handling (payment events)
- [x] Order creation flow
- [x] CloudPrinter API integration (replaced Printful)
- [x] Email notifications (7 templates built)
- [x] Order tracking page

### Bonus Completed (Not in Original Roadmap)
- [x] Complete authentication system (login/signup/JWT)
- [x] User dashboard with book library
- [x] Admin panel with order management
- [x] Company website with blog
- [x] Admin CMS for content
- [x] Email system with 7 templates
- [x] In-app notifications

**Milestone 1: Feature Complete MVP (End of Week 8)** - ⚠️ 75% Complete

---

## Phase 2: Beta Testing (Weeks 9-12)

**Goal:** Test with real users, fix critical bugs, validate product-market fit.

### Week 9: Internal Testing
- [ ] Create 10 test books (friends/family)
- [ ] Identify critical bugs
- [ ] Test on mobile devices (iOS, Android)
- [ ] Performance testing (100 photos, 200 photos)
- [ ] Edge case handling (HEIC files, no EXIF, etc.)

### Week 10: Beta Launch
- [ ] Invite 50 beta users (email list, social media)
- [ ] Offer discount code ($29 early bird)
- [ ] Collect feedback via survey
- [ ] Monitor conversion funnel
- [ ] Track drop-off points

### Week 11: Iteration
- [ ] Fix top 10 bugs reported
- [ ] Improve upload UX based on feedback
- [ ] A/B test: Auto-layout vs. Light editing option
- [ ] Optimize PDF generation speed
- [ ] Add loading state microcopy

### Week 12: Pre-Launch Prep
- [ ] Finalize pricing ($39 confirmed or adjusted)
- [ ] Prepare marketing materials (ads, landing page copy)
- [ ] Set up analytics (PostHog funnels)
- [ ] Write FAQ content
- [ ] Prepare customer support templates

**Milestone 2: Beta Complete, Ready for Public Launch (End of Week 12)**

---

## Phase 3: Public Launch (Month 4)

**Goal:** Launch to broader audience, acquire first 100 customers.

### Launch Week
- [ ] Press release (TechCrunch, Product Hunt)
- [ ] Product Hunt launch
- [ ] Social media campaign (Instagram, Facebook ads)
- [ ] Email announcement (beta list + newsletter)
- [ ] Monitor metrics daily (conversion, errors, orders)

### Week 2-4: Early Growth
- [ ] Run paid ads (Facebook, Instagram)
- [ ] A/B test landing page headlines
- [ ] Collect testimonials from happy customers
- [ ] Fix any critical issues discovered at scale
- [ ] Hit 100 orders milestone

**Milestone 3: 100 Orders Shipped (End of Month 4)**

---

## Phase 4: Growth & Optimization (Months 5-6)

**Goal:** Optimize conversion funnel, reduce costs, scale to 500 orders/month.

### Conversion Optimization
- [ ] A/B test checkout flow (guest vs. account)
- [ ] Improve upload speed (parallel processing)
- [ ] Reduce preview generation time (<5 seconds)
- [ ] Add social proof (reviews, testimonials)
- [ ] Implement exit-intent popup (discount offer)

### Cost Reduction
- [ ] Negotiate bulk Printful rates (if volume justifies)
- [ ] Optimize image storage (delete old uploads)
- [ ] Cache preview PDFs (reduce regeneration)
- [ ] Monitor and reduce error rates (failed uploads, payments)

### Marketing Scale
- [ ] Launch referral program ("Give $10, Get $10")
- [ ] Influencer partnerships (mommy bloggers, lifestyle)
- [ ] SEO content (blog posts, guides)
- [ ] Pinterest ads (high-intent audience)
- [ ] Google Ads (branded + keywords)

**Milestone 4: 500 Orders/Month (End of Month 6)**

---

## Phase 5: Product Expansion (Months 7-12)

**Goal:** Add new products, subscription model, reach 1,000+ orders/month.

### New Products
- [ ] Size variations (6x6", 10x10")
- [ ] Page count tiers (20, 40, 60 pages → different prices)
- [ ] Cover options (softcover, leather)
- [ ] Prints (individual photos from book)
- [ ] Calendars (12 months, same layout engine)
- [ ] Cards (greeting cards, thank-you cards)

### Enhanced Features
- [ ] User accounts (save books, re-order)
- [ ] Google Photos import
- [ ] Instagram import
- [ ] Manual photo reordering (drag & drop)
- [ ] Theme customization (fonts, colors)
- [ ] Add captions to pages

### Subscription Model
- [ ] "Memory Box" subscription ($99/year = 4 books)
- [ ] Auto-generate book every quarter from connected Google Photos
- [ ] Email preview before printing (approve or edit)
- [ ] Subscription management dashboard

### B2B Opportunities
- [ ] Photographer partnerships (bulk orders)
- [ ] Wedding packages (3-pack discount)
- [ ] Corporate gifts (branded books)
- [ ] Event photography (sports, school)

**Milestone 5: 1,000 Orders/Month + Subscription Launch (End of Month 12)**

---

## Feature Backlog (Future)

**Nice-to-Have (Post Year 1):**
- Video integration (QR codes linking to videos)
- Augmented reality (scan page → see video)
- Collaborative books (family members contribute photos)
- Gift wrapping option
- International shipping (UK, EU, Australia)
- Multi-language support (Spanish, French)
- Mobile app (iOS, Android)

**Explicitly NOT Building:**
- Complex design editor (Canva clone)
- Social network features (sharing, comments)
- AI-generated photo effects
- Print marketplace (other creators' designs)

---

## Success Metrics by Phase

| Phase | Metric | Target |
|-------|--------|--------|
| **Beta** | Books created | 50+ |
| **Beta** | Conversion rate | >10% |
| **Launch** | First 100 orders | <30 days |
| **Growth** | Monthly orders | 500+ |
| **Growth** | Customer satisfaction (NPS) | >50 |
| **Expansion** | Monthly orders | 1,000+ |
| **Expansion** | Subscription sign-ups | 100+ |

---

## Risk Mitigation

**Top Risks:**

1. **Low conversion rate (<10%)**
   - Mitigation: A/B test relentlessly, simplify UX further
   - Pivot: Offer more customization if users demand control

2. **Print quality issues**
   - Mitigation: Order test books frequently, strict QA
   - Backup: Switch to Gelato if Printful quality drops

3. **Scaling costs exceed revenue**
   - Mitigation: Monitor unit economics weekly
   - Pivot: Raise price to $44 if needed (still competitive)

4. **Competitor copies us**
   - Mitigation: Move fast, build brand loyalty, own SEO
   - Defense: Add features they can't easily copy (subscriptions, imports)

---

## Team & Resources

**MVP (Solo or Small Team):**
- 1 full-stack developer (Next.js, TypeScript)
- 1 designer (UI/UX, landing page)
- Contractor: QA testing (1 week)
- Contractor: Copywriting (landing page, emails)

**Growth (Months 5-12):**
- +1 marketing specialist (ads, SEO, content)
- +1 customer support (part-time)
- +1 developer (if adding mobile app or complex features)

**Tools:**
- Design: Figma
- Project management: Linear or Notion
- Communication: Slack
- Code: GitHub
- Monitoring: Sentry, Vercel Analytics
- Analytics: PostHog

---

## Next Steps

1. ✅ Approve roadmap
2. ⏳ Assign tasks to sprint 1 (Week 1-2)
3. ⏳ Set up dev environment
4. ⏳ Begin development

**Ready to build? Let's go!** 🚀
