# Frametale - Pre-Development Checklist

**Complete this before writing any code**

---

## ✅ Documentation Review

- [ ] Read PRD.md (Product Requirements)
- [ ] Read TECHNICAL_SPEC.md (Architecture)
- [ ] Read UX_FLOW.md (User Experience)
- [ ] Read DATA_MODEL.md (Database Schema)
- [ ] Read ROADMAP.md (Development Plan)
- [ ] Read FILE_STRUCTURE.md (Project Structure)
- [ ] Approve all documents

---

## ✅ Accounts & Services Setup

### Required Services

- [ ] **Supabase** - Database + Storage
  - Create project
  - Note connection string
  - Enable Row Level Security
  
- [ ] **Cloudflare** - R2 Storage (or AWS S3)
  - Create R2 bucket: `frametale-uploads`
  - Generate API keys
  - Configure CORS
  
- [ ] **Stripe** - Payments
  - Create account
  - Get test API keys
  - Set up webhook endpoint (later)
  
- [ ] **Printful** - Print Fulfillment
  - Create account
  - Get API key
  - Find book variant ID
  - Order test book
  
- [ ] **Vercel** - Hosting
  - Connect GitHub repo
  - Set environment variables
  
- [ ] **Resend** - Transactional Email (or SendGrid)
  - Create account
  - Get API key
  - Verify domain

### Optional Services

- [ ] **PostHog** - Product Analytics
- [ ] **Sentry** - Error Tracking
- [ ] **Figma** - Design (for mockups)

---

## ✅ Development Environment

- [ ] Node.js 20+ installed
- [ ] Git installed and configured
- [ ] VS Code (or editor) set up
- [ ] VS Code extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Error Lens

---

## ✅ Project Initialization

- [ ] Create Next.js project: `npx create-next-app@latest frametale`
- [ ] Initialize Git: `git init`
- [ ] Create GitHub repository
- [ ] Push initial commit

---

## ✅ Dependencies Installation

### Core

```bash
npm install \
  next@latest \
  react@latest \
  react-dom@latest \
  typescript \
  @types/node \
  @types/react \
  @types/react-dom
```

### Database

```bash
npm install \
  drizzle-orm \
  drizzle-kit \
  @neondatabase/serverless \
  postgres
```

### UI & Styling

```bash
npm install \
  tailwindcss \
  postcss \
  autoprefixer \
  clsx \
  tailwind-merge \
  class-variance-authority

npx shadcn-ui@latest init
```

### Image Processing

```bash
npm install \
  sharp \
  exifr \
  node-vibrant \
  @types/sharp
```

### PDF Generation

```bash
npm install \
  @react-pdf/renderer
```

### Payments & Services

```bash
npm install \
  stripe \
  @stripe/stripe-js \
  resend
```

### Utils

```bash
npm install \
  zod \
  date-fns \
  nanoid
```

### Dev Dependencies

```bash
npm install -D \
  prettier \
  eslint-config-prettier \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  vitest \
  @playwright/test
```

---

## ✅ Configuration Files

- [ ] `.env.example` created with all variables
- [ ] `.env.local` created with actual values (gitignored)
- [ ] `tailwind.config.ts` configured
- [ ] `tsconfig.json` strict mode enabled
- [ ] `next.config.mjs` configured
- [ ] `drizzle.config.ts` configured
- [ ] `.prettierrc` created
- [ ] `.eslintrc.json` updated
- [ ] `.gitignore` updated

---

## ✅ Database Setup

- [ ] Schema defined (`src/lib/db/schema.ts`)
- [ ] Migrations generated: `npm run db:generate`
- [ ] Migrations applied: `npm run db:push`
- [ ] Drizzle Studio works: `npm run db:studio`
- [ ] Seed data script created (optional)

---

## ✅ Design Assets

- [ ] Figma mockups created (high-fidelity)
- [ ] Component library designed
- [ ] Example book covers created
- [ ] Icons/illustrations sourced
- [ ] Fonts selected
- [ ] Color palette finalized

---

## ✅ Sprint 1 Planning

- [ ] Create GitHub project board
- [ ] Break down tasks into issues
- [ ] Assign Week 1-2 tasks
- [ ] Set up Slack channel (if team)
- [ ] Schedule daily standup (if team)

---

## ✅ Testing Infrastructure

- [ ] Vitest configured for unit tests
- [ ] Playwright configured for E2E tests
- [ ] First test written (smoke test)
- [ ] CI/CD pipeline set up (GitHub Actions)

---

## ✅ Documentation

- [ ] README.md created (setup instructions)
- [ ] CONTRIBUTING.md created (code standards)
- [ ] docs/ folder contains all spec files
- [ ] Architecture diagrams exported (if needed)

---

## ✅ Pre-Launch Checklist (Before Going Live)

### Legal

- [ ] Privacy Policy written
- [ ] Terms of Service written
- [ ] Refund policy defined
- [ ] Cookie consent banner (if needed)

### Business

- [ ] Business entity registered (LLC, etc.)
- [ ] Business bank account opened
- [ ] Accounting software set up (QuickBooks, etc.)
- [ ] Tax ID obtained (EIN in US)

### Marketing

- [ ] Domain registered (frametale.com)
- [ ] Social media accounts created (Instagram, Facebook)
- [ ] Email list set up (Mailchimp, ConvertKit)
- [ ] Landing page copy written
- [ ] Ad creatives prepared

### Operations

- [ ] Customer support email set up (support@frametale.com)
- [ ] Support ticket system (Zendesk, Intercom, or email)
- [ ] Order tracking system tested
- [ ] Return/refund process documented

---

## ✅ Final Checks Before MVP Launch

- [ ] All features from PRD.md implemented
- [ ] 10 test books created and reviewed
- [ ] Mobile responsive on iOS and Android
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Load testing (100 concurrent users)
- [ ] Security audit (OWASP top 10)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Analytics tracking verified
- [ ] Error monitoring working
- [ ] Backup strategy in place

---

## 🚀 Ready to Launch?

When all checkboxes are ticked:

1. Deploy to production
2. Send launch announcement
3. Monitor metrics closely
4. Iterate based on feedback

**Let's ship! 🎉**
