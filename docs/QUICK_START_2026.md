# 🚀 Quick Start: Using the 2026 Design System

For developers building new features with the modernized Frametale design.

---

## 🎨 Using Design Tokens

### Import in Your Component
```tsx
// Automatically available via globals.css
// No imports needed—just use Tailwind classes
```

### Common Patterns

#### Buttons
```tsx
import { Button } from '@/components/ui/button';

// Primary CTA
<Button variant="primary" size="lg" magnetic>
  Create Book
</Button>

// Secondary action
<Button variant="secondary" size="md">
  Learn More
</Button>

// Accent (warm amber)
<Button variant="accent" size="lg">
  Special Offer
</Button>
```

#### Cards
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Glass effect card
<Card glass hover>
  <CardHeader>
    <CardTitle>Premium Feature</CardTitle>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
</Card>

// Solid card
<Card hover>
  <CardContent>Simple card</CardContent>
</Card>
```

#### Inputs
```tsx
import { Input } from '@/components/ui/input';

<Input 
  placeholder="Enter email..."
  error={!!errors.email}
/>
```

---

## 🎬 Adding Animations

### Basic Fade-In
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content fades in smoothly
</motion.div>
```

### Magnetic Hover
```tsx
<motion.button
  className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl px-8 py-4"
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Magnetic Button
</motion.button>
```

### Stagger Children
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## 🌈 Color Usage

### Gradients (2026 Standard)
```tsx
// Primary gradient (violet → purple)
className="bg-gradient-to-br from-violet-600 to-purple-700"

// Accent gradient (amber → orange)
className="bg-gradient-to-br from-amber-500 to-orange-600"

// Success gradient
className="bg-gradient-to-br from-green-600 to-emerald-700"

// Surface gradient (subtle)
className="bg-gradient-to-br from-neutral-50 to-violet-50/30"
```

### Text Gradients
```tsx
<h1 className="text-6xl font-bold bg-gradient-to-br from-violet-900 to-purple-700 bg-clip-text text-transparent">
  Gradient Text
</h1>
```

---

## 🪟 Glassmorphism

### Manual Implementation
```tsx
<div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-8">
  Glass effect content
</div>
```

### Using Utility Class
```tsx
<div className="glass rounded-3xl p-8">
  Glass content (defined in globals.css)
</div>
```

---

## 📏 Spacing & Sizing

### Border Radius (2026 Standard)
```tsx
className="rounded-xl"    // 12px - small elements
className="rounded-2xl"   // 24px - buttons
className="rounded-3xl"   // 32px - cards
className="rounded-full"  // Pills, avatars
```

### Shadows
```tsx
className="shadow-lg"     // Cards at rest
className="shadow-xl"     // Cards on hover
className="shadow-2xl"    // Modals, hero sections
```

### Hover Elevation
```tsx
className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
```

---

## ♿ Accessibility Checklist

When building a new component:

```tsx
// ✅ DO THIS
<button 
  className="focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
  aria-label="Descriptive action"
>
  <Icon />
</button>

// ❌ NOT THIS
<button>
  <Icon />
</button>
```

### Reduce Motion Support
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 0.6,
    // Respects prefers-reduced-motion
  }}
>
```

Tailwind's `transition` classes automatically respect `prefers-reduced-motion`.

---

## 📱 Responsive Design

### Mobile-First Approach
```tsx
<div className="
  text-base         /* Mobile: 16px */
  md:text-lg        /* Tablet: 18px */
  lg:text-xl        /* Desktop: 20px */
">
  Responsive text
</div>
```

### Fluid Typography
```tsx
// Use heading tags—already fluid via globals.css
<h1>Automatically fluid (clamp-based)</h1>
<h2>No breakpoints needed</h2>
```

---

## 🎯 Common Patterns

### Hero Section
```tsx
<section className="relative py-20 overflow-hidden bg-gradient-to-br from-violet-50 to-amber-50/30">
  {/* Animated blobs */}
  <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl animate-blob" />
  
  <div className="relative max-w-7xl mx-auto px-6">
    <motion.h1 
      className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-violet-900 to-purple-700 bg-clip-text text-transparent"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Hero Title
    </motion.h1>
  </div>
</section>
```

### Bento Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
  {/* Large feature */}
  <div className="md:col-span-7 md:row-span-2 bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-10">
    Large card
  </div>
  
  {/* Small cards */}
  <div className="md:col-span-5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8">
    Small card
  </div>
  <div className="md:col-span-5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8">
    Small card
  </div>
</div>
```

### Floating CTA (Sticky)
```tsx
<div className="sticky bottom-8 bg-white/80 backdrop-blur-lg border-2 border-neutral-200 rounded-3xl p-6 shadow-2xl">
  <Button variant="primary" size="lg" magnetic>
    Continue
  </Button>
</div>
```

---

## 🚫 What NOT to Do

### ❌ Avoid Flat Colors
```tsx
// Bad
<button className="bg-blue-600">Click</button>

// Good
<button className="bg-gradient-to-br from-violet-600 to-purple-700">Click</button>
```

### ❌ Avoid Small Border Radius
```tsx
// Bad
<div className="rounded-lg">Card</div>

// Good
<div className="rounded-3xl">Card</div>
```

### ❌ Avoid AI Language
```tsx
// Bad
<p>AI-powered smart suggestions</p>

// Good
<p>Intelligent automatic suggestions</p>
```

### ❌ Avoid Missing Accessibility
```tsx
// Bad
<button><Icon /></button>

// Good
<button aria-label="Upload photo">
  <Icon />
</button>
```

---

## 📚 Reference Links

- **Full Design System**: See `docs/DESIGN_SYSTEM.md`
- **Before/After**: See `docs/BEFORE_AFTER.md`
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind v4**: https://tailwindcss.com/docs

---

## 💡 Pro Tips

1. **Use `motion` for everything interactive**: Buttons, cards, modals
2. **Default to glassmorphism**: `glass` prop on cards, backdrops
3. **Always add hover states**: Scale/translate/shadow
4. **Think in gradients**: Replace solid colors with subtle gradients
5. **Respect reduce-motion**: Tailwind handles it automatically

---

**Happy Building!** 🚀

Questions? Refer to component source in `src/components/ui/` for implementation details.
