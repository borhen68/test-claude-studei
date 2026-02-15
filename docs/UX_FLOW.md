# Frametale - UX Flow & Wireframes

**Version:** 2.0  
**Last Updated:** February 15, 2026  

---

## Design Principles

1. **Radically Simple** - Every extra click is a conversion killer
2. **Trust Through Transparency** - Show exactly what they're getting
3. **Speed Above All** - No step should take >5 seconds
4. **Mobile-First** - 70% of traffic will be mobile
5. **Delight, Don't Overwhelm** - One moment of magic, not constant fireworks

---

## User Journey Map

```
┌──────────────┐
│  Discovery   │  Social media, ad, word-of-mouth
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Landing Page │  Value prop, examples, "Start Your Book"
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Upload    │  Drag & drop photos (20-200)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Processing  │  "Creating your book..." (10-30 seconds)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Preview    │  Flip through book, see every page
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Checkout   │  Shipping address, Stripe payment
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Confirmation │  Order number, tracking, share link
└──────────────┘
```

**Total time goal: <3 minutes from landing to purchase**

---

## Page-by-Page Wireframes

### 1. Landing Page

**Hero Section:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│    Turn Your Photos Into a Beautiful Book      │
│           in Less Than 3 Minutes                │
│                                                 │
│   [Upload Your Photos]  ← Big, obvious CTA     │
│                                                 │
│   ┌─────┐  ┌─────┐  ┌─────┐  ← Example books  │
│   │ img │  │ img │  │ img │                    │
│   └─────┘  └─────┘  └─────┘                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

**How It Works (3 steps):**
```
┌─────────────────────────────────────────────────┐
│  1️⃣ Upload Photos      2️⃣ We Design It       │
│     │                      │                     │
│  [📸 icon]            [✨ icon]                 │
│     │                      │                     │
│  Drag & drop          Smart layout              │
│  20-200 photos        Professional design       │
│                           │                     │
│                           ▼                     │
│                   3️⃣ Receive Your Book          │
│                       [📦 icon]                  │
│                   Ships in 5-7 days             │
│                   $39, that's it                │
└─────────────────────────────────────────────────┘
```

**Social Proof:**
```
┌─────────────────────────────────────────────────┐
│  ⭐⭐⭐⭐⭐  "So easy! Took me 2 minutes"        │
│  — Sarah M., verified customer                  │
│                                                 │
│  ⭐⭐⭐⭐⭐  "Better than Shutterfly, way faster" │
│  — Mike K., verified customer                   │
└─────────────────────────────────────────────────┘
```

**Pricing (No Tricks):**
```
┌─────────────────────────────────────────────────┐
│               One Book, One Price               │
│                                                 │
│                     $39                         │
│                                                 │
│  ✓ 8x8" hardcover, 20-60 pages                 │
│  ✓ Premium paper, lay-flat binding             │
│  ✓ Ships in 5-7 business days                  │
│  ✓ No hidden fees, no upsells                  │
│                                                 │
│            [Start Your Book]                    │
└─────────────────────────────────────────────────┘
```

**Footer:**
- FAQ (How long does it take? Can I edit? etc.)
- Examples (link to gallery)
- About (our story, values)
- Contact

---

### 2. Upload Page

**Initial State:**
```
┌─────────────────────────────────────────────────┐
│  ← Back                                         │
│                                                 │
│          Drop Your Photos Here                  │
│                                                 │
│   ┌───────────────────────────────────────┐    │
│   │                                       │    │
│   │         [📸 Cloud icon]               │    │
│   │                                       │    │
│   │    Drag & drop 20-200 photos          │    │
│   │    or click to browse                 │    │
│   │                                       │    │
│   │    JPG, PNG, HEIC • Max 20MB each     │    │
│   │                                       │    │
│   └───────────────────────────────────────┘    │
│                                                 │
│   Or connect:                                   │
│   [Google Photos] [Instagram] [iCloud]          │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Uploading State:**
```
┌─────────────────────────────────────────────────┐
│  ← Back                                         │
│                                                 │
│          Uploading Your Photos...               │
│                                                 │
│   ████████████████░░░░░░  67% (45/67)          │
│                                                 │
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ← Thumbnails       │
│   │✓ │ │✓ │ │✓ │ │⟳│ │  │    appear as        │
│   └──┘ └──┘ └──┘ └──┘ └──┘    uploaded        │
│                                                 │
│   [Cancel Upload]                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Upload Complete:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│          ✓ 67 Photos Uploaded!                  │
│                                                 │
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                     │
│   │  │ │  │ │  │ │  │ │  │ (grid of thumbs)   │
│   └──┘ └──┘ └──┘ └──┘ └──┘                     │
│                                                 │
│   [Create My Book] ← Primary CTA                │
│                                                 │
│   Want to add more? [Upload More Photos]       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### 3. Processing Page

**Loading State:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│        Creating Your Book...                    │
│                                                 │
│            [✨ Animated icon]                    │
│                                                 │
│   Analyzing your photos...                      │
│   ████████████████████████  Done ✓             │
│                                                 │
│   Choosing the best layouts...                  │
│   ████████████░░░░░░░░░░░░  45%                │
│                                                 │
│   Creating your book preview...                 │
│   ░░░░░░░░░░░░░░░░░░░░░░░░  0%                 │
│                                                 │
│          This usually takes 10-20 seconds       │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Note:** This page is critical for setting expectations. Users must feel like something smart is happening, not just a spinner.

---

### 4. Preview Page

**Book Viewer:**
```
┌─────────────────────────────────────────────────┐
│  ← Back to Edit                    [Buy $39] ← │
│                                                 │
│   Your Book Preview (24 pages)                  │
│                                                 │
│   ┌─────────────────────────────────────────┐  │
│   │                                         │  │
│   │         [Book cover image]              │  │
│   │                                         │  │
│   │         "Summer 2025"                   │  │
│   │         Your Photos                     │  │
│   │                                         │  │
│   └─────────────────────────────────────────┘  │
│                                                 │
│      ◀  Page 1 of 24  ▶                        │
│                                                 │
│   Looks good? [Buy Now $39]                     │
│   Not quite right? [Adjust Photos/Theme]        │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Page Flipper (Interactive):**
- Swipe gesture on mobile
- Arrow keys on desktop
- Click page edges to flip
- Zoom to see full-res preview

**Mini Edit Panel (Optional, MVP v2):**
```
┌─────────────────────────────────────────────────┐
│  Customize (Optional)                           │
│                                                 │
│  Theme:  ○ Warm  ● Cool  ○ B&W  ○ Vintage       │
│                                                 │
│  Cover Text: [Your Photos                    ]  │
│                                                 │
│  [Reorder Photos] [Change Theme]                │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### 5. Checkout Page

**Stripe Embedded Checkout (Recommended):**
```
┌─────────────────────────────────────────────────┐
│  ← Back to Preview                              │
│                                                 │
│  Checkout                                       │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Order Summary                          │   │
│  │                                         │   │
│  │  Frametale Book (8x8", 24 pages)  $39   │   │
│  │  Shipping (US, 5-7 days)          Free  │   │
│  │                                   ────   │   │
│  │  Total                            $39   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  [Stripe Embedded Checkout Form]        │   │
│  │  - Email                                │   │
│  │  - Shipping address                     │   │
│  │  - Payment method                       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Complete Purchase]                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Trust Signals:**
- 🔒 Secure checkout (Stripe)
- 💳 All major cards accepted
- 📦 Ships in 5-7 business days
- 💯 100% satisfaction guarantee

---

### 6. Confirmation Page

**Success State:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              ✓ Order Confirmed!                 │
│                                                 │
│   Your book is being printed and will ship in   │
│   5-7 business days.                            │
│                                                 │
│   Order #: 2024-0215-ABC123                     │
│   Tracking: We'll email you when it ships       │
│                                                 │
│   ┌─────────────────────────────────────────┐  │
│   │  [Preview of their book cover]          │  │
│   └─────────────────────────────────────────┘  │
│                                                 │
│   📧 Confirmation sent to: user@email.com       │
│                                                 │
│   [Make Another Book]  [Track Order]            │
│                                                 │
│   Love it? Share with friends:                  │
│   [Facebook] [Twitter] [Email]                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Mobile Responsive Design

**Key Differences:**
- Larger touch targets (min 44x44px)
- Simplified navigation (hamburger menu)
- Vertical layout (no side-by-side)
- Bottom sheet UI for actions
- Native-feeling gestures (swipe to flip pages)

**Upload Page (Mobile):**
```
┌─────────────────┐
│  ← Back         │
│                 │
│  Upload Photos  │
│                 │
│  ┌───────────┐  │
│  │           │  │
│  │ [📸 icon] │  │
│  │           │  │
│  │ Tap to    │  │
│  │ select    │  │
│  │ photos    │  │
│  │           │  │
│  └───────────┘  │
│                 │
│  Or use:        │
│  [Camera]       │
│  [Google Photos]│
│  [Instagram]    │
│                 │
└─────────────────┘
```

---

## Interactions & Animations

**Key Animations:**

1. **Upload Progress**
   - Smooth progress bar (not jumpy)
   - Thumbnails fade in as uploaded
   - Subtle checkmark animation on complete

2. **Processing**
   - Pulsing/breathing animation on icon
   - Step-by-step progress (not just spinner)
   - Micro-copy that builds anticipation

3. **Page Flip**
   - Smooth page-turn animation (not instant cut)
   - Subtle shadow/depth effect
   - Swipe gesture on mobile (natural feel)

4. **Checkout Success**
   - Confetti animation (brief, tasteful)
   - Checkmark scale-in
   - Gentle fade-in of confirmation details

**No animations on:**
- Critical actions (buy button)
- Error states (instant feedback)
- Loading states >2 seconds (show progress, not spinner)

---

## Error States

**Upload Errors:**
```
┌─────────────────────────────────────────────────┐
│  ⚠️ Some photos couldn't be uploaded            │
│                                                 │
│  • vacation.jpg - File too large (25MB max 20MB)│
│  • photo.tiff - Unsupported format (use JPG/PNG)│
│                                                 │
│  67 photos uploaded successfully.               │
│                                                 │
│  [Continue with 67 photos] [Try Again]          │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Payment Errors:**
```
┌─────────────────────────────────────────────────┐
│  ⚠️ Payment failed                               │
│                                                 │
│  Your card was declined. Please:                │
│  • Check your card details                      │
│  • Try a different card                         │
│  • Contact your bank                            │
│                                                 │
│  [Try Again] [Use Different Card]               │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Processing Errors:**
```
┌─────────────────────────────────────────────────┐
│  ⚠️ Something went wrong                         │
│                                                 │
│  We couldn't process your photos. This is       │
│  usually temporary.                             │
│                                                 │
│  Error code: IMG-501                            │
│                                                 │
│  [Try Again] [Contact Support]                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Accessibility

**WCAG 2.1 AA Compliance:**
- ✅ Color contrast 4.5:1 minimum
- ✅ Keyboard navigation (tab order)
- ✅ Screen reader support (ARIA labels)
- ✅ Focus indicators (visible outlines)
- ✅ Alt text on all images
- ✅ Form labels and error messages

**Key Areas:**
- Upload: Drag-drop alternative (click to browse)
- Preview: Keyboard arrows to flip pages
- Checkout: Stripe form is accessible by default
- All CTAs: Large enough for motor impairments

---

## Copy & Tone

**Voice:**
- Friendly, not corporate
- Honest, not salesy
- Simple, not dumbed-down
- Confident, not arrogant

**Examples:**

❌ "Leverage AI-powered algorithms to curate your memories"
✅ "We'll sort your photos and design a beautiful book"

❌ "Experience unparalleled quality"
✅ "Premium paper, professional printing"

❌ "Transform your digital assets into tangible keepsakes"
✅ "Turn your photos into a book you'll actually keep"

---

## Next Steps

1. ✅ Approve UX flow
2. ⏳ Create high-fidelity mockups (Figma)
3. ⏳ Build component library (shadcn/ui + Tailwind)
4. ⏳ Implement pages in Next.js
5. ⏳ User testing with prototype
6. ⏳ Iterate based on feedback

**Next Document:** DATA_MODEL.md
