import { render } from '@react-email/components';
import { Resend } from 'resend';
import { nanoid } from 'nanoid';
import { db } from '../db';
import { emailLogs, emailQueue, users } from '../db/schema-email-notifications';
import { eq } from 'drizzle-orm';

// Import email templates
import WelcomeEmail from '../../../emails/welcome';
import VerifyEmail from '../../../emails/verify-email';
import OrderConfirmation from '../../../emails/order-confirmation';
import OrderShipped from '../../../emails/order-shipped';
import PasswordReset from '../../../emails/password-reset';
import Newsletter from '../../../emails/newsletter';
import ContactAdmin from '../../../emails/contact-admin';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.EMAIL_FROM || 'Frametale <noreply@frametale.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@frametale.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Mock mode: if no Resend key, just log emails to console & DB
const MOCK_MODE = !process.env.RESEND_API_KEY;

interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  templateData: any;
  userId?: string;
  orderId?: string;
  bookId?: string;
}

/**
 * Render an email template to HTML and text
 */
export async function renderEmail(template: string, data: any) {
  let emailComponent;
  
  switch (template) {
    case 'welcome':
      emailComponent = WelcomeEmail(data);
      break;
    case 'verify-email':
      emailComponent = VerifyEmail(data);
      break;
    case 'order-confirmation':
      emailComponent = OrderConfirmation(data);
      break;
    case 'order-shipped':
      emailComponent = OrderShipped(data);
      break;
    case 'password-reset':
      emailComponent = PasswordReset(data);
      break;
    case 'newsletter':
      emailComponent = Newsletter(data);
      break;
    case 'contact-admin':
      emailComponent = ContactAdmin(data);
      break;
    default:
      throw new Error(`Unknown email template: ${template}`);
  }
  
  const html = await render(emailComponent);
  const text = await render(emailComponent, { plainText: true });
  
  return { html, text };
}

/**
 * Send an email (real or mocked)
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, template, templateData, userId, orderId, bookId } = options;
  
  try {
    // Render the email
    const { html, text } = await renderEmail(template, templateData);
    
    let messageId: string | undefined;
    let status: 'sent' | 'mocked' | 'failed' = 'mocked';
    let error: string | undefined;
    
    if (MOCK_MODE) {
      // Mock mode: just log to console
      console.log('📧 [MOCK EMAIL]');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Template:', template);
      console.log('---');
      console.log(text);
      console.log('---');
      
      messageId = `mock-${nanoid()}`;
      status = 'mocked';
    } else {
      // Real mode: send via Resend
      try {
        const result = await resend!.emails.send({
          from: FROM_EMAIL,
          to,
          subject,
          html,
          text,
        });
        
        messageId = result.data?.id;
        status = 'sent';
      } catch (err: any) {
        console.error('Failed to send email:', err);
        error = err.message;
        status = 'failed';
      }
    }
    
    // Log to database
    await db.insert(emailLogs).values({
      to,
      from: FROM_EMAIL,
      subject,
      template,
      htmlContent: html,
      textContent: text,
      userId,
      orderId,
      bookId,
      status,
      provider: MOCK_MODE ? 'mock' : 'resend',
      providerMessageId: messageId,
      error,
      sentAt: new Date(),
    });
    
    return { 
      success: status !== 'failed', 
      messageId,
      error 
    };
  } catch (err: any) {
    console.error('Email send error:', err);
    
    // Log failed attempt
    await db.insert(emailLogs).values({
      to,
      from: FROM_EMAIL,
      subject,
      template,
      userId,
      orderId,
      bookId,
      status: 'failed',
      provider: MOCK_MODE ? 'mock' : 'resend',
      error: err.message,
      sentAt: new Date(),
    });
    
    return { 
      success: false, 
      error: err.message 
    };
  }
}

/**
 * Queue an email for later sending
 */
export async function queueEmail(options: SendEmailOptions & { scheduledFor?: Date; priority?: 'high' | 'normal' | 'low' }) {
  const { scheduledFor, priority = 'normal', ...emailData } = options;
  
  await db.insert(emailQueue).values({
    to: emailData.to,
    template: emailData.template,
    templateData: emailData.templateData,
    scheduledFor,
    priority,
    status: 'queued',
  });
}

/**
 * Get unsubscribe URL for a user
 */
export async function getUnsubscribeUrl(email: string): Promise<string> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  
  if (!user) {
    return `${APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  }
  
  return `${APP_URL}/unsubscribe/${user.unsubscribeToken}`;
}

/**
 * Check if user has unsubscribed from a specific email type
 */
export async function checkEmailPreferences(email: string, type: 'marketing' | 'orderUpdates' | 'newsletter'): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  
  if (!user) {
    return true; // Allow if no user found
  }
  
  if (user.unsubscribedAt) {
    return false; // Unsubscribed from all
  }
  
  const prefs = user.emailPreferences as any;
  return prefs?.[type] !== false;
}

// ============================================================================
// CONVENIENCE FUNCTIONS FOR EACH EMAIL TYPE
// ============================================================================

export async function sendWelcomeEmail(email: string, name?: string, userId?: string) {
  const canSend = await checkEmailPreferences(email, 'marketing');
  if (!canSend) return { success: false, error: 'User unsubscribed' };
  
  const unsubscribeUrl = await getUnsubscribeUrl(email);
  const verifyUrl = userId ? `${APP_URL}/verify-email?userId=${userId}` : undefined;
  
  return sendEmail({
    to: email,
    subject: '🎉 Welcome to Frametale!',
    template: 'welcome',
    templateData: {
      name,
      verifyUrl,
      unsubscribeUrl,
    },
    userId,
  });
}

export async function sendVerificationEmail(email: string, verifyToken: string, userId?: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${verifyToken}`;
  
  return sendEmail({
    to: email,
    subject: '✉️ Verify your email address',
    template: 'verify-email',
    templateData: {
      verifyUrl,
    },
    userId,
  });
}

export async function sendOrderConfirmationEmail(params: {
  email: string;
  orderId: string;
  bookTitle: string;
  pageCount?: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: any;
  userId?: string;
  bookId?: string;
}) {
  const canSend = await checkEmailPreferences(params.email, 'orderUpdates');
  if (!canSend) return { success: false, error: 'User unsubscribed' };
  
  const unsubscribeUrl = await getUnsubscribeUrl(params.email);
  
  return sendEmail({
    to: params.email,
    subject: '🎉 Order Confirmed - Your Photo Book is Being Created!',
    template: 'order-confirmation',
    templateData: {
      ...params,
      unsubscribeUrl,
    },
    userId: params.userId,
    orderId: params.orderId,
    bookId: params.bookId,
  });
}

export async function sendOrderShippedEmail(params: {
  email: string;
  orderId: string;
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
  userId?: string;
}) {
  const canSend = await checkEmailPreferences(params.email, 'orderUpdates');
  if (!canSend) return { success: false, error: 'User unsubscribed' };
  
  const unsubscribeUrl = await getUnsubscribeUrl(params.email);
  
  return sendEmail({
    to: params.email,
    subject: '📦 Your Photo Book Has Shipped!',
    template: 'order-shipped',
    templateData: {
      ...params,
      unsubscribeUrl,
    },
    userId: params.userId,
    orderId: params.orderId,
  });
}

export async function sendPasswordResetEmail(email: string, resetToken: string, userId?: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;
  
  return sendEmail({
    to: email,
    subject: '🔑 Reset Your Frametale Password',
    template: 'password-reset',
    templateData: {
      resetUrl,
      expiryHours: 1,
    },
    userId,
  });
}

export async function sendNewsletterEmail(params: {
  email: string;
  subject: string;
  headline: string;
  content: any[];
  userId?: string;
}) {
  const canSend = await checkEmailPreferences(params.email, 'newsletter');
  if (!canSend) return { success: false, error: 'User unsubscribed' };
  
  const unsubscribeUrl = await getUnsubscribeUrl(params.email);
  
  return sendEmail({
    to: params.email,
    subject: params.subject,
    template: 'newsletter',
    templateData: {
      ...params,
      unsubscribeUrl,
    },
    userId: params.userId,
  });
}

export async function sendContactFormNotification(params: {
  submissionId: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  userId?: string;
  orderId?: string;
}) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `📧 New Contact Form: ${params.subject || 'No subject'}`,
    template: 'contact-admin',
    templateData: {
      ...params,
      submittedAt: new Date().toLocaleString(),
    },
  });
}
