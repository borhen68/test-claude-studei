# Frametale Website - Quick Start Guide

## 🚀 What's Been Built

A **complete company website** with:
- 12 public pages (About, How It Works, Pricing, Gallery, Blog, Contact, FAQ, Terms, Privacy, Shipping, etc.)
- Full blog system with markdown support
- Contact form
- Newsletter signup
- Customer testimonials/reviews
- Admin CMS for managing all content
- Complete API backend

## 📂 Pages Overview

### Public Pages
| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Hero, features, testimonials, CTA |
| About | `/about` | Company story, team, values |
| How It Works | `/how-it-works` | 4-step process explanation |
| Pricing | `/pricing` | Product pricing with add-ons |
| Gallery | `/gallery` | Example photo books |
| Blog List | `/blog` | All blog posts |
| Blog Post | `/blog/[slug]` | Individual articles |
| Contact | `/contact` | Contact form |
| FAQ | `/faq` | Categorized questions |
| Terms | `/terms` | Terms of service |
| Privacy | `/privacy` | Privacy policy |
| Shipping | `/shipping` | Delivery info |

### Admin Pages
| Page | URL | Access |
|------|-----|--------|
| Blog Management | `/admin/blog` | CRUD for blog posts |
| Content Editor | `/admin/content` | Edit page copy |
| Testimonials | `/admin/testimonials` | Manage reviews |
| Newsletter | `/admin/newsletter` | Subscriber list |

### API Routes
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/blog` | GET | List blog posts |
| `/api/blog/[slug]` | GET | Get single post |
| `/api/contact` | POST | Submit contact form |
| `/api/newsletter` | POST | Subscribe to newsletter |
| `/api/testimonials` | GET, POST | List/create reviews |
| `/api/admin/blog` | GET, POST, PUT, DELETE | Blog CRUD |

## 🎨 Design System

### Colors
- Primary: Blue-600 (`#2563eb`)
- Secondary: Purple-600 (`#9333ea`)
- Text: Gray-900, Gray-600
- Background: White, Gray-50
- Success: Green-600
- Warning: Yellow-400

### Typography
- Font: Geist Sans (modern, clean)
- Headings: 5xl (homepage), 3xl (sections), xl (cards)
- Body: base, lg (hero text)

### Spacing
- Sections: py-20, py-24
- Containers: max-w-7xl, max-w-4xl
- Cards: p-6, p-8
- Gaps: gap-6, gap-8, gap-12

### Components
```tsx
// Card
<div className="bg-white rounded-xl p-6 border border-gray-200">

// Button Primary
<button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500">

// Button Secondary
<button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-50">

// Badge
<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">

// Gradient Hero
<div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
```

## 📊 Mock Data

Located in `src/lib/data/mock-data.ts`:

```typescript
// Blog posts (3 complete articles)
export const mockBlogPosts: BlogPost[] = [...]

// Testimonials (5 customer reviews)
export const mockTestimonials: Testimonial[] = [...]

// Gallery items (6 example books)
export const galleryImages = [...]
```

## 🔧 How to Customize

### 1. Update Homepage Content
Edit `src/app/page.tsx`:
```typescript
<h1>Turn Your Photos Into Beautiful Books</h1>
<p>AI-powered photo book creator...</p>
```

### 2. Add Blog Posts
```typescript
// src/lib/data/mock-data.ts
mockBlogPosts.push({
  slug: 'your-post-slug',
  title: 'Your Post Title',
  content: '# Markdown content here',
  // ...
});
```

### 3. Modify Pricing
Edit `src/app/pricing/page.tsx`:
```typescript
const products = [
  { name: 'Photo Book', price: '$29', features: [...] },
  // ...
];
```

### 4. Update Footer Links
Edit `src/components/layout/Footer.tsx`:
```typescript
const company = [
  { name: 'About Us', href: '/about' },
  // ...
];
```

## 🔗 Integration Checklist

### Email (Contact Form)
1. Sign up for SendGrid or Resend
2. Get API key
3. Update `src/app/api/contact/route.ts`:
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@frametale.com',
  to: 'support@frametale.com',
  subject: subject,
  text: message,
});
```

### Newsletter
1. Sign up for Mailchimp or ConvertKit
2. Get API key
3. Update `src/app/api/newsletter/route.ts`:
```typescript
// Example for Mailchimp
await fetch('https://us1.api.mailchimp.com/3.0/lists/YOUR_LIST_ID/members', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
  },
  body: JSON.stringify({ email_address: email, status: 'subscribed' }),
});
```

### Database (Blog & Testimonials)
You already have Drizzle set up! Just add tables:

```typescript
// src/lib/db/schema.ts
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  // ... other fields
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  rating: integer('rating').notNull(),
  text: text('text').notNull(),
  // ...
});
```

### Authentication (Admin Pages)
Using NextAuth.js:

```bash
npm install next-auth @auth/drizzle-adapter
```

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Check credentials
        // Return user or null
      },
    }),
  ],
};
```

## 🖼️ Adding Real Images

### Team Photos
Replace in `/public/images/team/`:
- sarah.jpg (CEO)
- mike.jpg (CTO)
- emily.jpg (Design)
- david.jpg (Operations)

### Blog Covers
Add to `/public/images/blog/`:
- family-memories.jpg
- travel-ideas.jpg
- paper-guide.jpg

### Gallery Examples
Add to `/public/images/gallery/`:
- summer-1.jpg
- wedding-1.jpg
- family-1.jpg
- europe-1.jpg
- baby-1.jpg
- grad-1.jpg

### Avatars
Add to `/public/images/avatars/`:
- testimonial-1.jpg through testimonial-5.jpg

## 🎯 SEO Optimization

Each page already has metadata! To enhance:

```typescript
// Add to page.tsx files
export const metadata = {
  title: 'Your Page Title - Frametale',
  description: 'Compelling description for SEO',
  keywords: 'photo book, memories, AI',
  openGraph: {
    title: 'Share title',
    description: 'Share description',
    images: ['/og-image.jpg'],
  },
};
```

## 📱 Testing

### Desktop
1. Navigate to all pages
2. Test forms (contact, newsletter)
3. Check admin pages
4. Verify blog navigation

### Mobile
1. Open mobile menu
2. Test responsive layouts
3. Verify touch targets
4. Check form inputs

### API
```bash
# Test blog API
curl http://localhost:3000/api/blog

# Test newsletter
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🚢 Deployment

### Environment Variables
Create `.env.local`:
```bash
# Email
RESEND_API_KEY=your_key_here
# or
SENDGRID_API_KEY=your_key_here

# Newsletter
MAILCHIMP_API_KEY=your_key_here
MAILCHIMP_LIST_ID=your_list_id

# Database (already configured)
DATABASE_URL=your_database_url

# Auth (when implementing)
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://yourdomain.com
```

### Vercel Deployment
```bash
npm install -g vercel
vercel
```

## 💡 Tips

### Performance
- Images are placeholders - replace with optimized images
- Use Next.js Image component for automatic optimization
- Consider lazy loading for gallery images

### Content Strategy
- Publish blog posts regularly (use admin panel)
- Collect real testimonials from customers
- Update pricing seasonally
- Keep FAQ updated with common questions

### Monitoring
- Set up error tracking (Sentry)
- Monitor form submissions
- Track newsletter signups
- Review blog analytics

---

**Everything is ready to go!** 🎉

Just add your real content, connect services, and deploy!
