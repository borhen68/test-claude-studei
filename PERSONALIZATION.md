# Personalization & Customization Features

This document describes the personalization features implemented in Frametale, giving customers control over their photo books, calendars, and cards.

## Overview

Frametale follows a "Smart Defaults + Easy Override" philosophy:
1. **Auto-Generate** - System creates beautiful layouts automatically
2. **Show Preview** - User sees the result
3. **Offer Customization** - Big "Customize Your Book" button
4. **Progressive Disclosure** - Start simple, show advanced options on demand
5. **Live Preview** - Every change updates instantly
6. **Non-Destructive** - Can always revert to auto-generated version

## Phase 1 Features (Implemented)

### 1. Cover Customization
**Component:** `src/components/book/CoverCustomizer.tsx`

Features:
- ✅ Cover photo selection (choose from uploaded photos)
- ✅ Custom title input (e.g., "Summer 2025", "Our Wedding")
- ✅ Font selection (5 fonts: Serif, Sans, Script, Modern, Playful)
- ✅ Text color picker (photo palette + custom colors)
- ✅ Text position (top, center, bottom)
- ✅ Cover layout (full bleed, framed, collage)
- ✅ Live preview updates

Usage:
```tsx
import { CoverCustomizer } from '@/components/book/CoverCustomizer';

<CoverCustomizer
  bookId={bookId}
  photos={photos}
  currentCover={currentCustomization}
  onSave={(customization) => {
    // Handle save
  }}
/>
```

### 2. Caption Editor
**Component:** `src/components/book/CaptionEditor.tsx`

Features:
- ✅ Click any photo to add/edit caption
- ✅ AI-suggested captions from EXIF (date, location)
- ✅ Caption position (below, overlay, side)
- ✅ Caption size (small, medium, large)
- ✅ Bulk actions (add date/location to all)
- ✅ Caption count indicator

Usage:
```tsx
import { CaptionEditor } from '@/components/book/CaptionEditor';

<CaptionEditor
  bookId={bookId}
  photos={photosWithCaptions}
  onSave={(photoId, caption, position, size) => {
    // Handle save
  }}
/>
```

### 3. Calendar Date Marker
**Component:** `src/components/calendar/DateMarker.tsx`

Features:
- ✅ Interactive calendar grid
- ✅ Click any date to add event
- ✅ Event name, color, and recurring options
- ✅ Color coding for different event types
- ✅ Visual event dots on calendar
- ✅ Event list with delete option

Usage:
```tsx
import { DateMarker } from '@/components/calendar/DateMarker';

<DateMarker
  bookId={bookId}
  year={2026}
  month={2}
  events={existingEvents}
  onSave={(events) => {
    // Handle save
  }}
/>
```

### 4. Theme Selector
**Component:** `src/components/book/ThemeSelector.tsx`

Features:
- ✅ 5 pre-made themes (Modern, Minimal, Vibrant, Elegant, Classic)
- ✅ Live theme preview
- ✅ Background color, accent color, text color
- ✅ Border styles (none, thin, thick, rounded)
- ✅ Page number options
- ✅ Theme details display

Themes:
- **Modern** - Clean lines, bold contrasts, blue accent
- **Minimal** - Simple, elegant, black and white
- **Vibrant** - Bold colors, playful energy, yellow/orange
- **Elegant** - Sophisticated serif fonts, cream tones
- **Classic** - Timeless design, traditional blue

Usage:
```tsx
import { ThemeSelector } from '@/components/book/ThemeSelector';

<ThemeSelector
  bookId={bookId}
  currentTheme={currentTheme}
  onSelect={(theme) => {
    // Live preview update
  }}
  onSave={(theme) => {
    // Save to backend
  }}
/>
```

## Database Schema

### Books Table Additions
```typescript
// Cover customization
coverTitle: text('cover_title'),
coverFont: text('cover_font'),
coverTextColor: text('cover_text_color'),
coverTextPosition: text('cover_text_position'),
coverLayout: text('cover_layout').default('full_bleed'),

// Theme
customizationTheme: jsonb('customization_theme'),

// Book specs
paperType: text('paper_type').default('matte'),
coverType: text('cover_type').default('hardcover'),
bookSize: text('book_size').default('10x10'),
desiredPageCount: integer('desired_page_count').default(36),

// Calendar
customEvents: jsonb('custom_events'),
monthLayout: text('month_layout').default('photo_top'),
weekStartDay: text('week_start_day').default('sunday'),
calendarThemeId: text('calendar_theme_id'),
photosPerMonth: integer('photos_per_month').default(1),

// Cards
cardMessage: text('card_message'),
cardFont: text('card_font'),
cardLayout: text('card_layout'),
envelopeStyle: text('envelope_style').default('plain'),
```

### Photos Table Additions
```typescript
// Captions
caption: text('caption'),
captionPosition: text('caption_position').default('below'),
captionSize: text('caption_size').default('small'),
```

## API Routes

### Save Customization
```
PUT /api/books/:bookId/customize
```

Body:
```json
{
  "coverTitle": "Our Wedding",
  "coverFont": "serif",
  "coverTextColor": "#FFFFFF",
  "coverTextPosition": "center",
  "coverLayout": "full_bleed",
  "customizationTheme": {
    "id": "elegant",
    "bgColor": "#FDF8F3",
    "accentColor": "#78716C",
    "borderStyle": "thin"
  },
  "customEvents": [
    {
      "date": "2026-02-14",
      "title": "Valentine's Day",
      "color": "#EF4444",
      "recurring": true
    }
  ]
}
```

### Get Customization
```
GET /api/books/:bookId/customize
```

Response:
```json
{
  "success": true,
  "customization": {
    "coverTitle": "Our Wedding",
    "coverFont": "serif",
    ...
  }
}
```

### Update Photo Caption
```
PUT /api/books/:bookId/photos/:photoId/caption
```

Body:
```json
{
  "caption": "Beautiful sunset at the beach",
  "captionPosition": "below",
  "captionSize": "medium"
}
```

### Get Themes
```
GET /api/themes
```

Response:
```json
{
  "success": true,
  "themes": [
    {
      "id": "modern",
      "name": "Modern",
      "description": "Clean lines and bold contrasts",
      ...
    }
  ]
}
```

## Typography

### Cover Fonts
Defined in `src/lib/themes.ts`:

- **Serif** - Georgia, classic and traditional
- **Sans Serif** - Inter, modern and clean
- **Script** - Dancing Script, elegant and flowing
- **Modern** - Poppins, bold and contemporary
- **Playful** - Comic Sans, fun and casual

### Theme Fonts
Each theme includes:
- `headingFont` - For titles and headers
- `bodyFont` - For captions and body text

## Color System

### Theme Colors
Each theme defines:
- `bgColor` - Background color
- `accentColor` - Highlight color
- `textColor` - Primary text color
- `borderColor` - Optional border color

### Event Colors
For calendar events:
- Red `#EF4444`
- Orange `#F97316`
- Yellow `#EAB308`
- Green `#22C55E`
- Blue `#3B82F6`
- Purple `#A855F7`
- Pink `#EC4899`

## User Experience Guidelines

### Customization Levels

**Level 1: No Customization (30% of users)**
- Just upload → auto-generate → order
- "I trust the AI"

**Level 2: Light Touch (50% of users)**
- Change cover photo + title
- Add a few captions
- Pick theme color

**Level 3: Full Control (20% of users)**
- Rearrange all pages
- Custom layouts
- Detailed captions everywhere
- Theme customization

### UI/UX Standards
- ✅ **Non-Destructive** - Can always go back to auto-generated version
- ✅ **Mobile-Friendly** - Touch gestures for drag-drop
- ✅ **Visual** - Show, don't tell (preview > descriptions)
- ✅ **Quick** - Each change previews in <1 second
- ✅ **Guided** - Tooltips explain what each option does
- ✅ **Beautiful** - Journi-style gradients and smooth animations

## Phase 2 Features (Planned)

### 5. Page Layout Editor
**Component:** `src/components/book/PageEditor.tsx`

Features:
- Template override (change page layouts)
- Photo swap (drag & drop between pages)
- Photo removal (with auto-reflow)
- Add photos to existing pages
- Page reorder (drag to rearrange)

### 6. Quote Pages
Insert full-page text between photos for meaningful quotes or stories.

### 7. Message Templates
Pre-written greeting card messages users can customize:
- Birthday wishes (10 variations)
- Thank you notes (10 variations)
- Holiday greetings (10 variations)

## Phase 3 Features (Future)

### 8. Advanced Theme Customization
- Custom color picker for all theme elements
- Upload custom fonts
- Border width/radius controls

### 9. Batch Card Personalization
- Personalize each card with different messages
- Variable fields ("Dear {name}")
- Apply same design to all

### 10. Google Calendar Import
- Import events from Google Calendar
- Auto-populate calendar dates
- Sync recurring events

## Testing

To test the components:

1. **Cover Customizer**
   ```bash
   # Create a test page at src/app/test/cover/page.tsx
   npm run dev
   # Navigate to /test/cover
   ```

2. **Caption Editor**
   - Upload some photos with EXIF data
   - Test AI caption generation
   - Verify save functionality

3. **Date Marker**
   - Click dates to add events
   - Test recurring events
   - Verify event colors

4. **Theme Selector**
   - Preview each theme
   - Check live updates
   - Test save/reset

## Migration

To apply the schema changes to your database:

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

Or manually add columns:

```sql
-- Books table
ALTER TABLE books ADD COLUMN cover_title TEXT;
ALTER TABLE books ADD COLUMN cover_font TEXT;
ALTER TABLE books ADD COLUMN cover_text_color TEXT;
-- ... (see schema.ts for full list)

-- Photos table
ALTER TABLE photos ADD COLUMN caption TEXT;
ALTER TABLE photos ADD COLUMN caption_position TEXT DEFAULT 'below';
ALTER TABLE photos ADD COLUMN caption_size TEXT DEFAULT 'small';
```

## Future Enhancements

- **Undo/Redo** - History stack for customization changes
- **Templates** - Save customization as template for future books
- **Collaboration** - Share customization link for feedback
- **A/B Testing** - Compare different cover designs
- **Smart Suggestions** - AI recommends best customizations based on photos
- **Export/Import** - Save customization to file, import to another book

## Performance Considerations

- Debounce live preview updates (300ms)
- Lazy load high-res images
- Cache theme previews
- Batch API updates
- Optimize database queries with indexes

## Support

For questions or issues, contact:
- Developer: Check `CONTRIBUTING.md`
- Users: See Help Center or contact support@frametale.com
