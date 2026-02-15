/**
 * Photo Auto-Enhancement Engine
 * Applies intelligent brightness, contrast, and sharpness adjustments
 */

export interface EnhancementSettings {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  sharpness: number; // 0 to 100
  autoLevel: boolean;
  denoise: boolean;
}

export interface EnhancementLevel {
  level: 'none' | 'light' | 'moderate' | 'strong' | 'auto';
  settings: EnhancementSettings;
}

/**
 * Analyze photo histogram to determine optimal adjustments
 */
export function analyzeHistogram(imageData: ImageData): {
  avgBrightness: number;
  avgContrast: number;
  colorfulness: number;
  needsBrightening: boolean;
  needsContrast: boolean;
} {
  const pixels = imageData.data;
  let sumBrightness = 0;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let minBrightness = 255;
  let maxBrightness = 0;

  const pixelCount = pixels.length / 4;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Calculate brightness (luminance)
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    sumBrightness += brightness;

    sumR += r;
    sumG += g;
    sumB += b;

    minBrightness = Math.min(minBrightness, brightness);
    maxBrightness = Math.max(maxBrightness, brightness);
  }

  const avgBrightness = sumBrightness / pixelCount;
  const avgR = sumR / pixelCount;
  const avgG = sumG / pixelCount;
  const avgB = sumB / pixelCount;

  // Calculate contrast (range of brightness)
  const avgContrast = maxBrightness - minBrightness;

  // Calculate colorfulness (deviation from gray)
  const colorfulness = Math.sqrt(
    Math.pow(avgR - avgBrightness, 2) +
      Math.pow(avgG - avgBrightness, 2) +
      Math.pow(avgB - avgBrightness, 2)
  );

  return {
    avgBrightness,
    avgContrast,
    colorfulness,
    needsBrightening: avgBrightness < 110, // Dark photo
    needsContrast: avgContrast < 150, // Low contrast (flat photo)
  };
}

/**
 * Calculate auto-enhancement settings based on photo analysis
 */
export function calculateAutoEnhancement(analysis: {
  avgBrightness: number;
  avgContrast: number;
  colorfulness: number;
  needsBrightening: boolean;
  needsContrast: boolean;
}): EnhancementSettings {
  const settings: EnhancementSettings = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    autoLevel: false,
    denoise: false,
  };

  // Brightness adjustment
  if (analysis.needsBrightening) {
    // Dark photo: brighten proportionally
    const brightnessBoost = Math.min(30, (110 - analysis.avgBrightness) / 3);
    settings.brightness = Math.round(brightnessBoost);
  } else if (analysis.avgBrightness > 180) {
    // Too bright: darken slightly
    const brightnesReduce = Math.min(20, (analysis.avgBrightness - 180) / 5);
    settings.brightness = -Math.round(brightnessReduce);
  }

  // Contrast adjustment
  if (analysis.needsContrast) {
    // Low contrast: boost it
    const contrastBoost = Math.min(25, (150 - analysis.avgContrast) / 4);
    settings.contrast = Math.round(contrastBoost);
  }

  // Saturation adjustment
  if (analysis.colorfulness < 15) {
    // Dull colors: boost saturation
    settings.saturation = Math.round(Math.min(20, (20 - analysis.colorfulness) * 2));
  } else if (analysis.colorfulness > 60) {
    // Oversaturated: reduce slightly
    settings.saturation = -Math.round(Math.min(10, (analysis.colorfulness - 60) / 4));
  }

  // Always apply gentle sharpening
  settings.sharpness = 15;

  // Use auto-levels for very flat photos
  if (analysis.avgContrast < 100) {
    settings.autoLevel = true;
  }

  return settings;
}

/**
 * Get preset enhancement levels
 */
export function getEnhancementPresets(): Record<string, EnhancementLevel> {
  return {
    none: {
      level: 'none',
      settings: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        sharpness: 0,
        autoLevel: false,
        denoise: false,
      },
    },
    light: {
      level: 'light',
      settings: {
        brightness: 5,
        contrast: 8,
        saturation: 5,
        sharpness: 10,
        autoLevel: false,
        denoise: false,
      },
    },
    moderate: {
      level: 'moderate',
      settings: {
        brightness: 12,
        contrast: 15,
        saturation: 10,
        sharpness: 20,
        autoLevel: true,
        denoise: false,
      },
    },
    strong: {
      level: 'strong',
      settings: {
        brightness: 20,
        contrast: 25,
        saturation: 15,
        sharpness: 35,
        autoLevel: true,
        denoise: true,
      },
    },
  };
}

/**
 * Apply enhancement settings to image using CSS filters (client-side preview)
 */
export function generateCSSFilters(settings: EnhancementSettings): string {
  const filters: string[] = [];

  // Brightness: -100 to 100 → 0 to 2
  if (settings.brightness !== 0) {
    const brightness = 1 + settings.brightness / 100;
    filters.push(`brightness(${brightness})`);
  }

  // Contrast: -100 to 100 → 0 to 2
  if (settings.contrast !== 0) {
    const contrast = 1 + settings.contrast / 100;
    filters.push(`contrast(${contrast})`);
  }

  // Saturation: -100 to 100 → 0 to 2
  if (settings.saturation !== 0) {
    const saturation = 1 + settings.saturation / 100;
    filters.push(`saturate(${saturation})`);
  }

  // Sharpness using SVG filter simulation
  // Note: True sharpness requires server-side processing
  // This is an approximation for preview
  if (settings.sharpness > 0) {
    // Slight contrast boost simulates sharpening
    const sharpnessContrast = 1 + settings.sharpness / 500;
    if (!settings.contrast) {
      filters.push(`contrast(${sharpnessContrast})`);
    }
  }

  return filters.join(' ');
}

/**
 * Determine enhancement level from quality score
 */
export function getRecommendedEnhancementLevel(qualityScore: number): 'none' | 'light' | 'moderate' | 'strong' {
  if (qualityScore >= 85) return 'none'; // Excellent quality, no enhancement needed
  if (qualityScore >= 70) return 'light'; // Good quality, light touch-up
  if (qualityScore >= 50) return 'moderate'; // Fair quality, moderate enhancement
  return 'strong'; // Poor quality, aggressive enhancement
}
