/**
 * PDF Generation System - Main Exports
 */

// Core generator
export { generateBookPDF, regenerateBookPDF, getPDFStatus } from './print-generator';

// Cover generation
export { generateCoverPDF, generateSimpleCoverPDF } from './cover';

// Interior pages
export { generateInteriorPagesPDF, generateSinglePhotoPage, LAYOUT_TEMPLATES } from './pages';

// Image processing
export {
  processImageForPrint,
  processImageWithCMYK,
  cropAndFitWithBleed,
  checkCMYKSupport,
} from './image-processor';

// Configuration
export {
  getBookSize,
  calculateSpineWidth,
  validateImageResolution,
  inchesToPixels,
  pixelsToInches,
  BOOK_SIZES,
  DPI,
  SAFE_ZONES,
  QUALITY_SETTINGS,
} from './config';

// Types
export type { ProcessImageOptions, ProcessedImage } from './image-processor';
export type { CoverOptions } from './cover';
export type { InteriorPagesOptions, BookPage, PageLayout } from './pages';
export type { GeneratePDFResult } from './print-generator';
