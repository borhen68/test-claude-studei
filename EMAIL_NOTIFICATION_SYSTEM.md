# Email & Notification System - Frametale

Complete email and in-app notification system with beautiful React Email templates, mock sending for development, and production-ready integrations.

---

## 📧 Email System

### Features

- **Beautiful HTML Templates** using React Email
- **Plain text fallbacks** for all emails
- **Mock mode** for development (logs to console + DB)
- **Production-ready** Resend/SendGrid/Postmark integration
- **Email logging** - All sent emails saved to database
- **Email queue** for bulk/scheduled sending
- **Unsubscribe functionality** with preferences
- **Email preview** in browser for testing

### Email Templates

Located in `/emails/`:

1. **welcome.tsx** - Welcome email after signup (with optional verification link)
2. **verify-email.tsx** - Email verification with code
3. **order-confirmation.tsx** - Order confirmation with full details
4. **order-shipped.tsx** - Shipping notification with tracking
5. **password-reset.tsx** - Password reset with secure link
6. **newsletter.tsx** - Flexible newsletter template
7. **contact-admin.tsx** - Contact form notification to admin

All use a shared **base-layout.tsx** for consistent branding.

### Usage

```typescript
import { 
  sendWelcomeEmail,
  sendVerificationEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendPasswordResetEmail,
  sendNewsletterEmail,
  sendContactFormNotification,
} from '@/lib/email/service';

// Welcome email
await sendWelcomeEmail('user@example.com', 'Jane Doe', userId);

// Order confirmation
await sendOrderConfirmationEmail({
  email: 'user@example.com',
  orderId: 'abc-123',
  bookTitle: 'Summer Memories',
  subtotal: 3999,
  shippingCost: 599,
  tax: 320,
  total: 4918,
  shippingAddress: {
    name: 'Jane Doe',
    line1: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'US',
  },
});

// Order shipped
await sendOrderShippedEmail({
  email: 'user@example.com',
  orderId: 'abc-123',
  trackingNumber: '1Z999AA10123456784',
  trackingUrl: 'https://ups.com/track?tracknum=1Z999AA10123456784',
  carrier: 'UPS Ground',
});
```

### Email Preview

Preview all templates in the browser without sending:

```
GET /api/email/preview/welcome
GET /api/email/preview/verify-email
GET /api/email/preview/order-confirmation
GET /api/email/preview/order-shipped
GET /api/email/preview/password-reset
GET /api/email/preview/newsletter
GET /api/email/preview/contact-admin
```

Just visit these URLs in your browser to see beautifully rendered emails!

### API Routes

#### POST /api/email/send
Generic email sender

```json
{
  "to": "user@example.com",
  "subject": "Test Email",
  "template": "welcome",
  "templateData": {
    "name": "Jane Doe",
    "verifyUrl": "https://..."
  },
  "userId": "optional",
  "orderId": "optional",
  "bookId": "optional"
}
```

#### POST /api/email/verify
Send verification email

```json
{
  "email": "user@example.com",
  "userId": "optional"
}
```

### Configuration

Set these environment variables:

```bash
# Optional: If not set, emails are mocked (logged to console + DB)
RESEND_API_KEY=re_...

# Email configuration
EMAIL_FROM="Frametale <noreply@frametale.com>"
ADMIN_EMAIL="admin@frametale.com"
NEXT_PUBLIC_APP_URL="https://frametale.com"
```

### Mock Mode

When `RESEND_API_KEY` is **not set**, emails are:
- ✅ Logged to console with full content
- ✅ Saved to `email_logs` table with status='mocked'
- ✅ Never actually sent

Perfect for development and testing!

### Database Schema

**email_logs** - Tracks all sent/mocked emails
- `to`, `from`, `subject`, `template`
- `htmlContent`, `textContent`
- `status` ('sent', 'mocked', 'failed')
- `provider` ('resend', 'sendgrid', 'mock')
- `providerMessageId`
- `userId`, `orderId`, `bookId` (optional relations)

**email_queue** - Queue for bulk/scheduled emails
- `to`, `template`, `templateData`
- `scheduledFor` (optional future send time)
- `priority` ('high', 'normal', 'low')
- `status` ('queued', 'processing', 'sent', 'failed')
- `attempts`, `maxAttempts`

**users** - Email preferences
- `emailPreferences` JSON: `{ marketing, orderUpdates, newsletter }`
- `unsubscribeToken` - Unique token for unsubscribe links
- `unsubscribedAt` - Global unsubscribe timestamp

---

## 🔔 Notification System

### Features

- **In-app notifications** with bell icon
- **Real-time updates** via polling (30s default, configurable)
- **Unread counts** with badge
- **Mark as read** (individual or all)
- **Action links** - Direct users to relevant pages
- **Type-based notifications** (order_confirmed, order_shipped, book_ready, etc.)

### Usage

```typescript
import {
  createNotification,
  notifyOrderConfirmed,
  notifyOrderShipped,
  notifyBookReady,
  notifyProcessingComplete,
} from '@/lib/notifications/service';

// Order confirmed
await notifyOrderConfirmed(userId, orderId, 'Summer Memories');

// Order shipped
await notifyOrderShipped(userId, orderId, '1Z999AA10123456784');

// Book ready
await notifyBookReady(userId, bookId, 'Summer Memories');

// Custom notification
await createNotification({
  userId,
  type: 'custom',
  title: 'New Feature Available! ✨',
  message: 'Check out our new AI-powered layout suggestions.',
  actionUrl: '/editor',
  actionLabel: 'Try It Now',
});
```

### Component

```tsx
import { NotificationBell } from '@/components/notifications/notification-bell';

// In your header/nav
<NotificationBell userId={currentUser?.id} pollInterval={30000} />
```

**Features:**
- 🔔 Bell icon with unread badge
- 📋 Dropdown with recent notifications
- ✅ Click notification to mark as read
- 🎯 Action buttons for relevant pages
- ⏱️ Auto-polling for real-time updates

### API Routes

#### GET /api/notifications
Get user notifications

```
GET /api/notifications?userId=abc-123&limit=20
```

Response:
```json
{
  "notifications": [
    {
      "id": "...",
      "type": "order_confirmed",
      "title": "Order Confirmed! 🎉",
      "message": "Your photo book is being created!",
      "actionUrl": "/orders/abc-123",
      "actionLabel": "View Order",
      "read": false,
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

#### POST /api/notifications/read
Mark notification(s) as read

```json
// Mark single notification
{
  "userId": "abc-123",
  "notificationId": "def-456"
}

// Mark all as read
{
  "userId": "abc-123",
  "markAll": true
}
```

### Database Schema

**notifications** - In-app notifications
- `userId` - Owner of the notification
- `type` - Notification type (order_confirmed, etc.)
- `title`, `message` - Display content
- `actionUrl`, `actionLabel` - Optional CTA
- `bookId`, `orderId` - Optional relations
- `metadata` - Additional JSON data
- `read`, `readAt` - Read status

**Notification Types:**
- `order_confirmed` - Order placed successfully
- `order_shipped` - Order shipped with tracking
- `book_ready` - Book processing complete
- `processing_complete` - Photos processed
- Custom types as needed

---

## 🎨 Customization

### Email Styling

Edit `/emails/base-layout.tsx` to change:
- Header background/logo
- Footer content
- Colors and fonts
- Overall layout

Each template imports and extends the base layout.

### Notification Types

Add new notification types in `/src/lib/notifications/service.ts`:

```typescript
export async function notifyNewFeature(userId: string, featureName: string) {
  return createNotification({
    userId,
    type: 'new_feature',
    title: '✨ New Feature Available!',
    message: `Check out ${featureName}`,
    actionUrl: '/features/new',
    actionLabel: 'Learn More',
  });
}
```

---

## 🚀 Production Setup

### Email Provider

1. **Get Resend API Key**: https://resend.com
   - Or use SendGrid, Postmark, etc. (modify service.tsx)

2. **Set Environment Variable**:
   ```bash
   RESEND_API_KEY=re_your_api_key_here
   ```

3. **Verify Domain**: Add DNS records to send from your domain

### Email Queue Processing

For bulk/scheduled emails, create a cron job or background worker:

```typescript
// scripts/process-email-queue.ts
import { db } from '@/lib/db';
import { emailQueue } from '@/lib/db/schema-email-notifications';
import { sendEmail } from '@/lib/email/service';
import { eq, lte } from 'drizzle-orm';

async function processQueue() {
  const queued = await db.query.emailQueue.findMany({
    where: and(
      eq(emailQueue.status, 'queued'),
      lte(emailQueue.scheduledFor, new Date())
    ),
    limit: 100,
  });

  for (const item of queued) {
    try {
      await sendEmail({
        to: item.to,
        subject: item.subject,
        template: item.template,
        templateData: item.templateData,
      });

      await db.update(emailQueue)
        .set({ status: 'sent', processedAt: new Date() })
        .where(eq(emailQueue.id, item.id));
    } catch (error) {
      console.error('Queue processing error:', error);
      await db.update(emailQueue)
        .set({ 
          status: 'failed', 
          lastError: error.message,
          attempts: (parseInt(item.attempts) + 1).toString()
        })
        .where(eq(emailQueue.id, item.id));
    }
  }
}

// Run every minute
setInterval(processQueue, 60000);
```

### WebSocket for Real-Time Notifications

For instant notification updates (optional), integrate Socket.io or Pusher:

```typescript
// server
io.to(`user:${userId}`).emit('notification', notificationData);

// client
socket.on('notification', (data) => {
  setNotifications(prev => [data, ...prev]);
  setUnreadCount(prev => prev + 1);
});
```

---

## 📊 Migration

Run database migrations to add the new tables:

```bash
npm run db:generate
npm run db:push
```

This creates:
- `users`
- `notifications`
- `email_logs`
- `email_queue`
- `contact_submissions`

---

## ✅ Testing

### Test Email Sending

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "template": "welcome",
    "templateData": {
      "name": "Test User"
    }
  }'
```

### Preview All Templates

Visit in browser:
- http://localhost:3000/api/email/preview/welcome
- http://localhost:3000/api/email/preview/order-confirmation
- http://localhost:3000/api/email/preview/order-shipped
- etc.

### Test Notifications

```bash
curl http://localhost:3000/api/notifications?userId=test-user-123
```

---

## 🎯 Next Steps

1. **Authentication** - Integrate with your auth system to get real userIds
2. **Email Preferences Page** - Let users manage notification settings
3. **Unsubscribe Page** - Handle unsubscribe links
4. **Admin Dashboard** - View email logs and contact submissions
5. **A/B Testing** - Test different email templates
6. **Analytics** - Track open rates, click rates (via tracking pixels/links)

---

## 📝 Summary

**Email System:**
- ✅ 7 beautiful React Email templates
- ✅ Mock mode for development
- ✅ Database logging
- ✅ Queue system for bulk sends
- ✅ Unsubscribe & preferences
- ✅ Preview in browser

**Notification System:**
- ✅ In-app notification bell
- ✅ Real-time polling
- ✅ Mark as read
- ✅ Unread badge
- ✅ Action links
- ✅ Type-based notifications

Everything is ready to use! 🚀
