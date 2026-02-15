import { Document, Page, Image, View, Text, StyleSheet, pdf } from '@react-pdf/renderer';
import type { Photo } from '../db/schema';
import type { PhotoLayout } from '../layout/templates';

const styles = StyleSheet.create({
  page: {
    width: '8.25in', // 8" + 0.125" bleed on each side
    height: '8.25in',
    backgroundColor: '#ffffff',
  },
  photoContainer: {
    position: 'absolute',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  textContainer: {
    position: 'absolute',
    bottom: '0.5in',
    left: '0.5in',
    right: '0.5in',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#333333',
    textAlign: 'center',
  },
  coverText: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
});

interface BookPageProps {
  photos: Array<{ url: string; layout: PhotoLayout }>;
  textContent?: string;
  isCover?: boolean;
}

/**
 * Single book page component
 */
function BookPage({ photos, textContent, isCover }: BookPageProps) {
  return (
    <Page size={{ width: 594, height: 594 }} style={styles.page}>
      {/* Render photos */}
      {photos.map((photo, index) => {
        const { x, y, width, height } = photo.layout.position;
        
        return (
          <View
            key={index}
            style={[
              styles.photoContainer,
              {
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                width: `${width * 100}%`,
                height: `${height * 100}%`,
              },
            ]}
          >
            <Image
              src={photo.url}
              style={styles.photo}
            />
          </View>
        );
      })}

      {/* Render text if provided */}
      {textContent && (
        <View style={styles.textContainer}>
          <Text style={isCover ? styles.coverText : styles.text}>
            {textContent}
          </Text>
        </View>
      )}
    </Page>
  );
}

interface GeneratePDFParams {
  pages: Array<{
    photos: Array<{ url: string; layout: PhotoLayout }>;
    textContent?: string;
    isCover?: boolean;
  }>;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
  };
}

/**
 * Generate complete photo book PDF
 */
export async function generateBookPDF(params: GeneratePDFParams): Promise<Buffer> {
  try {
    const doc = (
      <Document
        title={params.metadata?.title || 'Frametale Photo Book'}
        author={params.metadata?.author || 'Frametale'}
        subject={params.metadata?.subject || 'Photo Book'}
      >
        {params.pages.map((page, index) => (
          <BookPage
            key={index}
            photos={page.photos}
            textContent={page.textContent}
            isCover={page.isCover}
          />
        ))}
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());
    
    return buffer;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate PDF with progress callback
 */
export async function generateBookPDFWithProgress(
  params: GeneratePDFParams,
  onProgress?: (current: number, total: number) => void
): Promise<Buffer> {
  const totalSteps = params.pages.length + 2; // pages + compile + finalize
  let currentStep = 0;

  const updateProgress = () => {
    currentStep++;
    if (onProgress) {
      onProgress(currentStep, totalSteps);
    }
  };

  try {
    // Step 1: Create document
    updateProgress();

    const doc = (
      <Document
        title={params.metadata?.title || 'Frametale Photo Book'}
        author={params.metadata?.author || 'Frametale'}
      >
        {params.pages.map((page, index) => {
          // Update progress for each page
          if (index > 0) updateProgress();
          
          return (
            <BookPage
              key={index}
              photos={page.photos}
              textContent={page.textContent}
              isCover={page.isCover}
            />
          );
        })}
      </Document>
    );

    // Step 2: Compile PDF
    const pdfBlob = await pdf(doc).toBlob();
    updateProgress();

    const buffer = Buffer.from(await pdfBlob.arrayBuffer());
    
    return buffer;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate PDF meets print requirements
 */
export function validatePrintPDF(buffer: Buffer): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check file size (max 500MB for most printers)
  const sizeMB = buffer.length / (1024 * 1024);
  if (sizeMB > 500) {
    errors.push(`File size (${sizeMB.toFixed(2)}MB) exceeds 500MB limit`);
  }

  // Minimum size check
  if (sizeMB < 0.1) {
    errors.push('File size too small, may be corrupted');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
