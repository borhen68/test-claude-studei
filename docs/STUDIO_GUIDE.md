# Frametale Studio - Complete Guide

## Overview

The Frametale Studio is a professional-grade photo book editing interface built with 2026 design standards. It provides an intuitive, powerful environment for creating stunning photo books with zero learning curve.

## Architecture

### Component Structure

```
src/
├── components/studio/
│   ├── StudioLayout.tsx          # Main layout container
│   ├── StudioHeader.tsx           # Top command bar
│   ├── PageSidebar.tsx            # Left page navigation
│   ├── StudioCanvas.tsx           # Center editing canvas
│   ├── EditorToolbar.tsx          # Right tools panel
│   ├── PhotoSlot.tsx              # Draggable photo container
│   ├── ThemePicker.tsx            # Theme selector
│   ├── LayoutPicker.tsx           # Layout templates
│   ├── CaptionEditor.tsx          # Text editing
│   ├── PhotoEditor.tsx            # Photo adjustments
│   └── UnusedPhotos.tsx           # Bottom photo drawer
│
├── hooks/
│   ├── useHistory.ts              # Undo/redo state management
│   └── useAutoSave.ts             # Debounced auto-save
│
└── app/book/[id]/
    └── page.tsx                   # Main viewer/editor page
```

### State Management

**History System**
- Full undo/redo support with `useHistory` hook
- Keyboard shortcuts: `⌘Z` (undo), `⌘⇧Z` (redo)
- Maintains past/present/future state snapshots

**Auto-Save**
- 2-second debounce after changes
- Visual indicator showing save status
- Manual save option via button or `⌘S`
- Optimistic UI updates

## Features

### 1. Studio Header

**Capabilities:**
- Inline title editing (click to edit)
- Undo/Redo buttons with state awareness
- Auto-save status indicator
- Preview mode toggle
- Share functionality
- Exit to dashboard

**Keyboard Shortcuts:**
- `⌘Z` - Undo
- `⌘⇧Z` - Redo
- `⌘S` - Manual save

### 2. Page Sidebar

**Features:**
- Drag-and-drop page reordering (via Framer Motion Reorder)
- Page thumbnails with photo count badges
- Current page highlighting
- Context menu (right-click):
  - Duplicate page
  - Delete page
- "Add Page" button with template picker
- Page count display

**Interactions:**
- Click thumbnail → Navigate to page
- Right-click → Show context menu
- Drag → Reorder pages
- Keyboard: `↑↓` navigation (future)

### 3. Studio Canvas

**Editing Tools:**
- Live photo slot editing
- Zoom controls (50% - 200%)
- Grid overlay toggle
- Photo selection highlighting
- Drag-and-drop photo arrangement
- Double-click for quick edit

**Photo Slot Features:**
- Glassmorphic hover overlay
- Floating toolbar on hover:
  - Edit (pencil icon)
  - Crop (crop icon)
  - Replace (swap icon)
  - Remove (trash icon)
- Magnetic snap guides (future)
- Selected state with purple ring

**Visual Polish:**
- Smooth scale transitions on zoom
- Grid: 40px cells with purple guides
- Page number watermark
- Caption preview at bottom

### 4. Editor Toolbar (Right Panel)

**5 Tab System:**

#### 🎨 Themes Tab
- 9 color schemes:
  - Classic, Warm Sunset, Cool Breeze
  - Nature, Lavender Dreams, Peachy Keen
  - Fresh Mint, Rose Garden, Monochrome
- Live theme preview
- Apply to current or all pages

#### 🖼️ Layouts Tab
- 7 layout templates:
  - Hero (1 photo)
  - Duo (2 photos)
  - Trio (3 photos)
  - Quad (4 grid)
  - Gallery (6 photos)
  - Focus (1 large + 2 small)
  - Collage (mixed)
- Visual icon representation
- Photo count display
- "Apply to All Pages" button
- "Smart Auto-arrange" button

#### ✏️ Captions Tab
- Multi-line text input
- Character count
- Font selection (4 options):
  - Serif, Sans Serif, Script, Monospace
- Size picker (Small/Medium/Large/XL)
- Alignment (Left/Center/Right)
- Live preview

#### 📐 Photo Tab (when photo selected)
- Brightness slider (0-200%)
- Contrast slider (0-200%)
- Rotation controls (-90°/Reset/+90°)
- Quick filters:
  - None, B&W, Sepia, Vivid, Cool, Warm
- Replace photo button
- Remove photo button
- Crop & Rotate modal (future)

#### ⚙️ Settings Tab
- Auto-layout toggle
- Show safe zones
- Photo quality warnings
- Page margins (future)

### 5. Unused Photos Drawer

**Features:**
- Displays photos not yet placed
- Horizontal scrolling gallery
- Drag photos to page canvas
- Photo count badge
- Auto-fill pages button
- "Add New Page" quick action
- Collapsible with smooth animation

**States:**
- Open: Full drawer with actions
- Closed: Compact toggle button
- Empty: Celebration message 🎉

## Drag & Drop System

**Technology:** `@dnd-kit/core`

**Drag Sources:**
- Photo slots on canvas
- Unused photos in drawer

**Drop Targets:**
- Other photo slots (swap)
- Empty slots (place)

**Visual Feedback:**
- Semi-transparent dragging item
- Purple dashed drop zones
- Cursor changes to `move`

## Design Language (2026)

### Glassmorphism

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

### Animations

**Spring Physics:**
```tsx
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 30
}
```

**Transitions:**
- Page changes: 0.3s with smooth easing
- Hover states: 0.2s
- Toolbar expand: 0.2s with stagger
- Photo dragging: Real-time with elastic

### Color Palette

**Primary:**
- Purple: `#9333EA` (purple-600)
- Pink: `#EC4899` (pink-600)

**Backgrounds:**
- Dark: `from-slate-900 via-purple-900 to-slate-900`
- Panels: `bg-black/20 backdrop-blur`

**Accents:**
- Success: Green-600
- Warning: Yellow-400
- Error: Red-600
- Info: Blue-600

### Typography

**Fonts:**
- System: -apple-system, BlinkMacSystemFont, "Segoe UI"
- Mono: Font-mono for measurements

**Sizes:**
- Headings: 1.5rem (24px) bold
- Body: 0.875rem (14px) regular
- Caption: 0.75rem (12px) light

## Mobile Responsiveness

### Breakpoints

- Desktop: > 768px (full studio)
- Mobile: < 768px (simplified)

### Mobile Layout

```
┌─────────────────┐
│   Header (v2)   │
├─────────────────┤
│                 │
│  Full Canvas    │
│  (touchable)    │
│                 │
├─────────────────┤
│ [Pages][Tools]  │ ← Bottom tabs
└─────────────────┘
```

**Mobile Gestures:**
- Swipe left/right → Navigate pages
- Pinch zoom → Canvas zoom
- Long-press → Context menu
- Tap photo → Edit modal

## Performance Optimizations

### Virtual Scrolling
- Page sidebar uses `react-window` for 100+ pages
- Only render visible thumbnails
- Lazy load page previews

### Debouncing
- Auto-save: 2s debounce
- Search/filter: 300ms debounce
- Resize events: requestAnimationFrame

### Optimistic Updates
- UI responds immediately
- Background sync with server
- Rollback on error

### Image Optimization
- Thumbnails: WebP format, 200x200
- Canvas: Progressive JPEG
- Lazy loading for off-screen images

## Accessibility

### Keyboard Navigation
- All actions have keyboard shortcuts
- Focus visible on tab navigation
- `?` key shows shortcuts overlay (future)

### Screen Readers
- ARIA labels on all icon buttons
- Live region announcements:
  - "Page 3 of 12"
  - "Photo added"
  - "Changes saved"

### Color Contrast
- WCAG AA compliant
- High contrast mode support
- Reduced motion support (prefers-reduced-motion)

## API Integration

### Endpoints

**GET /api/books?id={id}**
- Fetch book data

**PUT /api/books/{id}/pages**
- Save page updates
- Body: `{ pages: Page[], title: string }`

**POST /api/books/{id}/export**
- Generate PDF
- Returns: `{ success: boolean, pdfUrl: string }`

### Auto-Save Flow

1. User makes change → Update local state
2. Debounce timer starts (2s)
3. Timer expires → Call save endpoint
4. Success → Update lastSaved timestamp
5. Error → Show retry notification

## Future Enhancements

### Collaboration
- Real-time editing with WebSockets
- User cursors and selections
- Comments on pages
- Version history

### Advanced Editing
- Photo filters (Instagram-style)
- Text overlays with rich formatting
- Stickers and clipart
- Custom shapes and borders

### Templates
- Save custom layouts
- Community template library
- Import/export templates
- Template marketplace

### AI Features (Avoid Branding!)
- Smart photo selection → "Intelligent selection"
- Auto-layout → "Smart arrangement"
- Quality enhancement → "Quality optimization"

## Troubleshooting

### Common Issues

**"Changes not saving"**
- Check network tab for failed requests
- Verify auth token validity
- Check lastSaved timestamp

**"Drag & drop not working"**
- Ensure @dnd-kit installed
- Check DndContext wrapper
- Verify draggable/droppable IDs unique

**"Photos not displaying"**
- Check S3 URL accessibility
- Verify CORS headers
- Check image format support

**"Performance lag with many pages"**
- Enable virtual scrolling
- Reduce thumbnail quality
- Lazy load off-screen content

## Contributing

### Code Style
- TypeScript strict mode
- Functional components only
- Hooks for state management
- Tailwind for styling (no CSS-in-JS)

### Testing
- Unit tests for hooks
- Integration tests for workflows
- E2E tests for critical paths

### Git Workflow
1. Feature branch from `main`
2. Descriptive commit messages
3. PR with screenshots/video
4. Code review required
5. Squash merge to `main`

## Credits

**Design Inspiration:**
- Canva: Drag-drop simplicity
- Figma: Professional tools organization
- Apple Photos: Clean, intuitive editing
- Blurb BookWright: Photo book expertise

**Technology:**
- Next.js 16 (App Router)
- React 19
- Framer Motion 12
- @dnd-kit/core
- Tailwind CSS 4
- TypeScript 5

---

Built with ❤️ for photographers and memory makers.
No AI branding. Just beautiful books.
