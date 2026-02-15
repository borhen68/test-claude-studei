# Authentication System Setup

## Overview

Complete authentication and user management system for Frametale with:
- User registration and login
- Email verification
- Password reset
- JWT-based sessions
- Protected routes
- User dashboard

## Database Setup

### 1. Run the auth migration

```bash
npm run migrate:auth
```

This creates:
- `users` table - User accounts
- `sessions` table - Active sessions
- `password_resets` table - Password reset tokens
- Adds `user_id` to `books` table

### 2. Set up environment variables

Copy `.env.example` to `.env` and set:

```bash
JWT_SECRET=your-random-secret-key-at-least-32-characters
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Features

### Auth Pages

- **`/login`** - Sign in page
- **`/signup`** - Registration page
- **`/forgot-password`** - Password reset request and reset form
- **`/verify-email`** - Email verification handler

### Dashboard Pages

- **`/dashboard`** - User home with quick actions and recent books
- **`/dashboard/books`** - All user's books
- **`/dashboard/orders`** - Order history with tracking
- **`/dashboard/settings`** - Profile and password management
- **`/dashboard/billing`** - Payment methods (placeholder)

### API Routes

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `POST /api/auth/reset-password` - Request reset or reset password
- `POST /api/auth/verify-email` - Verify email with token

#### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile (name, password)
- `GET /api/user/books` - Get user's books
- `GET /api/user/orders` - Get user's orders

## Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT tokens for sessions (30-day expiry)
- ✅ HTTP-only cookies
- ✅ CSRF protection via SameSite cookies
- ✅ Email verification tokens (24-hour expiry)
- ✅ Password reset tokens (1-hour expiry, single-use)
- ✅ Protected routes via middleware
- ✅ Input validation with Zod

## Route Protection

The middleware (`src/middleware.ts`) automatically:
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from auth pages
- Allows public access to home, upload, and book viewer
- Stores redirect URL for post-login navigation

## UI Components

Created reusable UI components:
- `Input` - Form inputs with focus states
- `Button` - Multiple variants (primary, secondary, outline, ghost, danger)
- `Label` - Form labels
- `Card` - Card containers with header/content/footer

## Email Integration (TODO)

Currently, email verification and password reset tokens are generated but not sent. To complete:

1. Set up email service (e.g., Resend, SendGrid)
2. Create email templates in `src/lib/email/templates.tsx`
3. Implement sending in:
   - `POST /api/auth/signup` - Send verification email
   - `POST /api/auth/reset-password` - Send reset email

Example with Resend:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Frametale <noreply@frametale.com>',
  to: user.email,
  subject: 'Verify your email',
  html: `Click here to verify: ${verificationUrl}`,
});
```

## Testing

### Create a test user

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Next Steps

1. ✅ Database migration
2. ✅ Auth pages and API routes
3. ✅ User dashboard
4. ⏳ Email service integration
5. ⏳ Link books to users in upload flow
6. ⏳ Add user context to existing book/order flows
7. ⏳ Add "My Account" link to main site navigation

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── reset-password/route.ts
│   │   │   └── verify-email/route.ts
│   │   └── user/
│   │       ├── profile/route.ts
│   │       ├── books/route.ts
│   │       └── orders/route.ts
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   ├── verify-email/page.tsx
│   └── dashboard/
│       ├── page.tsx
│       ├── books/page.tsx
│       ├── orders/page.tsx
│       ├── settings/page.tsx
│       └── billing/page.tsx
├── components/
│   ├── dashboard-layout.tsx
│   └── ui/
│       ├── input.tsx
│       ├── button.tsx
│       ├── label.tsx
│       └── card.tsx
├── lib/
│   ├── auth/
│   │   ├── config.ts
│   │   ├── password.ts
│   │   ├── jwt.ts
│   │   └── session.ts
│   └── db/
│       ├── auth-schema.ts
│       └── schema.ts (updated)
└── middleware.ts
```
