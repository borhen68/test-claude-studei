import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import postgres from 'postgres';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Try PostgreSQL first, fallback to SQLite for local development
let db: any;

if (process.env.DATABASE_URL) {
  // PostgreSQL/Neon
  const client = postgres(process.env.DATABASE_URL);
  db = drizzle(client, { schema });
} else {
  // SQLite fallback
  console.log('📦 Using SQLite database (local fallback)');
  const sqlite = new Database('frametale.db');
  db = drizzleSqlite(sqlite, { schema });
  
  // Initialize tables for SQLite
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      session_token TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      title TEXT DEFAULT 'Your Photos',
      theme TEXT DEFAULT 'auto',
      page_count INTEGER,
      status TEXT DEFAULT 'uploading',
      cover_image_url TEXT,
      preview_pdf_url TEXT,
      final_pdf_url TEXT,
      source TEXT,
      conversion_funnel TEXT
    );

    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      original_url TEXT NOT NULL,
      processed_url TEXT,
      thumbnail_url TEXT,
      filename TEXT,
      file_size INTEGER,
      mime_type TEXT,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      aspect_ratio TEXT,
      date_taken TEXT,
      camera_make TEXT,
      camera_model TEXT,
      exif_orientation INTEGER DEFAULT 1,
      quality_score INTEGER,
      sharpness_score TEXT,
      has_faces INTEGER DEFAULT 0,
      face_count INTEGER DEFAULT 0,
      dominant_color TEXT,
      color_palette TEXT,
      orientation TEXT,
      is_duplicate INTEGER DEFAULT 0,
      duplicate_of TEXT REFERENCES photos(id),
      used_in_layout INTEGER DEFAULT 0,
      sort_order INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      page_number INTEGER NOT NULL,
      template TEXT NOT NULL,
      photo_ids TEXT NOT NULL,
      layout_data TEXT NOT NULL,
      text_content TEXT,
      preview_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      book_id TEXT NOT NULL UNIQUE REFERENCES books(id),
      email TEXT NOT NULL,
      shipping_name TEXT NOT NULL,
      shipping_address_line1 TEXT NOT NULL,
      shipping_address_line2 TEXT,
      shipping_city TEXT NOT NULL,
      shipping_state TEXT NOT NULL,
      shipping_zip TEXT NOT NULL,
      shipping_country TEXT DEFAULT 'US',
      phone TEXT,
      subtotal INTEGER NOT NULL,
      shipping_cost INTEGER DEFAULT 0,
      tax INTEGER DEFAULT 0,
      total INTEGER NOT NULL,
      currency TEXT DEFAULT 'USD',
      stripe_checkout_session_id TEXT,
      stripe_payment_intent_id TEXT,
      paid_at TEXT,
      status TEXT DEFAULT 'pending',
      printful_order_id TEXT,
      tracking_number TEXT,
      tracking_url TEXT,
      shipped_at TEXT,
      delivered_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_photos_book_id ON photos(book_id);
    CREATE INDEX IF NOT EXISTS idx_pages_book_id ON pages(book_id);
    CREATE INDEX IF NOT EXISTS idx_orders_book_id ON orders(book_id);
  `);
}

export { db };
export * from './schema';
