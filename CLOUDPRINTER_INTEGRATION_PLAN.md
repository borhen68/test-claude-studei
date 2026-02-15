# CloudPrinter Integration Plan

## API Overview
**Base URL:** `https://api.cloudprinter.com/cloudcore/1.0/`
**Auth:** API Key in request body
**Documentation:** https://docs.cloudprinter.com/client/cloudprinter-core-api-v1-0.html

## Key Endpoints

### 1. Orders
- `POST /orders/add` - Create new print order
- `GET /orders/status` - Check order status
- `GET /orders/list` - List all orders

### 2. Products
- `GET /products` - Get available products catalog
- Product example: `book_hardcover_21x30`

### 3. Webhooks (CloudSignal)
- Status updates sent to client URL
- Order processing notifications
- Shipping updates

## Order Structure

```json
{
  "apikey": "YOUR_API_KEY",
  "reference": "order-123",
  "email": "customer@email.com",
  "addresses": [{
    "type": "delivery",
    "firstname": "...",
    "lastname": "...",
    "street1": "...",
    "zip": "...",
    "city": "...",
    "country": "US",
    "email": "...",
    "phone": "..."
  }],
  "items": [{
    "reference": "item-1",
    "product": "book_hardcover_21x30",
    "shipping_level": "cp_saver",
    "title": "Photo Book",
    "count": "1",
    "files": [
      {
        "type": "cover",
        "url": "https://...",
        "md5sum": "..."
      },
      {
        "type": "book", 
        "url": "https://...",
        "md5sum": "..."
      }
    ],
    "options": [
      {
        "type": "total_pages",
        "count": "36"
      },
      {
        "type": "paper_130mcg",
        "count": "36"
      }
    ]
  }]
}
```

## File Requirements
- **Format:** PDF (print-ready)
- **Accessibility:** Public URL with MD5 checksum
- **Types:** 
  - `cover` - Book cover PDF
  - `book` - Interior pages PDF

## Shipping Levels
- `cp_saver` - Economy shipping
- `cp_standard` - Standard shipping
- `cp_express` - Express shipping

## Implementation Plan

### Phase 1: Core Integration
1. **Service Layer** (`src/lib/cloudprinter/client.ts`)
   - API client wrapper
   - Order creation
   - Status checking
   
2. **Product Mapping** (`src/lib/cloudprinter/products.ts`)
   - Map Frametale products to CloudPrinter SKUs
   - Size/paper/cover variations
   
3. **File Upload** (`src/lib/cloudprinter/files.ts`)
   - Upload PDFs to public CDN (R2/S3)
   - Generate MD5 checksums
   - Return public URLs

### Phase 2: Order Flow
1. **Checkout Integration** (`src/app/api/checkout/route.ts`)
   - After payment success
   - Create CloudPrinter order
   - Store order reference
   
2. **Webhook Handler** (`src/app/api/webhooks/cloudprinter/route.ts`)
   - Receive status updates
   - Update order status in DB
   - Send notifications to customer

### Phase 3: Admin Tools
1. **Order Management** (`src/app/admin/orders/`)
   - View CloudPrinter order status
   - Manual order sync
   - Retry failed orders
   
2. **Product Sync** (`src/app/admin/products/`)
   - Fetch available products from CloudPrinter
   - Update pricing
   - Configure product mappings

## Environment Variables Needed

```env
CLOUDPRINTER_API_KEY=your_api_key_here
CLOUDPRINTER_WEBHOOK_SECRET=your_webhook_secret
CLOUDPRINTER_API_URL=https://api.cloudprinter.com/cloudcore/1.0
```

## Product Mapping Strategy

| Frametale Product | CloudPrinter SKU | Size | Pages | Paper |
|------------------|------------------|------|-------|-------|
| Photo Book 8x8" | book_hardcover_21x21 | 21x21cm | 20-60 | 130mcg |
| Photo Book 10x10" | book_hardcover_25x25 | 25x25cm | 20-60 | 130mcg |
| Calendar | calendar_wall_a4 | A4 | 24 | 170mcg |
| Cards | cards_greeting | 10x15cm | 1 | 300gsm |

## Next Steps

1. ✅ Review CloudPrinter documentation
2. ⏳ Build CloudPrinter service client
3. ⏳ Implement product catalog sync
4. ⏳ Add PDF upload to CDN with MD5
5. ⏳ Integrate into checkout flow
6. ⏳ Build webhook handler
7. ⏳ Add admin order management
8. ⏳ Test end-to-end flow

---

**Status:** Planning complete, ready to implement
**Estimated Time:** 2-3 hours for complete integration
