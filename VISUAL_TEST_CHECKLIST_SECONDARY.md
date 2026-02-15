# Visual Testing Checklist - Secondary Pages

Run through these pages in browser to verify 2026 design implementation:

## Auth Pages
- [ ] `/login` - Check glassmorphic card, floating labels, gradient orbs animate
- [ ] `/signup` - Verify password strength indicator works
- [ ] `/forgot-password` - Test success state shows green checkmark
- [ ] `/verify-email` - Confirm spinner shows during verification

## Dashboard Pages
- [ ] `/dashboard` - Verify bento grid layout, stat cards render correctly
- [ ] `/dashboard/books` - Check book grid, hover effects scale images
- [ ] `/dashboard/orders` - Test timeline progress bar, filter tabs animate
- [ ] `/dashboard/settings` - Verify toggle switch animates, floating labels work
- [ ] `/dashboard/billing` - Check invoice table renders

## Dashboard Layout
- [ ] Desktop: Horizontal tabs with animated underline
- [ ] Mobile: Hamburger menu slides in/out
- [ ] User avatar shows correct initials
- [ ] Sticky header stays at top on scroll

## Marketing Pages
- [ ] `/pricing` - Verify ring appears around selected size card
- [ ] `/gallery` - Test masonry grid, category filter animates
- [ ] `/contact` - Check form submits, success state appears
- [ ] `/shipping` - Verify icon cards display correctly

## Legal Pages
- [ ] `/privacy` - Check typography hierarchy, Shield icon renders
- [ ] `/terms` - Verify FileText icon, section animations

## Cross-cutting Concerns
- [ ] All pages: Glassmorphism (backdrop-filter) renders
- [ ] All pages: Violet/indigo gradients display correctly
- [ ] All pages: Mobile responsive (test at 375px, 768px, 1440px)
- [ ] All pages: Focus indicators appear on tab navigation
- [ ] All pages: No "AI" language visible
- [ ] All pages: Smooth transitions (check prefers-reduced-motion)

## Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance
- [ ] Lighthouse score > 90
- [ ] No layout shift during load
- [ ] Animations run at 60fps
- [ ] Images lazy-load correctly

---

**If any issues found, document here:**

1. 
2. 
3. 

---

**Visual QA Completed By:** _____________  
**Date:** _____________  
**Status:** [ ] Pass [ ] Needs fixes
