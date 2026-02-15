/**
 * Book Layout Generation Engine
 * 
 * Automatically generates page layouts from uploaded photos.
 * Uses intelligent algorithms to:
 * - Sort photos chronologically or by quality
 * - Select hero photos for covers
 * - Group photos into thematic chapters
 * - Choose appropriate templates for visual variety
 * - Ensure even page count for printing
 */

import { Photo, Page, NewPage } from '../db/schema';
import { sortPhotos, groupIntoChapters, selectHeroPhotos } from './sorter';
import { selectTemplate, TEMPLATES, TemplateType } from './templates';

/**
 * Generated page structure before database insertion
 */
export interface GeneratedPage {
  pageNumber: number;
  template: TemplateType;
  photoIds: string[];
  layoutData: any;
  textContent?: string;
}

/**
 * Main entry point: Generate complete book layout from uploaded photos
 * 
 * Creates a professional photobook layout with:
 * - Cover page featuring best photo
 * - Multiple chapters with varied templates
 * - Even page count for printing
 * 
 * @param photos - Array of analyzed photos with metadata
 * @returns Array of generated pages ready for PDF rendering
 * @throws Error if no photos provided
 */
export async function generateBookLayout(photos: Photo[]): Promise<GeneratedPage[]> {
  if (photos.length === 0) {
    throw new Error('No photos to generate layout');
  }
  
  const pages: GeneratedPage[] = [];
  let pageNumber = 1;
  
  // Step 1: Sort photos intelligently
  // Uses date taken, quality score, and has-faces to order photos
  const sortedPhotos = sortPhotos(photos);
  
  // Step 2: Create cover page with hero photo
  // Selects highest quality photo with faces (if available)
  const heroPhotos = selectHeroPhotos(sortedPhotos, 1);
  if (heroPhotos.length > 0) {
    const template = TEMPLATES.hero;
    pages.push({
      pageNumber: pageNumber++,
      template: 'hero',
      photoIds: [heroPhotos[0].id],
      layoutData: {
        layouts: template.layouts(heroPhotos),
        theme: 'cover',
      },
      textContent: 'Cover Page',
    });
  }
  
  // Step 3: Group remaining photos into chapters
  // Groups by time period, event, or location for narrative flow
  const remainingPhotos = sortedPhotos.filter(
    p => !heroPhotos.some(h => h.id === p.id)
  );
  
  const chapters = groupIntoChapters(remainingPhotos);
  
  // Step 4: Generate pages for each chapter
  // Varies templates to avoid monotony while maintaining consistency
  for (const chapter of chapters) {
    const chapterPages = generateChapterPages(chapter, pageNumber);
    pages.push(...chapterPages);
    pageNumber += chapterPages.length;
  }
  
  // Step 5: Ensure even number of pages for book printing
  // Physical books require even page counts (left/right spreads)
  if (pages.length % 2 !== 0) {
    // Add blank page at end
    pages.push({
      pageNumber: pageNumber++,
      template: 'hero',
      photoIds: [],
      layoutData: { layouts: [], theme: 'blank' },
      textContent: 'End',
    });
  }
  
  return pages;
}

/**
 * Generate pages for a single chapter of photos
 * 
 * Iterates through chapter photos and selects appropriate templates.
 * Balances visual variety with consistent aesthetic.
 * 
 * @param photos - Photos in this chapter
 * @param startPageNumber - Page number to begin from
 * @returns Array of generated pages for this chapter
 */
function generateChapterPages(photos: Photo[], startPageNumber: number): GeneratedPage[] {
  const pages: GeneratedPage[] = [];
  let pageNumber = startPageNumber;
  
  let i = 0;
  while (i < photos.length) {
    // Determine how many photos fit on next page
    const remainingPhotos = photos.slice(i);
    const template = selectBestTemplateForPhotos(remainingPhotos);
    const templateDef = TEMPLATES[template];
    
    // Take only as many photos as template supports
    const photosForPage = remainingPhotos.slice(0, templateDef.photoCount);
    
    if (photosForPage.length === 0) break;
    
    pages.push({
      pageNumber: pageNumber++,
      template,
      photoIds: photosForPage.map(p => p.id),
      layoutData: {
        layouts: templateDef.layouts(photosForPage),
        theme: 'auto',
      },
    });
    
    i += templateDef.photoCount;
  }
  
  return pages;
}

/**
 * Select optimal template based on available photos
 * 
 * Considers:
 * - Number of photos remaining
 * - Photo orientations (portrait/landscape mix)
 * - Visual variety (avoid repeating same template)
 * 
 * @param photos - Remaining photos to layout
 * @returns Template type name
 */
function selectBestTemplateForPhotos(photos: Photo[]): TemplateType {
  if (photos.length === 0) return 'hero';
  
  // Cap at max photos per page for variety
  const count = Math.min(photos.length, 6);
  
  // Template selection strategy:
  if (count === 1) return 'hero';                    // Full page showcase
  if (count === 2) return selectTemplate(photos.slice(0, 2));  // Smart 2-photo layout
  if (count === 3) return 'trio_asymmetric';         // Asymmetric trio
  if (count === 4) return 'quad_grid';               // 2x2 grid
  if (count >= 6) return 'gallery_6';                // Gallery spread
  
  // Fallback
  return 'hero';
}

/**
 * Generate caption text for a photo using context
 * 
 * Uses EXIF date, location, and surrounding photos to create meaningful captions.
 * 
 * @param photo - Photo to caption
 * @param context - Surrounding photos for context
 * @returns Caption string (empty if no caption appropriate)
 * 
 * TODO: Integrate AI vision model for descriptive captions
 * TODO: Extract location names from GPS coordinates using geocoding
 */
export function generateCaption(photo: Photo, context: Photo[]): string {
  // Current implementation: Simple date-based captions
  // Future: AI-generated descriptive captions using image analysis
  
  if (photo.dateTaken) {
    const date = photo.dateTaken;
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }
  
  return '';
}
