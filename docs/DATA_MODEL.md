# Frametale - Database Schema

**Version:** 2.0  
**Database:** PostgreSQL 15+ (Supabase)  
**ORM:** Drizzle ORM

---

## Schema Diagram

```
┌─────────────┐
│    books    │
└──────┬──────┘
       │ 1:N
       ▼
┌─────────────┐       ┌──────────────┐
│   photos    │──────▶│ photo_faces  │
└──────┬──────┘  1:N  └──────────────┘
       │
       │ N:M
       ▼
┌─────────────┐
│    pages    │
└──────┬──────┘
       │ 1:1
       ▼
┌─────────────┐       ┌──────────────┐
│   orders    │──────▶│   payments   │
└──────┬──────┘  1:N  └──────────────┘
       │
       ▼
┌─────────────┐
│ fulfillments│
└─────────────┘
```

---

## Tables

### `books`

Primary entity for a photo book creation session.

```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Session
  session_token VARCHAR(255) UNIQUE NOT NULL, -- For guest access
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Settings
  title VARCHAR(255) DEFAULT 'Your Photos',
  theme VARCHAR(50) DEFAULT 'auto', -- auto, warm, cool, bw, vintage
  page_count INT, -- Calculated after layout
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'uploading', 
    -- uploading, processing, ready, purchased, error
  
  -- Storage
  cover_image_url TEXT,
  preview_pdf_url TEXT,
  final_pdf_url TEXT,
  
  -- Analytics
  source VARCHAR(100), -- ad, organic, referral
  conversion_funnel JSONB, -- {uploaded_at, previewed_at, purchased_at}
  
  INDEX idx_session_token (session_token),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

---

### `photos`

Individual uploaded photos with analysis metadata.

```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  
  -- Storage
  original_url TEXT NOT NULL,
  processed_url TEXT, -- Optimized/cropped version
  thumbnail_url TEXT,
  
  -- Metadata
  filename VARCHAR(255),
  file_size INT, -- bytes
  mime_type VARCHAR(50),
  width INT NOT NULL,
  height INT NOT NULL,
  aspect_ratio DECIMAL(10, 4),
  
  -- EXIF
  date_taken TIMESTAMPTZ,
  camera_make VARCHAR(100),
  camera_model VARCHAR(100),
  exif_orientation INT DEFAULT 1,
  
  -- Analysis
  quality_score INT CHECK (quality_score >= 0 AND quality_score <= 100),
  sharpness_score DECIMAL(10, 2),
  has_faces BOOLEAN DEFAULT FALSE,
  face_count INT DEFAULT 0,
  dominant_color VARCHAR(7), -- #RRGGBB
  color_palette JSONB, -- [{color: '#...', population: 0.4}, ...]
  
  -- Categorization
  orientation VARCHAR(20), -- portrait, landscape, square
  is_duplicate BOOLEAN DEFAULT FALSE,
  duplicate_of UUID REFERENCES photos(id),
  
  -- Usage
  used_in_layout BOOLEAN DEFAULT FALSE,
  sort_order INT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_book_id (book_id),
  INDEX idx_date_taken (date_taken),
  INDEX idx_quality_score (quality_score),
  INDEX idx_sort_order (sort_order)
);
```

---

### `photo_faces`

Face detection results (optional, for face-aware cropping).

```sql
CREATE TABLE photo_faces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  
  -- Bounding box (normalized 0-1)
  x DECIMAL(10, 6),
  y DECIMAL(10, 6),
  width DECIMAL(10, 6),
  height DECIMAL(10, 6),
  
  -- Confidence
  confidence DECIMAL(5, 4), -- 0.0-1.0
  
  INDEX idx_photo_id (photo_id)
);
```

---

### `pages`

Generated layout pages for the book.

```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  
  -- Page info
  page_number INT NOT NULL,
  template VARCHAR(50) NOT NULL, -- hero, duo, trio, quad, gallery, quote
  
  -- Content
  photo_ids UUID[] NOT NULL, -- Array of photo UUIDs in layout
  layout_data JSONB NOT NULL, -- {positions, crops, etc.}
  text_content TEXT, -- For quote pages or captions
  
  -- Render
  preview_url TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_book_id (book_id),
  INDEX idx_page_number (page_number),
  UNIQUE (book_id, page_number)
);
```

**Example `layout_data`:**
```json
{
  "template": "duo_horizontal",
  "photos": [
    {
      "id": "photo-uuid-1",
      "position": { "x": 0, "y": 0, "width": 0.48, "height": 1 },
      "crop": { "x": 0.1, "y": 0, "width": 0.8, "height": 1 },
      "rotation": 0
    },
    {
      "id": "photo-uuid-2",
      "position": { "x": 0.52, "y": 0, "width": 0.48, "height": 1 },
      "crop": { "x": 0, "y": 0.05, "width": 1, "height": 0.9 },
      "rotation": 0
    }
  ],
  "theme": {
    "backgroundColor": "#F5F5F5",
    "accentColor": "#2C5F7C"
  }
}
```

---

### `orders`

Purchase and shipping information.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL UNIQUE REFERENCES books(id),
  
  -- Customer
  email VARCHAR(255) NOT NULL,
  shipping_name VARCHAR(255) NOT NULL,
  shipping_address_line1 VARCHAR(255) NOT NULL,
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(50) NOT NULL,
  shipping_zip VARCHAR(20) NOT NULL,
  shipping_country VARCHAR(2) NOT NULL DEFAULT 'US',
  phone VARCHAR(50),
  
  -- Pricing
  subtotal INT NOT NULL, -- cents (3900 = $39.00)
  shipping_cost INT DEFAULT 0,
  tax INT DEFAULT 0,
  total INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Payment
  stripe_checkout_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  paid_at TIMESTAMPTZ,
  
  -- Fulfillment
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
    -- pending, paid, processing, sent_to_printer, printing, shipped, delivered, 
    -- cancelled, refunded, error
  printful_order_id VARCHAR(255),
  tracking_number VARCHAR(255),
  tracking_url TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_stripe_checkout_session_id (stripe_checkout_session_id),
  INDEX idx_printful_order_id (printful_order_id)
);
```

---

### `payments`

Payment transaction log (for debugging/reconciliation).

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  
  -- Stripe event
  stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL, -- charge.succeeded, etc.
  amount INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Card info (last 4 only)
  card_brand VARCHAR(50),
  card_last4 VARCHAR(4),
  
  -- Status
  status VARCHAR(50) NOT NULL, -- succeeded, failed, refunded
  failure_reason TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_order_id (order_id),
  INDEX idx_stripe_event_id (stripe_event_id)
);
```

---

### `fulfillments`

Print and shipping events (from Printful webhooks).

```sql
CREATE TABLE fulfillments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  
  -- Printful event
  printful_event_type VARCHAR(100) NOT NULL,
  printful_order_id VARCHAR(255),
  
  -- Tracking
  tracking_number VARCHAR(255),
  tracking_url TEXT,
  carrier VARCHAR(100),
  estimated_delivery TIMESTAMPTZ,
  
  -- Files
  printful_file_url TEXT,
  pdf_url TEXT,
  
  -- Status
  status VARCHAR(50), -- pending, in_production, shipped, failed
  error_message TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_order_id (order_id),
  INDEX idx_printful_order_id (printful_order_id)
);
```

---

### `analytics_events`

Product analytics for funnel tracking.

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Session
  session_id VARCHAR(255), -- Anonymous session ID (cookie)
  book_id UUID REFERENCES books(id),
  
  -- Event
  event_name VARCHAR(100) NOT NULL,
    -- page_view, upload_started, upload_completed, preview_viewed,
    -- checkout_started, purchase_completed, etc.
  event_properties JSONB,
  
  -- Context
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_session_id (session_id),
  INDEX idx_event_name (event_name),
  INDEX idx_created_at (created_at)
);
```

---

## Indexes & Performance

**Critical indexes (already defined above):**
- `books.session_token` (lookup by guest session)
- `photos.book_id` (get all photos for a book)
- `pages.book_id` (get all pages for a book)
- `orders.stripe_checkout_session_id` (webhook lookups)

**Additional composite indexes:**
```sql
CREATE INDEX idx_photos_book_sort ON photos(book_id, sort_order);
CREATE INDEX idx_photos_quality ON photos(book_id, quality_score DESC);
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);
```

---

## Database Migrations

Using Drizzle Kit:

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:push

# Rollback (manual, use Supabase dashboard)
```

**Example migration file structure:**
```
/drizzle
  /migrations
    0001_create_books.sql
    0002_create_photos.sql
    0003_create_pages.sql
    0004_create_orders.sql
    0005_add_analytics.sql
```

---

## Row-Level Security (RLS)

**For guest sessions (no auth):**
- Anyone with `session_token` can read/update their book
- No one can see other sessions' books
- Orders are write-once after payment

```sql
-- Books: Accessible via session_token
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own books"
ON books FOR ALL
USING (session_token = current_setting('app.session_token', true));

-- Photos: Inherit book access
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access photos from their books"
ON photos FOR ALL
USING (
  book_id IN (
    SELECT id FROM books 
    WHERE session_token = current_setting('app.session_token', true)
  )
);
```

**For production with user accounts:**
Add `user_id` column to `books`, use Supabase Auth policies.

---

## Data Lifecycle

**Photo retention:**
- Uploaded photos: Kept for 7 days if not purchased
- Purchased books: Original photos stored indefinitely
- Cleanup job: Daily cron to delete unpurchased >7 days old

**Order retention:**
- Orders: Kept forever (legal requirement)
- Analytics: Aggregated monthly, raw data deleted after 1 year

**Backups:**
- Supabase automatic daily backups (7-day retention)
- Manual exports weekly to S3 (long-term archival)

---

**Next Document:** API_SPEC.md
