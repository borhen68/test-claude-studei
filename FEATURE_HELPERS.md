# Feature Implementation Helpers

## 1. Photo Quality Enhancement

### Database Migration
```typescript
// Add to photos table
enhancementLevel: varchar('enhancement_level', { length: 20 }).default('auto'),
enhancedUrl: text('enhanced_url'),
```

### Sharp Processing
```typescript
// src/lib/photo-processing/enhance.ts
import sharp from 'sharp';

export async function enhancePhoto(buffer: Buffer, level: 'none' | 'auto' | 'high') {
  if (level === 'none') return buffer;
  
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  // Auto-adjust based on image analysis
  return image
    .normalize() // Auto-levels
    .sharpen({ sigma: level === 'high' ? 2 : 1 })
    .modulate({
      brightness: 1.05,
      saturation: 1.1
    })
    .toBuffer();
}
```

## 2. Quick Reorder

### API Route
```typescript
// src/app/api/books/[bookId]/reorder/route.ts
export async function POST(req: Request, { params }: { params: { bookId: string } }) {
  // 1. Fetch original book with photos
  // 2. Create new book clone
  // 3. Copy all photos to new session
  // 4. Redirect to checkout
}
```

## 3. Custom Calendar Dates

### Database Migration
```typescript
// Add to books table
customDates: jsonb('custom_dates'), // { "2024-12-25": "Christmas", "2024-07-04": "Birthday" }
calendarType: varchar('calendar_type', { length: 20 }).default('standard'), // standard | custom
```

### UI Component
```typescript
// src/components/book/DatePicker.tsx
import { Calendar } from 'lucide-react';

export function CustomDatePicker({ bookId, onSave }: Props) {
  // Date picker modal
  // Save to book.customDates JSONB
}
```

## 4. Smart Photo Suggestions

### Algorithm
```typescript
// src/lib/photo-processing/suggest.ts
export function getSuggestedPhotos(photos: Photo[], limit: number = 20) {
  return photos
    .filter(p => !p.isDuplicate)
    .sort((a, b) => {
      const scoreA = calculateSuggestionScore(a);
      const scoreB = calculateSuggestionScore(b);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

function calculateSuggestionScore(photo: Photo): number {
  let score = photo.qualityScore || 0;
  
  // Bonus for faces
  if (photo.hasFaces) score += 20;
  score += (photo.faceCount || 0) * 5;
  
  // Bonus for good aspect ratios
  const ar = parseFloat(photo.aspectRatio || '1');
  if (ar >= 0.8 && ar <= 1.5) score += 10; // Square-ish
  
  // Penalty for duplicates
  if (photo.isDuplicate) score -= 50;
  
  return score;
}
```

## 5. Flexible Calendar Start

### Database Migration
```typescript
// Add to books table
calendarStartMonth: integer('calendar_start_month').default(1), // 1-12
```

### UI
```typescript
// src/components/upload/CalendarStartSelector.tsx
export function CalendarStartSelector({ value, onChange }: Props) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {months.map((month, i) => (
        <option key={i} value={i + 1}>{month}</option>
      ))}
    </select>
  );
}
```

## 6. Google Photos Import

### OAuth Setup
```typescript
// .env.local
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=https://frametale.com/api/import/google-photos/callback
```

### API Routes
```typescript
// src/app/api/import/google-photos/route.ts
export async function GET(req: Request) {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=https://www.googleapis.com/auth/photoslibrary.readonly&` +
    `access_type=offline`;
  
  return Response.redirect(authUrl);
}

// src/app/api/import/google-photos/callback/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  
  // Exchange code for access token
  // Fetch photos from Google Photos API
  // Download and process
  // Redirect back to book
}
```

## 7. Gift Scheduling

### Database Migration
```typescript
// Add to orders table
scheduledDeliveryDate: timestamp('scheduled_delivery_date'),
holdUntilDate: timestamp('hold_until_date'),
```

### Checkout UI
```typescript
// src/components/checkout/GiftScheduling.tsx
export function GiftScheduling({ onDateSelect }: Props) {
  return (
    <div className="border rounded-lg p-4">
      <label>Schedule Delivery (Optional)</label>
      <input 
        type="date" 
        min={new Date().toISOString().split('T')[0]}
        onChange={(e) => onDateSelect(e.target.value)}
      />
      <p className="text-sm text-gray-500">
        We'll hold your order and ship it to arrive on or before this date
      </p>
    </div>
  );
}
```

## 8. Family Collaboration

### Database Migration
```typescript
export const sharedBooks = pgTable('shared_books', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookId: uuid('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  shareToken: varchar('share_token', { length: 255 }).notNull().unique(),
  createdBy: uuid('created_by').references(() => users.id),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
  allowUploads: boolean('allow_uploads').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### API Routes
```typescript
// src/app/api/books/[bookId]/share/route.ts
export async function POST(req: Request, { params }: { params: { bookId: string } }) {
  const shareToken = nanoid(32);
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}/shared/${shareToken}`;
  
  // Create shared_books entry
  // Return share URL
}

// src/app/shared/[token]/page.tsx
export default function SharedBookPage({ params }: { params: { token: string } }) {
  // Load book by share token
  // Show upload interface (no account required)
  // Real-time updates with polling or websockets
}
```

## Ready to Implement!

All helpers prepared. Waiting for research to confirm priorities.
