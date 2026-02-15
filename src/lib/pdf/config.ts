/**
 * PDF Generation Configuration
 * Print-ready specifications for CloudPrinter
 */

export const DPI = 300;
export const BLEED_MM = 3;
export const BLEED_INCHES = BLEED_MM / 25.4; // ~0.118 inches

export interface BookSizeSpec {
  name: string;
  trimWidth: number; // inches
  trimHeight: number;
  bleedWidth: number; // inches (trim + bleed)
  bleedHeight: number;
  pixelWidth: number; // at 300 DPI
  pixelHeight: number;
  cmykProfile: string;
}

/**
 * Book size specifications with bleed
 */
export const BOOK_SIZES: Record<string, BookSizeSpec> = {
  '8x8': {
    name: '8x8" Square Book',
    trimWidth: 8,
    trimHeight: 8,
    bleedWidth: 8.24,
    bleedHeight: 8.24,
    pixelWidth: 2400,
    pixelHeight: 2400,
    cmykProfile: 'USWebCoatedSWOP',
  },
  '10x10': {
    name: '10x10" Square Book',
    trimWidth: 10,
    trimHeight: 10,
    bleedWidth: 10.24,
    bleedHeight: 10.24,
    pixelWidth: 3000,
    pixelHeight: 3000,
    cmykProfile: 'USWebCoatedSWOP',
  },
  '12x12': {
    name: '12x12" Square Book',
    trimWidth: 12,
    trimHeight: 12,
    bleedWidth: 12.24,
    bleedHeight: 12.24,
    pixelWidth: 3600,
    pixelHeight: 3600,
    cmykProfile: 'USWebCoatedSWOP',
  },
};

/**
 * Calculate spine width based on page count
 * Formula: spine width = (page count / 2) * paper thickness
 */
export function calculateSpineWidth(pageCount: number): number {
  // Standard paper thickness for photo books: 0.012 inches per sheet
  const PAPER_THICKNESS = 0.012;
  const sheets = Math.ceil(pageCount / 2);
  return sheets * PAPER_THICKNESS;
}

/**
 * Safe zones and margins (in inches)
 */
export const SAFE_ZONES = {
  textMargin: 0.5, // Minimum distance from trim edge for text
  imageBleed: BLEED_INCHES, // Image extends to bleed edge
  bindingGutter: 0.25, // Extra margin near spine
};

/**
 * PDF generation quality settings
 */
export const QUALITY_SETTINGS = {
  minDPI: 150, // Warn if below this
  recommendedDPI: 300,
  jpegQuality: 95, // High quality for print
  compression: 'none' as const, // No compression for print-ready PDFs
};

/**
 * Color profile settings
 */
export const COLOR_PROFILES = {
  output: 'CMYK', // CloudPrinter requires CMYK
  profileName: 'USWebCoatedSWOP.icc', // Standard CMYK profile
  intent: 'perceptual' as const,
};

/**
 * Get book size specification
 */
export function getBookSize(sizeCode: string): BookSizeSpec {
  const size = BOOK_SIZES[sizeCode];
  if (!size) {
    throw new Error(`Unknown book size: ${sizeCode}. Available: ${Object.keys(BOOK_SIZES).join(', ')}`);
  }
  return size;
}

/**
 * Convert inches to pixels at specified DPI
 */
export function inchesToPixels(inches: number, dpi: number = DPI): number {
  return Math.round(inches * dpi);
}

/**
 * Convert pixels to inches at specified DPI
 */
export function pixelsToInches(pixels: number, dpi: number = DPI): number {
  return pixels / dpi;
}

/**
 * Validate image resolution meets print requirements
 */
export function validateImageResolution(
  imageWidth: number,
  imageHeight: number,
  targetWidthInches: number,
  targetHeightInches: number
): {
  valid: boolean;
  actualDPI: number;
  message?: string;
} {
  const dpiWidth = imageWidth / targetWidthInches;
  const dpiHeight = imageHeight / targetHeightInches;
  const actualDPI = Math.min(dpiWidth, dpiHeight);

  if (actualDPI < QUALITY_SETTINGS.minDPI) {
    return {
      valid: false,
      actualDPI,
      message: `Image resolution too low: ${Math.round(actualDPI)} DPI (minimum: ${QUALITY_SETTINGS.minDPI} DPI)`,
    };
  }

  if (actualDPI < QUALITY_SETTINGS.recommendedDPI) {
    return {
      valid: true,
      actualDPI,
      message: `Image resolution acceptable but not optimal: ${Math.round(actualDPI)} DPI (recommended: ${QUALITY_SETTINGS.recommendedDPI} DPI)`,
    };
  }

  return {
    valid: true,
    actualDPI,
  };
}
