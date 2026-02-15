/**
 * Unit Tests: Color Analysis
 */

import { describe, it, expect } from 'vitest';
import { suggestTheme } from '@/lib/photo-analysis/colors';

describe('Color Analysis', () => {
  describe('suggestTheme', () => {
    it('should suggest warm theme for red/orange hues', () => {
      expect(suggestTheme('#FF5733')).toBe('warm'); // Orange-red
      expect(suggestTheme('#FF0000')).toBe('warm'); // Pure red
    });
    
    it('should suggest cool theme for blue hues', () => {
      expect(suggestTheme('#3498DB')).toBe('cool'); // Blue
      expect(suggestTheme('#00FFFF')).toBe('cool'); // Cyan
    });
    
    it('should suggest bw theme for grayscale', () => {
      expect(suggestTheme('#808080')).toBe('bw'); // Gray
      expect(suggestTheme('#333333')).toBe('bw'); // Dark gray
    });
    
    it('should suggest vintage for mid-range hues', () => {
      expect(suggestTheme('#9ACD32')).toBe('vintage'); // Yellow-green
    });
  });
});
