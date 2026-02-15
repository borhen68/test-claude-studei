import { pgTable, text, uuid, timestamp, varchar, boolean, jsonb } from 'drizzle-orm/pg-core';
import { books, orders } from './schema';

/**
 * Users table for authentication and email preferences
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  emailVerificationExpiry: timestamp('email_verification_expiry'),
  
  passwordHash: text('password_hash'),
  passwordResetToken: varchar('password_reset_token', { length: 255 }),
  passwordResetExpiry: timestamp('password_reset_expiry'),
  
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  
  // Email preferences
  emailPreferences: jsonb('email_preferences').$type<{
    marketing: boolean;
    orderUpdates: boolean;
    newsletter: boolean;
  }>().default({ marketing: true, orderUpdates: true, newsletter: true }),
  
  unsubscribeToken: varchar('unsubscribe_token', { length: 255 }).notNull().unique(),
  unsubscribedAt: timestamp('unsubscribed_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
});

/**
 * Notifications table for in-app notifications
 */
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  type: varchar('type', { length: 50 }).notNull(), // 'order_confirmed', 'order_shipped', 'book_ready', etc.
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  
  // Optional links
  actionUrl: text('action_url'),
  actionLabel: varchar('action_label', { length: 100 }),
  
  // Related entities
  bookId: uuid('book_id').references(() => books.id, { onDelete: 'set null' }),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
  
  // Metadata
  metadata: jsonb('metadata'),
  
  // Status
  read: boolean('read').default(false).notNull(),
  readAt: timestamp('read_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Email logs for tracking sent emails (mock or real)
 */
export const emailLogs = pgTable('email_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  to: varchar('to', { length: 255 }).notNull(),
  from: varchar('from', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  
  template: varchar('template', { length: 100 }).notNull(), // 'welcome', 'order-confirmation', etc.
  
  // Email content
  htmlContent: text('html_content'),
  textContent: text('text_content'),
  
  // Related entities
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
  bookId: uuid('book_id').references(() => books.id, { onDelete: 'set null' }),
  
  // Sending status
  status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'sent', 'failed', 'mocked'
  provider: varchar('provider', { length: 50 }), // 'resend', 'sendgrid', 'mock'
  providerMessageId: varchar('provider_message_id', { length: 255 }),
  
  // Error tracking
  error: text('error'),
  
  // Metadata
  metadata: jsonb('metadata'),
  
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Email queue for bulk/scheduled emails
 */
export const emailQueue = pgTable('email_queue', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  to: varchar('to', { length: 255 }).notNull(),
  template: varchar('template', { length: 100 }).notNull(),
  
  // Template data
  templateData: jsonb('template_data').notNull(),
  
  // Scheduling
  scheduledFor: timestamp('scheduled_for'),
  
  // Priority (1 = highest, 10 = lowest)
  priority: varchar('priority', { length: 20 }).default('normal').notNull(), // 'high', 'normal', 'low'
  
  // Status
  status: varchar('status', { length: 50 }).default('queued').notNull(), // 'queued', 'processing', 'sent', 'failed'
  attempts: varchar('attempts', { length: 10 }).default('0').notNull(),
  maxAttempts: varchar('max_attempts', { length: 10 }).default('3').notNull(),
  
  // Error tracking
  lastError: text('last_error'),
  
  // Processing timestamps
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Contact form submissions
 */
export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  
  // Optional user context
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
  
  // Admin tracking
  status: varchar('status', { length: 50 }).default('new').notNull(), // 'new', 'in_progress', 'resolved'
  assignedTo: varchar('assigned_to', { length: 255 }),
  adminNotes: text('admin_notes'),
  
  respondedAt: timestamp('responded_at'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type EmailLog = typeof emailLogs.$inferSelect;
export type NewEmailLog = typeof emailLogs.$inferInsert;
export type EmailQueue = typeof emailQueue.$inferSelect;
export type NewEmailQueue = typeof emailQueue.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
