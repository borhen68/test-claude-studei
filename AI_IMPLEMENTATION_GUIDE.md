# 🛠️ How to Build AI DIY Features for Frametale

**Step-by-step guide to implement 8 free AI features that boost conversions.**

---

## 🚀 Phase 1: Smart Photo Selection (Week 1)

### Feature: AI picks the best 30-50 photos from bulk uploads

### Technology Stack:
- **Image Analysis:** Sharp.js (already installed)
- **Quality Scoring:** Custom algorithms (no API needed)
- **Duplicate Detection:** Perceptual hashing (pHash)

### Step 1: Install Dependencies
```bash
cd /root/.openclaw/workspace/frametale
npm install sharp image-hash blurhash
```

### Step 2: Create Photo Analysis Library
**File:** `src/lib/ai/photoAnalyzer.ts`

```typescript
import sharp from 'sharp';
import { imageHash } from 'image-hash';

interface PhotoQualityScore {
  id: string;
  filename: string;
  qualityScore: number; // 0-100
  sharpness: number;
  brightness: number;
  contrast: number;
  hasFaces: boolean;
  isDuplicate: boolean;
  hash: string;
}

export async function analyzePhoto(
  filePath: string,
  photoId: string
): Promise<PhotoQualityScore> {
  const image = sharp(filePath);
  const metadata = await image.metadata();
  const stats = await image.stats();

  // 1. Calculate sharpness (Laplacian variance)
  const sharpness = await calculateSharpness(image);

  // 2. Calculate brightness
  const brightness = calculateBrightness(stats);

  // 3. Calculate contrast
  const contrast = calculateContrast(stats);

  // 4. Detect faces (simple skin tone detection)
  const hasFaces = await detectFaces(image);

  // 5. Generate perceptual hash for duplicate detection
  const hash = await generateHash(filePath);

  // 6. Calculate overall quality score
  const qualityScore = calculateQualityScore({
    sharpness,
    brightness,
    contrast,
    hasFaces,
    resolution: metadata.width! * metadata.height!,
  });

  return {
    id: photoId,
    filename: filePath.split('/').pop()!,
    qualityScore,
    sharpness,
    brightness,
    contrast,
    hasFaces,
    isDuplicate: false, // Set later when comparing hashes
    hash,
  };
}

// Calculate sharpness using Laplacian variance
async function calculateSharpness(image: sharp.Sharp): Promise<number> {
  const { data, info } = await image
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Apply Laplacian filter (simple edge detection)
  let variance = 0;
  const width = info.width;
  const height = info.height;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const laplacian =
        -data[idx - width - 1] - data[idx - width] - data[idx - width + 1] -
        data[idx - 1] + 8 * data[idx] - data[idx + 1] -
        data[idx + width - 1] - data[idx + width] - data[idx + width + 1];
      variance += laplacian * laplacian;
    }
  }

  return Math.min(100, variance / ((width - 2) * (height - 2)) / 100);
}

// Calculate brightness from image stats
function calculateBrightness(stats: sharp.Stats): number {
  const avgBrightness = stats.channels.reduce(
    (sum, channel) => sum + channel.mean,
    0
  ) / stats.channels.length;
  return (avgBrightness / 255) * 100;
}

// Calculate contrast
function calculateContrast(stats: sharp.Stats): number {
  const avgStdDev = stats.channels.reduce(
    (sum, channel) => sum + channel.stdev,
    0
  ) / stats.channels.length;
  return Math.min(100, (avgStdDev / 128) * 100);
}

// Simple face detection using skin tone analysis
async function detectFaces(image: sharp.Sharp): Promise<boolean> {
  const { data, info } = await image
    .resize(200, 200, { fit: 'inside' }) // Reduce for speed
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  let skinPixels = 0;
  const totalPixels = width * height;

  for (let i = 0; i < data.length; i += 3) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Simple skin tone detection (HSV-based)
    if (isSkinTone(r, g, b)) {
      skinPixels++;
    }
  }

  const skinRatio = skinPixels / totalPixels;
  return skinRatio > 0.1; // 10%+ skin tone = likely has faces
}

function isSkinTone(r: number, g: number, b: number): boolean {
  // Simple RGB skin tone detection
  return (
    r > 95 && g > 40 && b > 20 &&
    r > g && r > b &&
    Math.abs(r - g) > 15 &&
    r - Math.min(g, b) > 15
  );
}

// Generate perceptual hash for duplicate detection
async function generateHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    imageHash(filePath, 16, true, (error: Error | null, data: string) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

// Calculate overall quality score
function calculateQualityScore(metrics: {
  sharpness: number;
  brightness: number;
  contrast: number;
  hasFaces: boolean;
  resolution: number;
}): number {
  let score = 0;

  // Sharpness (30% weight)
  score += metrics.sharpness * 0.3;

  // Brightness (20% weight) - penalize too dark or too bright
  const idealBrightness = 50;
  const brightnessPenalty = Math.abs(metrics.brightness - idealBrightness) / idealBrightness;
  score += (1 - brightnessPenalty) * 100 * 0.2;

  // Contrast (20% weight)
  score += metrics.contrast * 0.2;

  // Has faces (20% weight)
  score += metrics.hasFaces ? 20 : 0;

  // Resolution (10% weight)
  const minResolution = 1920 * 1080;
  const resolutionScore = Math.min(100, (metrics.resolution / minResolution) * 100);
  score += resolutionScore * 0.1;

  return Math.round(Math.min(100, Math.max(0, score)));
}

// Find duplicates using perceptual hashing
export function findDuplicates(photos: PhotoQualityScore[]): PhotoQualityScore[] {
  const hashMap = new Map<string, PhotoQualityScore[]>();

  // Group by hash
  photos.forEach((photo) => {
    const existing = hashMap.get(photo.hash) || [];
    existing.push(photo);
    hashMap.set(photo.hash, existing);
  });

  // Mark duplicates (keep highest quality)
  const results = photos.map((photo) => ({ ...photo }));
  
  hashMap.forEach((group) => {
    if (group.length > 1) {
      // Sort by quality, keep best
      group.sort((a, b) => b.qualityScore - a.qualityScore);
      
      // Mark rest as duplicates
      for (let i = 1; i < group.length; i++) {
        const idx = results.findIndex((p) => p.id === group[i].id);
        if (idx !== -1) {
          results[idx].isDuplicate = true;
        }
      }
    }
  });

  return results;
}

// Select best N photos
export function selectBestPhotos(
  photos: PhotoQualityScore[],
  count: number = 30
): PhotoQualityScore[] {
  return photos
    .filter((p) => !p.isDuplicate && p.qualityScore > 30) // Exclude bad photos
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, count);
}
```

### Step 3: Create API Endpoint
**File:** `src/app/api/photos/analyze/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { analyzePhoto, findDuplicates, selectBestPhotos } from '@/lib/ai/photoAnalyzer';
import { getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const { photoIds } = await request.json();

    // Analyze all uploaded photos
    const analyses = await Promise.all(
      photoIds.map((id: string) => {
        const filePath = `/uploads/${session?.id || 'guest'}/${id}`;
        return analyzePhoto(filePath, id);
      })
    );

    // Find duplicates
    const withDuplicates = findDuplicates(analyses);

    // Select best photos
    const bestPhotos = selectBestPhotos(withDuplicates, 30);

    return NextResponse.json({
      total: analyses.length,
      best: bestPhotos,
      duplicatesRemoved: withDuplicates.filter((p) => p.isDuplicate).length,
      lowQualityRemoved: analyses.length - withDuplicates.filter((p) => p.qualityScore > 30).length,
    });
  } catch (error) {
    console.error('Photo analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
```

### Step 4: Update Upload Page UI
**File:** `src/app/upload/page.tsx`

Add after photo upload completes:

```typescript
// After photos uploaded
const analyzePhotos = async () => {
  setAnalyzing(true);
  
  const response = await fetch('/api/photos/analyze', {
    method: 'POST',
    body: JSON.stringify({ photoIds: uploadedPhotos.map(p => p.id) }),
  });
  
  const result = await response.json();
  
  // Show AI suggestion
  setAiSuggestion({
    bestPhotos: result.best,
    duplicates: result.duplicatesRemoved,
    lowQuality: result.lowQualityRemoved,
  });
  
  setAnalyzing(false);
};
```

Add UI component:

```tsx
{aiSuggestion && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-8 mb-6"
  >
    <h3 className="text-2xl font-bold mb-4">✨ Smart Selection Ready!</h3>
    <p className="text-neutral-300 mb-6">
      We analyzed your {uploadedPhotos.length} photos and found your {aiSuggestion.bestPhotos.length} best moments.
      We removed {aiSuggestion.duplicates} duplicates and {aiSuggestion.lowQuality} low-quality photos.
    </p>
    
    <div className="flex gap-4">
      <Button
        variant="primary"
        size="lg"
        onClick={() => applyAiSelection(aiSuggestion.bestPhotos)}
      >
        Use AI Selection
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={() => setShowAllPhotos(true)}
      >
        View All Photos
      </Button>
    </div>
  </motion.div>
)}
```

---

## 📅 Phase 2: Date-Based Sorting (Week 1)

### Feature: Auto-organize photos chronologically

### Step 1: Extract EXIF Data
**File:** `src/lib/ai/exifParser.ts`

```typescript
import ExifReader from 'exifreader';

interface PhotoMetadata {
  id: string;
  dateTaken: Date | null;
  location: { lat: number; lon: number } | null;
  camera: string | null;
  orientation: number;
}

export async function extractEXIF(filePath: string, photoId: string): Promise<PhotoMetadata> {
  try {
    const tags = await ExifReader.load(filePath);
    
    const dateTaken = tags.DateTime?.description
      ? parseExifDate(tags.DateTime.description)
      : null;
    
    const location =
      tags.GPSLatitude && tags.GPSLongitude
        ? {
            lat: tags.GPSLatitude.description,
            lon: tags.GPSLongitude.description,
          }
        : null;
    
    const camera = tags.Model?.description || null;
    const orientation = tags.Orientation?.value || 1;
    
    return { id: photoId, dateTaken, location, camera, orientation };
  } catch (error) {
    return { id: photoId, dateTaken: null, location: null, camera: null, orientation: 1 };
  }
}

function parseExifDate(dateStr: string): Date {
  // EXIF format: "2025:02:15 16:30:45"
  const [date, time] = dateStr.split(' ');
  const [year, month, day] = date.split(':');
  return new Date(`${year}-${month}-${day}T${time}`);
}

// Group photos by date ranges
export function groupByDateRanges(photos: PhotoMetadata[]): Map<string, PhotoMetadata[]> {
  const sorted = photos
    .filter((p) => p.dateTaken)
    .sort((a, b) => a.dateTaken!.getTime() - b.dateTaken!.getTime());
  
  const groups = new Map<string, PhotoMetadata[]>();
  let currentGroup: PhotoMetadata[] = [];
  let currentDate: Date | null = null;
  
  sorted.forEach((photo) => {
    if (!currentDate) {
      currentDate = photo.dateTaken!;
      currentGroup = [photo];
    } else {
      const daysDiff = Math.abs(
        (photo.dateTaken!.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff <= 1) {
        // Same day or next day
        currentGroup.push(photo);
      } else {
        // New group
        const label = formatDateRange(currentGroup);
        groups.set(label, currentGroup);
        currentDate = photo.dateTaken!;
        currentGroup = [photo];
      }
    }
  });
  
  if (currentGroup.length > 0) {
    const label = formatDateRange(currentGroup);
    groups.set(label, currentGroup);
  }
  
  return groups;
}

function formatDateRange(photos: PhotoMetadata[]): string {
  const first = photos[0].dateTaken!;
  const last = photos[photos.length - 1].dateTaken!;
  
  if (first.toDateString() === last.toDateString()) {
    return first.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } else {
    return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }
}
```

---

## ⚠️ Phase 3: Quality Warnings (Week 1)

### Feature: Alert users to photos that won't print well

### Implementation:
**File:** `src/lib/ai/printQuality.ts`

```typescript
interface PrintQualityCheck {
  photoId: string;
  warnings: string[];
  canPrint: boolean;
  resolution: { width: number; height: number };
  dpi: number;
}

export async function checkPrintQuality(
  filePath: string,
  photoId: string,
  printSize: { width: number; height: number } = { width: 8, height: 10 } // inches
): Promise<PrintQualityCheck> {
  const image = sharp(filePath);
  const metadata = await image.metadata();
  const stats = await image.stats();
  
  const warnings: string[] = [];
  const requiredDPI = 300; // Standard print quality
  
  // Calculate DPI
  const dpiWidth = metadata.width! / printSize.width;
  const dpiHeight = metadata.height! / printSize.height;
  const dpi = Math.min(dpiWidth, dpiHeight);
  
  // Check resolution
  if (dpi < requiredDPI) {
    warnings.push(`Low resolution (${Math.round(dpi)} DPI). Photos print best at 300 DPI or higher.`);
  }
  
  // Check if too dark
  const avgBrightness = stats.channels.reduce((sum, ch) => sum + ch.mean, 0) / stats.channels.length;
  if (avgBrightness < 50) {
    warnings.push('Photo is very dark and may not print well.');
  }
  
  // Check if too bright (overexposed)
  if (avgBrightness > 200) {
    warnings.push('Photo is overexposed (too bright).');
  }
  
  // Check sharpness (reuse from photoAnalyzer)
  const sharpness = await calculateSharpness(image);
  if (sharpness < 20) {
    warnings.push('Photo appears blurry.');
  }
  
  return {
    photoId,
    warnings,
    canPrint: warnings.length === 0,
    resolution: { width: metadata.width!, height: metadata.height! },
    dpi: Math.round(dpi),
  };
}
```

---

## 🎨 Phase 4-8: Remaining Features

Due to length, I'll create separate implementation files for:
- Auto Layout Suggestions
- Smart Cover Picker
- Template Matching
- Face Grouping
- Caption Suggestions

**Should I continue with detailed implementations for these?**

---

## 📊 Testing & Deployment

### Local Testing:
```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Upload test photos (100+ with variety)
# 4. Check console for AI analysis results
# 5. Verify UI shows suggestions
```

### Performance Optimization:
- Process photos in parallel (Promise.all)
- Use worker threads for CPU-intensive tasks
- Cache analysis results in database
- Show progressive results (don't wait for all photos)

---

**Want me to continue with the remaining 5 features?** 🚀
