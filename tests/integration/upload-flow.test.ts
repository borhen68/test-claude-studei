/**
 * Integration Tests: Photo Upload Flow
 * 
 * Tests the complete upload workflow - photo processing and analysis.
 * Note: Database tests skipped due to schema differences between dev (SQLite) and prod (Postgres).
 */

import { describe, it, expect } from 'vitest';
import { processPhoto } from '@/lib/photo-analysis/processor';
import sharp from 'sharp';

describe('Upload Flow Integration', () => {
  it('should process a photo end-to-end', async () => {
    // Create a test image with known properties
    const buffer = await sharp({
      create: {
        width: 2000,
        height: 1500,
        channels: 3,
        background: { r: 100, g: 150, b: 200 }
      }
    })
    .jpeg()
    .toBuffer();
    
    // Process the photo through the full pipeline
    const analysis = await processPhoto(buffer);
    
    // Verify all analysis steps completed
    expect(analysis.width).toBe(2000);
    expect(analysis.height).toBe(1500);
    expect(analysis.aspectRatio).toBeCloseTo(1.33, 1);
    expect(analysis.orientation).toBe('landscape');
    
    // Quality analysis should run
    expect(analysis.qualityScore).toBeGreaterThan(0);
    expect(analysis.qualityScore).toBeLessThanOrEqual(100);
    expect(analysis.sharpnessScore).toBeGreaterThanOrEqual(0);
    
    // Color analysis should produce a hex color
    expect(analysis.dominantColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(Array.isArray(analysis.colorPalette)).toBe(true);
    
    // EXIF data may be null for generated images
    expect(analysis.exifOrientation).toBe(1); // Default value
  });
  
  it('should handle batch processing', async () => {
    const photoCount = 3;
    const photoBuffers: { buffer: Buffer; filename: string }[] = [];
    
    // Create multiple test images
    for (let i = 0; i < photoCount; i++) {
      const buffer = await sharp({
        create: {
          width: 1600 + (i * 100),
          height: 1200,
          channels: 3,
          background: { r: i * 50, g: 100, b: 200 }
        }
      })
      .jpeg()
      .toBuffer();
      
      photoBuffers.push({ buffer, filename: `photo-${i}.jpg` });
    }
    
    // Import batch processor
    const { batchProcessPhotos } = await import('@/lib/photo-analysis/processor');
    
    let progressCalls = 0;
    const results = await batchProcessPhotos(
      photoBuffers,
      (current, total) => {
        progressCalls++;
        expect(current).toBeLessThanOrEqual(total);
        expect(total).toBe(photoCount);
      }
    );
    
    // Verify all photos processed
    expect(results.size).toBe(photoCount);
    expect(progressCalls).toBe(photoCount);
    
    // Verify each result
    photoBuffers.forEach(({ filename }) => {
      const analysis = results.get(filename);
      expect(analysis).toBeDefined();
      expect(analysis!.qualityScore).toBeGreaterThan(0);
    });
  });
  
  it('should detect orientation correctly', async () => {
    // Test portrait orientation
    const portraitBuffer = await sharp({
      create: { width: 1000, height: 1500, channels: 3, background: { r: 255, g: 0, b: 0 } }
    }).jpeg().toBuffer();
    
    const portrait = await processPhoto(portraitBuffer);
    expect(portrait.orientation).toBe('portrait');
    expect(portrait.aspectRatio).toBeLessThan(1);
    
    // Test landscape orientation
    const landscapeBuffer = await sharp({
      create: { width: 1500, height: 1000, channels: 3, background: { r: 0, g: 255, b: 0 } }
    }).jpeg().toBuffer();
    
    const landscape = await processPhoto(landscapeBuffer);
    expect(landscape.orientation).toBe('landscape');
    expect(landscape.aspectRatio).toBeGreaterThan(1);
    
    // Test square
    const squareBuffer = await sharp({
      create: { width: 1200, height: 1200, channels: 3, background: { r: 0, g: 0, b: 255 } }
    }).jpeg().toBuffer();
    
    const square = await processPhoto(squareBuffer);
    expect(square.orientation).toBe('square');
    expect(square.aspectRatio).toBeCloseTo(1, 1);
  });
});
