import { Photo, Page, NewPage } from '../db/schema';
import { sortPhotos, groupIntoChapters, selectHeroPhotos } from './sorter';
import { selectTemplate, TEMPLATES, TemplateType } from './templates';

export interface GeneratedPage {
  pageNumber: number;
  template: TemplateType;
  photoIds: string[];
  layoutData: any;
  textContent?: string;
}

/**
 * Generate complete book layout from photos
 */
export async function generateBookLayout(photos: Photo[]): Promise<GeneratedPage[]> {
  if (photos.length === 0) {
    throw new Error('No photos to generate layout');
  }
  
  const pages: GeneratedPage[] = [];
  let pageNumber = 1;
  
  // 1. Sort photos intelligently
  const sortedPhotos = sortPhotos(photos);
  
  // 2. Create cover page (hero photo)
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
  
  // 3. Group remaining photos into chapters
  const remainingPhotos = sortedPhotos.filter(
    p => !heroPhotos.some(h => h.id === p.id)
  );
  
  const chapters = groupIntoChapters(remainingPhotos);
  
  // 4. Generate pages for each chapter
  for (const chapter of chapters) {
    const chapterPages = generateChapterPages(chapter, pageNumber);
    pages.push(...chapterPages);
    pageNumber += chapterPages.length;
  }
  
  // 5. Ensure even number of pages (for book printing)
  if (pages.length % 2 !== 0) {
    // Add blank page
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
 * Generate pages for a chapter of photos
 */
function generateChapterPages(photos: Photo[], startPageNumber: number): GeneratedPage[] {
  const pages: GeneratedPage[] = [];
  let pageNumber = startPageNumber;
  
  let i = 0;
  while (i < photos.length) {
    // Determine how many photos for this page
    const remainingPhotos = photos.slice(i);
    const template = selectBestTemplateForPhotos(remainingPhotos);
    const templateDef = TEMPLATES[template];
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
 * Select best template for current set of photos
 */
function selectBestTemplateForPhotos(photos: Photo[]): TemplateType {
  if (photos.length === 0) return 'hero';
  
  // Vary template selection to avoid repetition
  const count = Math.min(photos.length, 6);
  
  if (count === 1) return 'hero';
  if (count === 2) return selectTemplate(photos.slice(0, 2));
  if (count === 3) return 'trio_asymmetric';
  if (count === 4) return 'quad_grid';
  if (count >= 6) return 'gallery_6';
  
  return 'hero';
}

/**
 * Generate captions for photos using AI-like logic
 */
export function generateCaption(photo: Photo, context: Photo[]): string {
  // Placeholder for AI caption generation
  // In real implementation, this would use:
  // - EXIF data (location, date)
  // - Image content analysis
  // - Context from surrounding photos
  
  if (photo.dateTaken) {
    const date = photo.dateTaken;
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }
  
  return '';
}
