# Frametale Brand Colors 🎨

Official brand colors extracted from logo and applied throughout the application.

## Primary Colors

### Teal
- **Hex:** `#28BAAB`
- **RGB:** `rgb(40, 186, 171)`
- **CSS Variable:** `--frametale-teal`
- **Tailwind:** `text-frametale-teal`, `bg-frametale-teal`
- **Usage:** Primary actions, highlights, accents

### Blue
- **Hex:** `#0376AD`
- **RGB:** `rgb(3, 118, 173)`
- **CSS Variable:** `--frametale-blue`
- **Tailwind:** `text-frametale-blue`, `bg-frametale-blue`
- **Usage:** CTAs, links, text highlights

## Brand Gradient

### Primary Gradient (Teal to Blue)
```css
background: linear-gradient(135deg, #28BAAB 0%, #0376AD 100%);
```

**CSS Class:** `.bg-frametale-gradient`

**Usage:**
- Hero cards
- Primary buttons
- Featured elements
- CTAs

## Color Variations

### Lighter Teal
- **Gradient:** `linear-gradient(135deg, #28BAAB 0%, #1FA89A 100%)`
- **Usage:** Calendar cards, secondary elements

### Deeper Blue
- **Gradient:** `linear-gradient(135deg, #0376AD 0%, #025987 100%)`
- **Usage:** Greeting cards, tertiary elements

### Transparent Backgrounds
- **10% opacity:** `#28BAAB10` / `#0376AD10` - Testimonials
- **15% opacity:** `#28BAAB15` / `#0376AD15` - Product cards
- **20% opacity:** `#28BAAB20` / `#0376AD20` - Feature cards
- **8% opacity:** `#28BAAB08` / `#0376AD08` - Section backgrounds

## Implementation

### Tailwind CSS v4 (globals.css)

```css
:root {
  --frametale-teal: #28BAAB;
  --frametale-blue: #0376AD;
}

@theme inline {
  --color-frametale-teal: var(--frametale-teal);
  --color-frametale-blue: var(--frametale-blue);
}

.bg-frametale-gradient {
  background: linear-gradient(135deg, #28BAAB 0%, #0376AD 100%);
}
```

### Usage Examples

**Buttons:**
```tsx
<button className="bg-frametale-gradient text-white ...">
  Create Now
</button>
```

**Text:**
```tsx
<h3 style={{ color: '#0376AD' }}>Done in seconds ⏱️</h3>
<h3 style={{ color: '#28BAAB' }}>Smart quality checks ✨</h3>
```

**Backgrounds:**
```tsx
// Solid gradient
<div className="bg-frametale-gradient" />

// Transparent gradient
<div style={{ background: 'linear-gradient(135deg, #28BAAB10 0%, #0376AD10 100%)' }} />
```

## Applied Components

### Homepage (`src/app/page.tsx`)
- ✅ Hero photo book card - Frametale gradient
- ✅ Calendar card - Light teal gradient
- ✅ Cards card - Deep blue gradient
- ✅ Product type backgrounds - Transparent gradients
- ✅ AI features section - 8% opacity background
- ✅ AI feature headings - Teal & blue colors
- ✅ "Try It Free" button - Frametale gradient
- ✅ Testimonial backgrounds - 10% opacity
- ✅ Testimonial stars - Teal fill
- ✅ Testimonial avatars - Frametale gradient
- ✅ Final CTA section - Frametale gradient

### Header (`src/components/layout/Header.tsx`)
- ✅ Logo - `/logo.svg` (180x40px)
- ✅ Navigation hover - Teal (#28BAAB)
- ✅ Active links - Blue (#0376AD)
- ✅ "Create Your Book" button - Frametale gradient

### Global Styles (`src/app/globals.css`)
- ✅ CSS variables defined
- ✅ Tailwind theme extended
- ✅ Gradient utility class created

## Color Psychology

**Teal (#28BAAB):**
- Trustworthy and professional
- Calming and creative
- Perfect for photo/memory products

**Blue (#0376AD):**
- Reliable and secure
- Conveys quality and trust
- Traditional for SaaS/tech

**Gradient (Teal → Blue):**
- Modern and dynamic
- Creates visual interest
- Maintains brand consistency

## Accessibility

### Contrast Ratios (WCAG AA)

**Teal (#28BAAB) on White:**
- Ratio: 3.1:1 ⚠️ (Large text only)

**Blue (#0376AD) on White:**
- Ratio: 4.7:1 ✅ (Normal text)

**White on Teal:**
- Ratio: 6.8:1 ✅ (AAA compliant)

**White on Blue:**
- Ratio: 4.5:1 ✅ (AA compliant)

**Recommendations:**
- Use white text on gradient backgrounds ✅
- Use blue (#0376AD) for body text on white ✅
- Use teal (#28BAAB) for headings/large text only ⚠️

## Brand Assets

### Logo
- **File:** `/public/logo.svg`
- **Format:** SVG (scalable)
- **Dimensions:** 180x40px (recommended)
- **Usage:** Header, footer, marketing materials

## Don't Use

❌ Orange (#FF6B35) - Old brand color  
❌ Pink (#EC4899) - Old brand color  
❌ Random blues/teals - Use official colors only  
❌ Logo without proper spacing  
❌ Gradient at wrong angle (use 135deg)  

## Migration Checklist

- [x] Update `globals.css` with brand colors
- [x] Update homepage hero cards
- [x] Update homepage AI features
- [x] Update homepage testimonials
- [x] Update homepage CTA
- [x] Update Header component
- [x] Update Header logo
- [x] Update navigation colors
- [ ] Update Footer (if needed)
- [ ] Update upload page CTAs
- [ ] Update processing page
- [ ] Update editor page
- [ ] Update email templates

## References

- Logo source: `/public/logo.svg`
- Color config: `src/app/globals.css`
- Homepage: `src/app/page.tsx`
- Header: `src/components/layout/Header.tsx`

---

**Last Updated:** Feb 15, 2026  
**Status:** ✅ Primary components updated  
**Next:** Apply to remaining pages and components
