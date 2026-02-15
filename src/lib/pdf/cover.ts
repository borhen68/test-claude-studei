/**
 * Cover PDF Generator
 * Creates print-ready cover with front, spine, and back
 */

import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import { getBookSize, calculateSpineWidth, inchesToPixels, DPI } from './config';
import { processImageForPrint } from './image-processor';

export interface CoverOptions {
  bookSize: string; // '8x8', '10x10', '12x12'
  pageCount: number;
  frontCoverImage: string | Buffer;
  backCoverImage?: string | Buffer;
  spineText?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Generate cover PDF with front, spine, and back
 */
export async function generateCoverPDF(options: CoverOptions): Promise<Buffer> {
  const sizeSpec = getBookSize(options.bookSize);
  const spineWidth = calculateSpineWidth(options.pageCount);

  // Cover dimensions: front + spine + back
  const totalWidth = sizeSpec.bleedWidth * 2 + spineWidth;
  const totalHeight = sizeSpec.bleedHeight;

  const widthPoints = totalWidth * 72; // Convert inches to points
  const heightPoints = totalHeight * 72;

  console.log(`Generating cover: ${totalWidth}" × ${totalHeight}" (${widthPoints}pt × ${heightPoints}pt)`);

  // Create PDF document
  const doc = new PDFDocument({
    size: [widthPoints, heightPoints],
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    autoFirstPage: false,
  });

  // Create buffer stream
  const chunks: Buffer[] = [];
  const stream = new PassThrough();
  stream.on('data', (chunk) => chunks.push(chunk));

  doc.pipe(stream);
  doc.addPage({ size: [widthPoints, heightPoints] });

  // Process and add front cover image
  console.log('Processing front cover image...');
  const frontCover = await processImageForPrint(options.frontCoverImage, {
    targetWidthInches: sizeSpec.bleedWidth,
    targetHeightInches: sizeSpec.bleedHeight,
    fit: 'cover',
  });

  const frontX = (sizeSpec.bleedWidth + spineWidth) * 72; // Right side (front cover)
  doc.image(frontCover.buffer, frontX, 0, {
    width: sizeSpec.bleedWidth * 72,
    height: sizeSpec.bleedHeight * 72,
  });

  // Process and add back cover image (if provided)
  if (options.backCoverImage) {
    console.log('Processing back cover image...');
    const backCover = await processImageForPrint(options.backCoverImage, {
      targetWidthInches: sizeSpec.bleedWidth,
      targetHeightInches: sizeSpec.bleedHeight,
      fit: 'cover',
    });

    doc.image(backCover.buffer, 0, 0, {
      width: sizeSpec.bleedWidth * 72,
      height: sizeSpec.bleedHeight * 72,
    });
  } else {
    // White back cover
    doc.rect(0, 0, sizeSpec.bleedWidth * 72, sizeSpec.bleedHeight * 72)
      .fill('#ffffff');
  }

  // Add spine
  const spineX = sizeSpec.bleedWidth * 72;
  const spineWidthPoints = spineWidth * 72;

  // Spine background
  doc.rect(spineX, 0, spineWidthPoints, heightPoints)
    .fill('#ffffff');

  // Add spine text (rotated)
  if (options.spineText) {
    doc.save();
    doc.translate(spineX + spineWidthPoints / 2, heightPoints / 2);
    doc.rotate(-90);
    doc.fontSize(Math.min(spineWidthPoints * 0.6, 12));
    doc.fillColor('#000000');
    doc.text(options.spineText, 0, 0, {
      width: heightPoints * 0.8,
      align: 'center',
    });
    doc.restore();
  }

  // Add title on front cover (if provided)
  if (options.title) {
    const titleX = frontX + (sizeSpec.trimWidth * 72) / 2;
    const titleY = (sizeSpec.trimHeight * 72) * 0.1;

    doc.fontSize(36);
    doc.fillColor('#ffffff');
    doc.text(options.title, titleX - 200, titleY, {
      width: 400,
      align: 'center',
    });

    if (options.subtitle) {
      doc.fontSize(18);
      doc.text(options.subtitle, titleX - 200, titleY + 50, {
        width: 400,
        align: 'center',
      });
    }
  }

  // Add trim marks (optional, for debugging)
  // addTrimMarks(doc, sizeSpec, spineWidth);

  // Finalize PDF
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

/**
 * Add trim marks for cutting guide (optional)
 */
function addTrimMarks(
  doc: typeof PDFDocument.prototype,
  sizeSpec: any,
  spineWidth: number
) {
  const markLength = 0.25 * 72; // 0.25 inch marks
  const bleed = 0.125 * 72;

  doc.strokeColor('#000000');
  doc.lineWidth(0.5);

  // Front cover trim marks
  const frontX = (sizeSpec.bleedWidth + spineWidth) * 72;
  const trimX = frontX + bleed;
  const trimY = bleed;
  const trimWidth = sizeSpec.trimWidth * 72;
  const trimHeight = sizeSpec.trimHeight * 72;

  // Top-left corner
  doc.moveTo(trimX - markLength, trimY)
    .lineTo(trimX + markLength, trimY)
    .stroke();
  doc.moveTo(trimX, trimY - markLength)
    .lineTo(trimX, trimY + markLength)
    .stroke();

  // Top-right corner
  doc.moveTo(trimX + trimWidth - markLength, trimY)
    .lineTo(trimX + trimWidth + markLength, trimY)
    .stroke();
  doc.moveTo(trimX + trimWidth, trimY - markLength)
    .lineTo(trimX + trimWidth, trimY + markLength)
    .stroke();

  // Bottom-left corner
  doc.moveTo(trimX - markLength, trimY + trimHeight)
    .lineTo(trimX + markLength, trimY + trimHeight)
    .stroke();
  doc.moveTo(trimX, trimY + trimHeight - markLength)
    .lineTo(trimX, trimY + trimHeight + markLength)
    .stroke();

  // Bottom-right corner
  doc.moveTo(trimX + trimWidth - markLength, trimY + trimHeight)
    .lineTo(trimX + trimWidth + markLength, trimY + trimHeight)
    .stroke();
  doc.moveTo(trimX + trimWidth, trimY + trimHeight - markLength)
    .lineTo(trimX + trimWidth, trimY + trimHeight + markLength)
    .stroke();
}

/**
 * Generate simple single-sided cover (front only)
 */
export async function generateSimpleCoverPDF(
  bookSize: string,
  frontCoverImage: string | Buffer,
  title?: string
): Promise<Buffer> {
  const sizeSpec = getBookSize(bookSize);

  const widthPoints = sizeSpec.bleedWidth * 72;
  const heightPoints = sizeSpec.bleedHeight * 72;

  const doc = new PDFDocument({
    size: [widthPoints, heightPoints],
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const chunks: Buffer[] = [];
  const stream = new PassThrough();
  stream.on('data', (chunk) => chunks.push(chunk));
  doc.pipe(stream);

  // Process cover image
  const cover = await processImageForPrint(frontCoverImage, {
    targetWidthInches: sizeSpec.bleedWidth,
    targetHeightInches: sizeSpec.bleedHeight,
    fit: 'cover',
  });

  doc.image(cover.buffer, 0, 0, {
    width: widthPoints,
    height: heightPoints,
  });

  // Add title overlay
  if (title) {
    doc.fontSize(48);
    doc.fillColor('#ffffff');
    doc.text(title, 50, heightPoints / 2 - 30, {
      width: widthPoints - 100,
      align: 'center',
    });
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
