# TOP 5 Features Analysis (Based on PRD)

## Selection Criteria
1. **Customer Demand**: Mentioned in PRD "Nice-to-Have" or "Product Variations"
2. **Implementation Effort**: Can be done in 30-60 min each
3. **Differentiation**: Sets Frametale apart from Shutterfly/Chatbooks
4. **Revenue Impact**: Increases conversion or enables upsells

## TOP 5 FEATURES (Ranked)

### 🥇 #1: Smart Photo Suggestions (20 min)
**Why:**
- **Demand**: PRD mentions "smart algorithms + good design" as core value prop
- **Effort**: LOW - just UI badges + scoring algorithm
- **Differentiator**: HIGH - competitors don't highlight best photos
- **Revenue**: MEDIUM - reduces decision paralysis, increases conversion

**Implementation:**
- Algorithm: Score photos by quality + faces + aspect ratio
- UI: Star/badge on top 20 photos
- Auto-select if user uploads 200+ photos
- "Use only suggested photos" button

---

### 🥈 #2: Quick Reorder (15 min)
**Why:**
- **Demand**: PRD explicitly lists "Quick Reorder" in nice-to-have
- **Effort**: LOW - clone book, new session, redirect to checkout
- **Differentiator**: MEDIUM - easy to copy but good UX
- **Revenue**: HIGH - drives repeat purchases (LTV goal: 2+ books)

**Implementation:**
- Button on order history: "Reorder This Book"
- Clone book with same photos/layout
- New session token
- Skip upload, go straight to checkout

---

### 🥉 #3: Photo Quality Enhancement (15 min)
**Why:**
- **Demand**: PRD mentions "professional results" as key promise
- **Effort**: LOW - Sharp already installed, just add filters
- **Differentiator**: HIGH - most competitors don't auto-enhance
- **Revenue**: MEDIUM - better books = happier customers = more referrals

**Implementation:**
- Auto-enhance during processing (Sharp normalize + sharpen)
- Subtle: brightness +5%, saturation +10%, sharpen 1x
- Add `enhancedUrl` field to photos table
- Toggle in settings (default: ON)

---

### 🏅 #4: Google Photos Import (40 min)
**Why:**
- **Demand**: PRD lists in "Social Features" nice-to-have
- **Effort**: MEDIUM - OAuth setup + API integration
- **Differentiator**: HIGH - removes friction, huge time saver
- **Revenue**: HIGH - makes buying MUCH easier (people have 1000s of photos in Google)

**Implementation:**
- OAuth 2.0 flow (Google Cloud Console setup)
- Fetch photos from Google Photos API (last 6 months)
- Bulk download + process
- "Import from Google Photos" button on upload page

---

### 🎖️ #5: Flexible Calendar Start Month (10 min)
**Why:**
- **Demand**: Implicit - PRD targets "calendar version" as expansion
- **Effort**: VERY LOW - just UI dropdown + field
- **Differentiator**: MEDIUM - Shutterfly forces Jan 1 start
- **Revenue**: MEDIUM - enables gifting (start on birthday month)

**Implementation:**
- Add `calendarStartMonth` field to books table
- Dropdown on upload page: "Start calendar from: [January ▼]"
- Update page generation to start from selected month
- Default: current month

---

## Rejected Features (For Now)

**Instagram Import** - OAuth more complex (Facebook Graph API), fewer users
**Custom Calendar Dates** - Niche use case, complex UI
**Batch Card Sending** - New product line, too big for quick win
**Gift Scheduling** - Nice but not critical for MVP
**Family Collaboration** - Complex (sharing, real-time updates)

---

## Implementation Order

1. **Smart Photo Suggestions** (20 min) - Builds on existing quality scoring
2. **Photo Quality Enhancement** (15 min) - Integrates with upload pipeline
3. **Quick Reorder** (15 min) - Simple button + API route
4. **Flexible Calendar Start** (10 min) - UI + field only
5. **Google Photos Import** (40 min) - Most complex, biggest impact

**Total Estimated Time:** 100 minutes (1h 40m)

**Buffer for testing/debugging:** +30 min
**Documentation:** +10 min
**Git commits:** +10 min

**Grand Total:** ~2.5 hours for all 5 features

---

## Next Steps

Since research is not yet available, I'll:
1. ✅ Start implementing these 5 features NOW
2. ⏳ Monitor for research docs in parallel
3. ⏳ Adjust if research reveals different priorities
4. ✅ Document everything

**Starting implementation in 3... 2... 1...**
