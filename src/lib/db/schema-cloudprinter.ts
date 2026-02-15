/**
 * CloudPrinter Database Schema Extensions
 */

import { pgTable, text, uuid, timestamp, varchar } from 'drizzle-orm/pg-core';
import { orders } from './schema';

/**
 * CloudPrinter order tracking table
 * Links Frametale orders to CloudPrinter orders
 */
export const cloudprinterOrders = pgTable('cloudprinter_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  
  // CloudPrinter identifiers
  cloudprinterId: varchar('cloudprinter_id', { length: 255 }).notNull().unique(),
  cloudprinterReference: varchar('cloudprinter_reference', { length: 255 }).notNull(),
  
  // Status tracking
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  lastStatusUpdate: timestamp('last_status_update').defaultNow().notNull(),
  
  // Product details
  productSku: varchar('product_sku', { length: 100 }).notNull(),
  pageCount: varchar('page_count', { length: 10 }),
  shippingLevel: varchar('shipping_level', { length: 50 }),
  
  // File references
  coverFileUrl: text('cover_file_url'),
  coverFileMd5: varchar('cover_file_md5', { length: 32 }),
  contentFileUrl: text('content_file_url'),
  contentFileMd5: varchar('content_file_md5', { length: 32 }),
  
  // Tracking
  trackingNumber: varchar('tracking_number', { length: 255 }),
  trackingUrl: text('tracking_url'),
  trackingCarrier: varchar('tracking_carrier', { length: 100 }),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type CloudPrinterOrder = typeof cloudprinterOrders.$inferSelect;
export type NewCloudPrinterOrder = typeof cloudprinterOrders.$inferInsert;
