/**
 * Unit Tests: Layout Generation
 */

import { describe, it, expect } from 'vitest';
import { generateBookLayout } from '@/lib/layout/generator';
import type { Photo } from '@/lib/db/schema';

describe('Layout Generation', () => {
  const mockPhoto = (id: string, overrides = {}): Photo => ({
    id,
    bookId: 'test-book',
    originalUrl: `https://example.com/${id}.jpg`,
    processedUrl: `https://example.com/${id}_processed.jpg`,
    enhancedUrl: null,
    enhancementLevel: 'auto',
    thumbnailUrl: `https://example.com/${id}_thumb.jpg`,
    filename: `photo-${id}.jpg`,
    fileSize: 1024000,
    mimeType: 'image/jpeg',
    width: 3000,
    height: 2000,
    aspectRatio: '1.5',
    dateTaken: new Date('2024-01-15'),
    cameraMake: 'Apple',
    cameraModel: 'iPhone 14',
    exifOrientation: 1,
    qualityScore: 85,
    sharpnessScore: '95.5',
    hasFaces: true,
    faceCount: 2,
    dominantColor: '#3498DB',
    colorPalette: null,
    orientation: 'landscape',
    isDuplicate: false,
    duplicateOf: null,
    usedInLayout: false,
    sortOrder: null,
    createdAt: new Date(),
    ...overrides,
  });

  describe('generateBookLayout', () => {
    it('should throw error with no photos', async () => {
      await expect(generateBookLayout([])).rejects.toThrow('No photos to generate layout');
    });
    
    it('should create cover page with single photo', async () => {
      const photos = [mockPhoto('1')];
      const pages = await generateBookLayout(photos);
      
      expect(pages).toHaveLength(2); // Cover + blank to make even
      expect(pages[0].template).toBe('hero');
      expect(pages[0].pageNumber).toBe(1);
    });
    
    it('should generate multiple pages for multiple photos', async () => {
      const photos = Array.from({ length: 10 }, (_, i) => 
        mockPhoto(`photo-${i}`, { qualityScore: 70 + i })
      );
      
      const pages = await generateBookLayout(photos);
      
      expect(pages.length).toBeGreaterThan(2);
      expect(pages[0].template).toBe('hero'); // First page is cover
    });
    
    it('should ensure even page count', async () => {
      const photos = Array.from({ length: 5 }, (_, i) => mockPhoto(`${i}`));
      const pages = await generateBookLayout(photos);
      
      expect(pages.length % 2).toBe(0); // Even number of pages
    });
    
    it('should assign sequential page numbers', async () => {
      const photos = Array.from({ length: 6 }, (_, i) => mockPhoto(`${i}`));
      const pages = await generateBookLayout(photos);
      
      pages.forEach((page, index) => {
        expect(page.pageNumber).toBe(index + 1);
      });
    });
  });
});
