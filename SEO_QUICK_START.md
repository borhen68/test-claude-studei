# SEO Quick Start Guide - Frametale

## ✅ What's Already Done

- ✅ Complete metadata system
- ✅ Structured data schemas
- ✅ Sitemap & robots.txt
- ✅ Google Analytics 4 setup
- ✅ 8 SEO blog posts (ready to publish)
- ✅ Performance optimizations
- ✅ How It Works page
- ✅ Photo Books product page
- ✅ SEO components

## 🚀 Quick Implementation Steps

### 1. Add Google Analytics ID (2 minutes)

Add to `.env.local`:
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Get your GA4 ID from: https://analytics.google.com/

### 2. Create Social Media Images (15 minutes)

Create these images (1200x630px) and save to `/public/`:
- `og-image.jpg` - Homepage
- `og-photo-books.jpg` - Photo books page
- `og-calendars.jpg` - Calendars page
- `og-cards.jpg` - Cards page
- `og-blog.jpg` - Blog default
- `twitter-image.jpg` - Twitter card

**Tools**: Use Canva, Figma, or any design tool.

### 3. Submit Sitemap to Google (5 minutes)

1. Go to https://search.google.com/search-console
2. Add property: `https://frametale.com`
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: `https://frametale.com/sitemap.xml`

### 4. Test Everything (10 minutes)

Run these tests:

**Structured Data**:
```bash
# Open in browser:
https://search.google.com/test/rich-results
# Test: https://frametale.com/products/photo-books
```

**Page Speed**:
```bash
# Open in browser:
https://pagespeed.web.dev/
# Test: https://frametale.com
```

**Mobile Friendly**:
```bash
# Open in browser:
https://search.google.com/test/mobile-friendly
# Test: https://frametale.com
```

### 5. Build & Deploy (5 minutes)

```bash
cd /root/.openclaw/workspace/frametale
npm run build
# Deploy to your hosting (Vercel, Netlify, etc.)
```

## 📝 Optional Enhancements

### Create More Product Pages (20 minutes)

Copy `src/app/products/photo-books/page.tsx` to:
- `src/app/products/calendars/page.tsx` (change metadata to 'calendars')
- `src/app/products/cards/page.tsx` (change metadata to 'cards')

### Add More Static Pages (30 minutes)

Create these pages using the metadata from `staticPageMetadata`:
- `src/app/pricing/page.tsx`
- `src/app/gallery/page.tsx`
- `src/app/about/page.tsx`
- `src/app/faq/page.tsx`

Each page should:
```typescript
import { staticPageMetadata } from '@/lib/seo/metadata';
export const metadata = staticPageMetadata['page-name'];
```

### Implement Blog System (1-2 hours)

1. Install a markdown processor:
```bash
npm install gray-matter remark remark-html
```

2. Create blog index page: `src/app/blog/page.tsx`
3. Create dynamic blog route: `src/app/blog/[slug]/page.tsx`
4. Use the 8 blog posts in `src/content/blog/`

## 📊 Track Your Progress

### Week 1:
- [ ] Set up Google Analytics
- [ ] Create OG images
- [ ] Submit sitemap to Search Console
- [ ] Test all structured data

### Week 2:
- [ ] Monitor Search Console for indexing
- [ ] Check keyword rankings (baseline)
- [ ] Review analytics data

### Month 1:
- [ ] Create 2-4 more blog posts
- [ ] Build internal links
- [ ] Monitor organic traffic growth
- [ ] Check for any crawl errors

### Month 3:
- [ ] Review keyword rankings progress
- [ ] Update old content
- [ ] Create more landing pages
- [ ] Build backlinks (guest posts, partnerships)

## 🎯 Target Metrics

### Technical (Immediate):
- ✅ All pages indexed in Google
- ✅ No structured data errors
- ✅ Core Web Vitals: All green
- ✅ Mobile-friendly: Pass
- ✅ Page speed: 90+ (mobile)

### Traffic (3-6 months):
- 📊 Organic traffic: +200%
- 📊 Top 10 rankings: 5-10 keywords
- 📊 Blog traffic: 500+ visits/month
- 📊 Conversion rate: 2-5%

### Rankings (6-12 months):
- 🎯 "custom photo book" - Top 3
- 🎯 "photo calendar 2026" - Top 3
- 🎯 "make a photo book" - Top 5
- 🎯 Long-tail keywords - Multiple #1 rankings

## 🛠️ Tools You'll Need

### Free Tools:
- Google Search Console (required)
- Google Analytics 4 (required)
- Google PageSpeed Insights
- Mobile-Friendly Test
- Rich Results Test

### Paid Tools (Optional):
- Ahrefs or SEMrush (keyword research, $99-199/month)
- Screaming Frog ($149/year, free version available)

## ❓ Quick Troubleshooting

### "Sitemap not found"
- Check file exists: `/root/.openclaw/workspace/frametale/src/app/sitemap.ts`
- Rebuild: `npm run build`
- Check URL: `https://frametale.com/sitemap.xml`

### "Structured data errors"
- Test with: https://search.google.com/test/rich-results
- Check console for errors
- Validate JSON-LD syntax

### "Pages not indexing"
- Submit URLs manually in Search Console
- Check robots.txt isn't blocking
- Ensure meta robots allows indexing

### "Low page speed"
- Optimize images (already using WebP/AVIF)
- Check for large JavaScript bundles
- Enable caching on hosting

## 📞 Support

- Documentation: `SEO_IMPLEMENTATION.md`
- Blog content: `src/content/blog/`
- Components: `src/components/seo/` and `src/lib/seo/`

## 🎉 You're Done When:

- ✅ Google Analytics tracking page views
- ✅ Sitemap submitted and indexed
- ✅ All structured data passing tests
- ✅ Core Web Vitals all green
- ✅ First blog post live
- ✅ Tracking keyword rankings

**Estimated Total Time**: 1-2 hours for basic setup, then ongoing content creation.

**Expected Results**: Significant organic traffic growth within 3-6 months, #1 rankings for target keywords within 6-12 months.

---

Need help? Review `SEO_IMPLEMENTATION.md` for detailed documentation.
