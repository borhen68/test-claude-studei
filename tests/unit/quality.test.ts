/**
 * Unit Tests: Photo Quality Analysis
 * 
 * Tests the quality scoring algorithm that evaluates photos for print suitability.
 */

import { describe, it, expect } from 'vitest';
import { calculateQualityScore, meetsMinimumQuality } from '@/lib/photo-analysis/quality';
import sharp from 'sharp';

describe('Photo Quality Analysis', () => {
  describe('calculateQualityScore', () => {
    it('should give high score to high-resolution sharp image', async () => {
      // Create a high-quality test image: 4000x3000 (12MP)
      const buffer = await sharp({
        create: {
          width: 4000,
          height: 3000,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        }
      })
      .jpeg()
      .toBuffer();
      
      const result = await calculateQualityScore(buffer, true);
      
      expect(result.score).toBeGreaterThan(70);
      expect(result.megapixels).toBeCloseTo(12, 1);
    });
    
    it('should penalize low-resolution images', async () => {
      const buffer = await sharp({
        create: {
          width: 640,
          height: 480,
          channels: 3,
          background: { r: 100, g: 100, b: 100 }
        }
      })
      .jpeg()
      .toBuffer();
      
      const result = await calculateQualityScore(buffer, false);
      
      expect(result.score).toBeLessThan(60);
      expect(result.megapixels).toBeLessThan(1);
    });
  });
  
  describe('meetsMinimumQuality', () => {
    it('should accept good quality photos', () => {
      expect(meetsMinimumQuality(80, 3000, 2000)).toBe(true);
    });
    
    it('should reject low quality scores', () => {
      expect(meetsMinimumQuality(25, 3000, 2000)).toBe(false);
    });
    
    it('should reject low resolution even with high score', () => {
      expect(meetsMinimumQuality(90, 800, 600)).toBe(false);
    });
  });
});
