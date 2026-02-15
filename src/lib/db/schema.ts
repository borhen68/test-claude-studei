import { pgTable, text, uuid, timestamp, integer, decimal, boolean, jsonb, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth-schema';

export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  
  title: varchar('title', { length: 255 }).default('Your Photos'),
  theme: varchar('theme', { length: 50 }).default('auto'),
  pageCount: integer('page_count'),
  
  status: varchar('status', { length: 50 }).default('uploading').notNull(),
  
  coverImageUrl: text('cover_image_url'),
  previewPdfUrl: text('preview_pdf_url'),
  finalPdfUrl: text('final_pdf_url'),
  
  source: varchar('source', { length: 100 }),
  conversionFunnel: jsonb('conversion_funnel'),
});

export const photos = pgTable('photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookId: uuid('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  
  originalUrl: text('original_url').notNull(),
  processedUrl: text('processed_url'),
  enhancedUrl: text('enhanced_url'),
  enhancementLevel: varchar('enhancement_level', { length: 20 }).default('auto'),
  thumbnailUrl: text('thumbnail_url'),
  
  filename: varchar('filename', { length: 255 }),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 50 }),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  aspectRatio: decimal('aspect_ratio', { precision: 10, scale: 4 }),
  
  dateTaken: timestamp('date_taken'),
  cameraMake: varchar('camera_make', { length: 100 }),
  cameraModel: varchar('camera_model', { length: 100 }),
  exifOrientation: integer('exif_orientation').default(1),
  
  qualityScore: integer('quality_score'),
  sharpnessScore: decimal('sharpness_score', { precision: 10, scale: 2 }),
  hasFaces: boolean('has_faces').default(false),
  faceCount: integer('face_count').default(0),
  dominantColor: varchar('dominant_color', { length: 7 }),
  colorPalette: jsonb('color_palette'),
  
  orientation: varchar('orientation', { length: 20 }),
  isDuplicate: boolean('is_duplicate').default(false),
  duplicateOf: uuid('duplicate_of').references(() => photos.id),
  
  usedInLayout: boolean('used_in_layout').default(false),
  sortOrder: integer('sort_order'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookId: uuid('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  
  pageNumber: integer('page_number').notNull(),
  template: varchar('template', { length: 50 }).notNull(),
  
  photoIds: jsonb('photo_ids').notNull(),
  layoutData: jsonb('layout_data').notNull(),
  textContent: text('text_content'),
  
  previewUrl: text('preview_url'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookId: uuid('book_id').notNull().unique().references(() => books.id),
  
  email: varchar('email', { length: 255 }).notNull(),
  shippingName: varchar('shipping_name', { length: 255 }).notNull(),
  shippingAddressLine1: varchar('shipping_address_line1', { length: 255 }).notNull(),
  shippingAddressLine2: varchar('shipping_address_line2', { length: 255 }),
  shippingCity: varchar('shipping_city', { length: 100 }).notNull(),
  shippingState: varchar('shipping_state', { length: 50 }).notNull(),
  shippingZip: varchar('shipping_zip', { length: 20 }).notNull(),
  shippingCountry: varchar('shipping_country', { length: 2 }).default('US').notNull(),
  phone: varchar('phone', { length: 50 }),
  
  subtotal: integer('subtotal').notNull(),
  shippingCost: integer('shipping_cost').default(0),
  tax: integer('tax').default(0),
  total: integer('total').notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  
  stripeCheckoutSessionId: varchar('stripe_checkout_session_id', { length: 255 }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  paidAt: timestamp('paid_at'),
  
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  printfulOrderId: varchar('printful_order_id', { length: 255 }),
  trackingNumber: varchar('tracking_number', { length: 255 }),
  trackingUrl: text('tracking_url'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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
