/**
 * Database Schema Definitions
 * 
 * This file defines the core database tables for the Frametale photobook application.
 * Uses Drizzle ORM with PostgreSQL as the database.
 * 
 * Main entities:
 * - books: Photo book projects created by users
 * - photos: Individual photos uploaded to books
 * - pages: Generated layout pages with photo arrangements
 * - orders: Purchase orders for printed books
 */

import { pgTable, text, uuid, timestamp, integer, decimal, boolean, jsonb, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth-schema';

/**
 * Books table - stores photo book projects
 * 
 * Each book represents a user's photo collection that can be turned into a printed book.
 * Supports various statuses from uploading through to completed orders.
 */
export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  /** Foreign key to users table - nullable for guest users */
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  /** Unique session token for guest access and tracking */
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  
  /** User-provided or auto-generated book title */
  title: varchar('title', { length: 255 }).default('Your Photos'),
  
  /** Visual theme for the book (auto, classic, modern, minimal, etc.) */
  theme: varchar('theme', { length: 50 }).default('auto'),
  
  /** Total number of generated pages */
  pageCount: integer('page_count'),
  
  /** Starting month (1-12) for calendar-style books */
  calendarStartMonth: integer('calendar_start_month').default(1),
  
  /** 
   * Book creation status
   * Possible values: uploading, processing, ready, ordering, ordered, completed, failed
   */
  status: varchar('status', { length: 50 }).default('uploading').notNull(),
  
  /** URL to the auto-selected or user-chosen cover photo */
  coverImageUrl: text('cover_image_url'),
  
  /** URL to preview PDF (lower quality, for browser viewing) */
  previewPdfUrl: text('preview_pdf_url'),
  
  /** URL to final print-ready PDF */
  finalPdfUrl: text('final_pdf_url'),
  
  
  // PERSONALIZATION FIELDS - Book customization
  /** Custom title for book cover */
  coverTitle: text('cover_title'),
  
  /** Font family for cover text (serif, sans, script, modern, playful) */
  coverFont: text('cover_font'),
  
  /** Hex color code for cover text */
  coverTextColor: text('cover_text_color'),
  
  /** Cover text position (top, center, bottom) */
  coverTextPosition: text('cover_text_position'),
  
  /** Cover layout style (full_bleed, framed, collage) */
  coverLayout: text('cover_layout').default('full_bleed'),
  
  /** JSON theme configuration: { bgColor, accentColor, borderStyle, pageNumbers } */
  customizationTheme: jsonb('customization_theme'),
  
  /** Paper finish type (matte, glossy, premium) */
  paperType: text('paper_type').default('matte'),
  
  /** Cover binding type (hardcover, softcover, leather) */
  coverType: text('cover_type').default('hardcover'),
  
  /** Selected book size in inches (8x8, 10x10, 12x12) */
  bookSize: text('book_size').default('10x10'),
  
  /** Desired page count (20, 36, 48, 60) */
  desiredPageCount: integer('desired_page_count').default(36),
  
  // PERSONALIZATION FIELDS - Calendar customization
  /** JSON array of custom events: [{ date, title, color, recurring }] */
  customEvents: jsonb('custom_events'),
  
  /** Month layout preference (photo_top, full_bleed, split) */
  monthLayout: text('month_layout').default('photo_top'),
  
  /** Week start day (sunday, monday) */
  weekStartDay: text('week_start_day').default('sunday'),
  
  /** Selected theme ID for calendar */
  calendarThemeId: text('calendar_theme_id'),
  
  /** Number of photos per month (1, 2, 3, 4) */
  photosPerMonth: integer('photos_per_month').default(1),
  
  // PERSONALIZATION FIELDS - Card customization
  /** Custom message for greeting card */
  cardMessage: text('card_message'),
  
  /** Font for card text */
  cardFont: text('card_font'),
  
  /** Card layout style (photo_only, photo_text, text_only) */
  cardLayout: text('card_layout'),
  
  /** Envelope style (plain, colored, pattern) */
  envelopeStyle: text('envelope_style').default('plain'),
  
  /** Traffic source tracking (google_photos, upload, instagram, etc.) */
  source: varchar('source', { length: 100 }),
  
  /** JSON object tracking user journey through funnel for analytics */
  conversionFunnel: jsonb('conversion_funnel'),
});

/**
 * Photos table - stores individual photo metadata and analysis
 * 
 * Each photo includes original file, processing results, EXIF data,
 * and intelligent automatic quality/content analysis for smart layout generation.
 */
export const photos = pgTable('photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  /** Foreign key to parent book */
  bookId: uuid('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  
  /** Storage URL to original uploaded photo */
  originalUrl: text('original_url').notNull(),
  
  /** Storage URL to color-corrected/cropped version */
  processedUrl: text('processed_url'),
  
  /** Storage URL to AI-enhanced version (optional) */
  enhancedUrl: text('enhanced_url'),
  
  /** Enhancement applied: none, auto, light, medium, strong */
  enhancementLevel: varchar('enhancement_level', { length: 20 }).default('auto'),
  
  /** Storage URL to thumbnail (for fast UI loading) */
  thumbnailUrl: text('thumbnail_url'),
  
  // File metadata
  filename: varchar('filename', { length: 255 }),
  
  /** File size in bytes */
  fileSize: integer('file_size'),
  
  mimeType: varchar('mime_type', { length: 50 }),
  
  /** Image dimensions in pixels */
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  
  /** Calculated width/height ratio for layout decisions */
  aspectRatio: decimal('aspect_ratio', { precision: 10, scale: 4 }),
  
  // EXIF metadata
  /** Original photo capture timestamp from EXIF data */
  dateTaken: timestamp('date_taken'),
  
  cameraMake: varchar('camera_make', { length: 100 }),
  cameraModel: varchar('camera_model', { length: 100 }),
  
  /** EXIF orientation flag (1-8) for proper rotation */
  exifOrientation: integer('exif_orientation').default(1),
  
  // AI Analysis results
  /** Overall quality score (0-100) based on resolution, blur, lighting */
  qualityScore: integer('quality_score'),
  
  /** Sharpness metric from blur detection algorithm */
  sharpnessScore: decimal('sharpness_score', { precision: 10, scale: 2 }),
  
  /** Whether face detection found any faces */
  hasFaces: boolean('has_faces').default(false),
  
  /** Number of detected faces (for prioritizing in layouts) */
  faceCount: integer('face_count').default(0),
  
  /** Hex color code of the dominant color */
  dominantColor: varchar('dominant_color', { length: 7 }),
  
  /** JSON array of color palette extracted by node-vibrant */
  colorPalette: jsonb('color_palette'),
  
  // Layout metadata
  /** Detected orientation: portrait, landscape, square */
  orientation: varchar('orientation', { length: 20 }),
  
  /** Flag for near-duplicate detection */
  isDuplicate: boolean('is_duplicate').default(false),
  
  /** Reference to original if this is a duplicate */
  duplicateOf: uuid('duplicate_of').references(() => photos.id),
  
  /** Whether this photo was used in the final layout */
  usedInLayout: boolean('used_in_layout').default(false),
  
  /** User or algorithm determined sort order */
  sortOrder: integer('sort_order'),
  
  
  // PERSONALIZATION FIELDS - Captions
  /** User-added caption text */
  caption: text('caption'),
  
  /** Caption display position (below, overlay, side) */
  captionPosition: text('caption_position').default('below'),
  
  /** Caption font size (small, medium, large) */
  captionSize: text('caption_size').default('small'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Pages table - stores generated page layouts
 * 
 * Each page contains one or more photos arranged according to a template.
 * Includes positioning data for PDF generation.
 */
export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  /** Foreign key to parent book */
  bookId: uuid('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  
  /** Page position in the book (1-based index) */
  pageNumber: integer('page_number').notNull(),
  
  /** Template name (single, double, triple, grid, calendar, etc.) */
  template: varchar('template', { length: 50 }).notNull(),
  
  /** JSON array of photo UUIDs used on this page */
  photoIds: jsonb('photo_ids').notNull(),
  
  /** 
   * JSON object with complete layout information:
   * - Photo positions and sizes
   * - Crop/zoom settings
   * - Text positions
   * - Decorative elements
   */
  layoutData: jsonb('layout_data').notNull(),
  
  /** Optional text content (captions, dates, calendar labels) */
  textContent: text('text_content'),
  
  /** URL to rendered preview image of this page */
  previewUrl: text('preview_url'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Orders table - stores purchase information for printed books
 * 
 * Created when user completes checkout. Tracks payment, fulfillment, and shipping.
 */
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  /** One order per book - unique constraint enforced */
  bookId: uuid('book_id').notNull().unique().references(() => books.id),
  
  // Customer contact
  email: varchar('email', { length: 255 }).notNull(),
  
  // Shipping address
  shippingName: varchar('shipping_name', { length: 255 }).notNull(),
  shippingAddressLine1: varchar('shipping_address_line1', { length: 255 }).notNull(),
  shippingAddressLine2: varchar('shipping_address_line2', { length: 255 }),
  shippingCity: varchar('shipping_city', { length: 100 }).notNull(),
  shippingState: varchar('shipping_state', { length: 50 }).notNull(),
  shippingZip: varchar('shipping_zip', { length: 20 }).notNull(),
  
  /** ISO 3166-1 alpha-2 country code */
  shippingCountry: varchar('shipping_country', { length: 2 }).default('US').notNull(),
  
  phone: varchar('phone', { length: 50 }),
  
  // Pricing (stored in cents to avoid decimal precision issues)
  /** Book price in cents */
  subtotal: integer('subtotal').notNull(),
  
  /** Shipping cost in cents */
  shippingCost: integer('shipping_cost').default(0),
  
  /** Tax amount in cents */
  tax: integer('tax').default(0),
  
  /** Total amount charged in cents */
  total: integer('total').notNull(),
  
  /** ISO 4217 currency code */
  currency: varchar('currency', { length: 3 }).default('USD'),
  
  // Payment tracking
  /** Stripe checkout session ID for payment retrieval */
  stripeCheckoutSessionId: varchar('stripe_checkout_session_id', { length: 255 }),
  
  /** Stripe payment intent ID for refunds/disputes */
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  
  /** When payment was successfully captured */
  paidAt: timestamp('paid_at'),
  
  // Fulfillment tracking
  /**
   * Order status
   * pending -> paid -> printing -> shipped -> delivered
   * Also: cancelled, refunded, failed
   */
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  
  /** Printful or CloudPrinter order ID */
  printfulOrderId: varchar('printful_order_id', { length: 255 }),
  
  /** Carrier tracking number */
  trackingNumber: varchar('tracking_number', { length: 255 }),
  
  /** URL to carrier tracking page */
  trackingUrl: text('tracking_url'),
  
  /** When order was handed to shipping carrier */
  shippedAt: timestamp('shipped_at'),
  
  /** When order was delivered (from carrier webhook) */
  deliveredAt: timestamp('delivered_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports for TypeScript
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

// Export email & notification tables
export * from './schema-email-notifications';

// Export CloudPrinter tables
export * from './schema-cloudprinter';
