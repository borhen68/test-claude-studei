/**
 * Interior Pages PDF Generator
 * Generates all interior pages with layouts and captions
 */

import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import { getBookSize, SAFE_ZONES, inchesToPixels, DPI } from './config';
import { processImageForPrint } from './image-processor';

export interface PageLayout {
  photoId: string;
  position: {
    x: number; // 0-1 (percentage of page)
    y: number;
    width: number;
    height: number;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface BookPage {
  pageNumber: number;
  template: string;
  photos: Array<{
    id: string;
    url: string;
    layout: PageLayout;
  }>;
  textContent?: string;
  caption?: string;
}

export interface InteriorPagesOptions {
  bookSize: string;
  pages: BookPage[];
}

/**
 * Generate interior pages PDF
 */
export async function generateInteriorPagesPDF(
  options: InteriorPagesOptions
): Promise<Buffer> {
  const sizeSpec = getBookSize(options.bookSize);

  const widthPoints = sizeSpec.bleedWidth * 72;
  const heightPoints = sizeSpec.bleedHeight * 72;

  console.log(`Generating ${options.pages.length} interior pages...`);

  // Create PDF document
  const doc = new PDFDocument({
    size: [widthPoints, heightPoints],
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    autoFirstPage: false,
  });

  const chunks: Buffer[] = [];
  const stream = new PassThrough();
  stream.on('data', (chunk) => chunks.push(chunk));
  doc.pipe(stream);

  // Generate each page
  for (const page of options.pages) {
    console.log(`Rendering page ${page.pageNumber}...`);
    await renderPage(doc, page, sizeSpec, widthPoints, heightPoints);
  }

  // Finalize PDF
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

/**
 * Render a single page with photos and layout
 */
async function renderPage(
  doc: typeof PDFDocument.prototype,
  page: BookPage,
  sizeSpec: any,
  widthPoints: number,
  heightPoints: number
) {
  // Add new page
  doc.addPage({ size: [widthPoints, heightPoints] });

  // White background
  doc.rect(0, 0, widthPoints, heightPoints).fill('#ffffff');

  // Render photos based on layout
  for (const photo of page.photos) {
    await renderPhoto(
      doc,
      photo.url,
      photo.layout,
      sizeSpec,
      widthPoints,
      heightPoints
    );
  }

  // Add text/caption if present
  if (page.textContent || page.caption) {
    renderText(doc, page.textContent || page.caption!, sizeSpec, widthPoints, heightPoints);
  }
}

/**
 * Render a photo on the page with specific layout
 */
async function renderPhoto(
  doc: typeof PDFDocument.prototype,
  photoUrl: string,
  layout: PageLayout,
  sizeSpec: any,
  pageWidth: number,
  pageHeight: number
) {
  try {
    // Calculate absolute position from percentage
    const x = layout.position.x * pageWidth;
    const y = layout.position.y * pageHeight;
    const width = layout.position.width * pageWidth;
    const height = layout.position.height * pageHeight;

    // Convert dimensions to inches for processing
    const widthInches = width / 72;
    const heightInches = height / 72;

    // Process image to exact dimensions
    const processed = await processImageForPrint(photoUrl, {
      targetWidthInches: widthInches,
      targetHeightInches: heightInches,
      fit: 'cover',
      position: 'center',
    });

    // Add image to PDF
    doc.image(processed.buffer, x, y, {
      width,
      height,
    });

    // Log warnings if any
    if (processed.warnings.length > 0) {
      console.warn(`⚠️ Page photo warnings:`, processed.warnings);
    }
  } catch (error) {
    console.error(`Failed to render photo:`, error);
    // Draw placeholder rectangle
    doc.rect(x, y, width, height)
      .fillAndStroke('#cccccc', '#999999');
  }
}

/**
 * Render text/caption on page
 */
function renderText(
  doc: typeof PDFDocument.prototype,
  text: string,
  sizeSpec: any,
  pageWidth: number,
  pageHeight: number
) {
  const marginPoints = SAFE_ZONES.textMargin * 72;
  const textAreaWidth = pageWidth - marginPoints * 2;
  const textAreaHeight = 100;

  // Position text at bottom of page within safe zone
  const x = marginPoints;
  const y = pageHeight - marginPoints - textAreaHeight;

  doc.fontSize(14);
  doc.fillColor('#333333');
  doc.text(text, x, y, {
    width: textAreaWidth,
    height: textAreaHeight,
    align: 'center',
    lineGap: 5,
  });
}

/**
 * Generate a simple page with single photo
 */
export async function generateSinglePhotoPage(
  bookSize: string,
  photoUrl: string,
  caption?: string
): Promise<Buffer> {
  return generateInteriorPagesPDF({
    bookSize,
    pages: [
      {
        pageNumber: 1,
        template: 'hero',
        photos: [
          {
            id: '1',
            url: photoUrl,
            layout: {
              photoId: '1',
              position: { x: 0.05, y: 0.05, width: 0.9, height: 0.9 },
            },
          },
        ],
        caption,
      },
    ],
  });
}

/**
 * Calculate page layout positions for common templates
 */
export const LAYOUT_TEMPLATES = {
  hero: (pageWidth: number, pageHeight: number) => [
    { x: 0.05, y: 0.05, width: 0.9, height: 0.9 },
  ],
  
  duo_horizontal: (pageWidth: number, pageHeight: number) => [
    { x: 0.02, y: 0.1, width: 0.47, height: 0.8 },
    { x: 0.51, y: 0.1, width: 0.47, height: 0.8 },
  ],
  
  duo_vertical: (pageWidth: number, pageHeight: number) => [
    { x: 0.15, y: 0.02, width: 0.7, height: 0.47 },
    { x: 0.15, y: 0.51, width: 0.7, height: 0.47 },
  ],
  
  trio_asymmetric: (pageWidth: number, pageHeight: number) => [
    { x: 0.02, y: 0.02, width: 0.6, height: 0.96 },
    { x: 0.64, y: 0.02, width: 0.34, height: 0.47 },
    { x: 0.64, y: 0.51, width: 0.34, height: 0.47 },
  ],
  
  quad_grid: (pageWidth: number, pageHeight: number) => [
    { x: 0.02, y: 0.02, width: 0.47, height: 0.47 },
    { x: 0.51, y: 0.02, width: 0.47, height: 0.47 },
    { x: 0.02, y: 0.51, width: 0.47, height: 0.47 },
    { x: 0.51, y: 0.51, width: 0.47, height: 0.47 },
  ],
  
  gallery_6: (pageWidth: number, pageHeight: number) => [
    { x: 0.02, y: 0.02, width: 0.31, height: 0.47 },
    { x: 0.345, y: 0.02, width: 0.31, height: 0.47 },
    { x: 0.67, y: 0.02, width: 0.31, height: 0.47 },
    { x: 0.02, y: 0.51, width: 0.31, height: 0.47 },
    { x: 0.345, y: 0.51, width: 0.31, height: 0.47 },
    { x: 0.67, y: 0.51, width: 0.31, height: 0.47 },
  ],
};
