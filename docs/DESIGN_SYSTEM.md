# Frametale 2026 Design System

**Premium • Fluid • Accessible**

This document outlines the complete design system modernized for 2026 standards, inspired by Apple, Linear, and Stripe's cutting-edge aesthetics.

---

## 🎨 Color Palette

### Primary Colors
Deep indigo → violet gradient for premium feel:
- `--color-primary-500`: `#8b5cf6` (Violet)
- `--color-primary-600`: `#7c3aed` (Deep Violet)
- `--color-primary-700`: `#6d28d9` (Royal Purple)

### Accent Colors
Warm amber for highlights and CTAs:
- `--color-accent-500`: `#f59e0b` (Amber)
- `--color-accent-600`: `#d97706` (Dark Amber)

### Neutral Colors
Warm-tinted grays for sophisticated neutrality:
- `--color-neutral-50`: `#fafaf9` (Off-white)
- `--color-neutral-100`: `#f5f5f4` (Light gray)
- `--color-neutral-900`: `#1c1917` (Almost black)

### Surface & Background
- `--color-surface`: `#ffffff` (Pure white)
- `--color-background`: `#fafaf9` (Warm off-white)
- `--color-foreground`: `#0a0a0a` (Near black)

### Color Philosophy
- **Removed**: All orange/pink Journi tones
- **Added**: Sophisticated violet/purple gradients for premium feel
- **Contrast**: WCAG AAA compliance (7:1+ ratios)

---

## 📝 Typography

### Font Stack
```css
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

### Fluid Typography (Responsive Sizing)
Uses `clamp()` for automatic scaling across viewports:
- Base: `clamp(1rem, 0.9rem + 0.5vw, 1.125rem)`
- Headings: `clamp(3.75rem, 3rem + 3.75vw, 4.5rem)` (H1)

### Hierarchy
- **Headings**: Font-weight 600-700, letter-spacing `-0.02em`
- **Body**: Font-weight 400, letter-spacing `0.01em`
- **Small text**: Min 14px for accessibility

### Scale
- xs: 0.75-0.875rem
- sm: 0.875-1rem
- base: 1-1.125rem
- lg: 1.125-1.25rem
- xl: 1.25-1.5rem
- 2xl: 1.5-1.875rem
- 3xl: 1.875-2.25rem
- 4xl: 2.25-3rem
- 5xl: 3-3.75rem
- 6xl: 3.75-4.5rem

---

## 🌀 Glassmorphism 2.0

### Implementation
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Variations
- **Light glass**: `rgba(255, 255, 255, 0.7)` with `12px` blur
- **Dark glass**: `rgba(0, 0, 0, 0.4)` for dark mode
- **Tinted glass**: Add color with opacity (e.g., violet-tinted)

### Usage
- Navigation bars
- Sticky CTAs
- Modal overlays
- Floating action buttons

---

## 🔘 Border Radius

### Philosophy
**Rounded everything** for organic, friendly feel:
- sm: `8px`
- md: `12px`
- lg: `16px`
- xl: `24px` (primary buttons)
- 2xl: `32px` (cards)
- 3xl: `48px` (hero elements)
- full: `9999px` (pills, tags)

---

## ✨ Shadows & Elevation

### Scale
- xs: Subtle hover states
- sm: Input fields
- md: Cards at rest
- lg: Cards on hover
- xl: Modals
- 2xl: Hero sections
- glow: `0 0 20px -5px var(--color-primary-400)` (for CTAs)

### Implementation
All shadows include color-specific variants (e.g., `shadow-violet-500/40` for glow effects).

---

## 🎬 Animations & Motion

### Principles
1. **Purposeful**: Every animation has a reason
2. **Performant**: GPU-accelerated (`transform`, `opacity`)
3. **Accessible**: Respects `prefers-reduced-motion`
4. **Spring physics**: Uses Framer Motion for natural movement

### Presets
```javascript
// Spring animation
const spring = { 
  type: "spring", 
  stiffness: 400, 
  damping: 17 
}

// Magnetic hover
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.98 }}

// Fade reveal
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

### Common Animations
- **Blob**: Organic floating background orbs
- **Shimmer**: Loading skeleton placeholder
- **Float**: Gentle up/down movement
- **Pulse-glow**: Breathing shadow effect
- **Scale-in**: Modal/card entrance

### Timing
- Fast: `150ms` (micro-interactions)
- Base: `250ms` (standard transitions)
- Slow: `350ms` (complex state changes)
- Spring: `500ms` (physics-based)

---

## 🧩 Component Patterns

### Button
```tsx
<Button variant="primary" size="lg" magnetic>
  Create Now
</Button>
```

**Variants**:
- `primary`: Violet gradient with shadow glow
- `accent`: Amber gradient
- `secondary`: Glass effect with border
- `outline`: Transparent with border
- `ghost`: No background
- `danger`: Red gradient

**Sizes**: `sm`, `md`, `lg`, `xl`

**Features**:
- Magnetic hover effect (optional)
- Spring physics on interaction
- Shadow elevation on hover
- Disabled state with opacity

### Card
```tsx
<Card glass hover>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Props**:
- `glass`: Glassmorphism effect
- `hover`: Lift on hover (default: true)

**Features**:
- 32px border radius
- Hover lift animation
- Optional backdrop blur

### Input
```tsx
<Input 
  placeholder="Enter email..." 
  error={hasError}
/>
```

**Features**:
- 24px border radius
- Focus ring with color glow (4px)
- Error state styling
- Floating label support (future)

### Bento Grid
Asymmetric card layouts:
```tsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
  <div className="md:col-span-7 md:row-span-2">Large card</div>
  <div className="md:col-span-5">Small card</div>
  <div className="md:col-span-5">Small card</div>
</div>
```

---

## ♿ Accessibility

### Non-Negotiable Requirements

1. **Focus Indicators**
   - All interactive elements have visible focus states
   - 2px outline with 2px offset
   - Violet-500 color for consistency

2. **Color Contrast**
   - Text: Minimum 7:1 (WCAG AAA)
   - Large text: Minimum 4.5:1
   - Interactive elements: Minimum 3:1

3. **Motion**
   - All animations respect `prefers-reduced-motion`
   - Fallback to instant state changes

4. **Keyboard Navigation**
   - Tab order follows visual flow
   - Skip-to-content link on all pages
   - ARIA labels on icon-only buttons

5. **Screen Readers**
   - Semantic HTML (`<main>`, `<nav>`, `<section>`)
   - ARIA labels where needed
   - `alt` text on all images

---

## 📱 Responsive Breakpoints

### Mobile-First Approach
```css
/* Base styles for mobile (375px+) */

@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1440px) {
  /* Large desktop */
}
```

### Fluid Spacing
Uses `clamp()` for padding/margin that scales smoothly.

---

## 🚫 Removed Elements (2026 Cleanup)

### AI Language Purge
**Removed everywhere**:
- "AI-powered"
- "Smart AI"
- "Powered by AI"
- AI icons/badges

**Replaced with**:
- "Intelligent layout engine"
- "Automatic arrangement"
- "Advanced algorithms"
- "Smart quality checks"

### Design Updates
- **Old**: Warm orange/pink Journi tones
- **New**: Violet/purple premium gradients

- **Old**: Sharp corners (8px max)
- **New**: Generous rounding (24-32px)

- **Old**: Flat colors
- **New**: Gradients + glassmorphism

---

## 🎯 Design Tokens Quick Reference

```css
/* Colors */
--color-primary-600: #7c3aed;
--color-accent-500: #f59e0b;
--color-neutral-900: #1c1917;

/* Spacing */
--space-4: 1rem;
--space-8: 2rem;
--space-16: 4rem;

/* Radius */
--radius-xl: 24px;
--radius-2xl: 32px;

/* Shadows */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-glow: 0 0 20px -5px var(--color-primary-400);

/* Blur */
--blur-surface: 12px;

/* Transitions */
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 🛠️ Implementation Notes

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (CSS-first config)
- **Animation**: Framer Motion
- **Physics**: @react-spring/web (future)
- **Gestures**: @use-gesture/react (future)

### Browser Support
- Chrome/Edge 120+
- Safari 17+
- Firefox 120+

### Performance
- All animations GPU-accelerated
- Lazy loading for images
- Code splitting per route
- Optimized for Core Web Vitals

---

## 📚 Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Framer Motion API](https://www.framer.com/motion/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Fluid Typography Calculator](https://modern-fluid-typography.vercel.app/)

---

**Last Updated**: February 15, 2026
**Version**: 2.0.0
**Maintained by**: Frametale Design Team
