/**
 * Photo Quality Analysis Utilities
 * Calculates quality scores for photos based on multiple factors
 */

export interface PhotoAnalysis {
  qualityScore: number; // 0-100
  sharpnessScore: number; // 0-100
  hasFaces: boolean;
  faceCount: number;
  issues: string[];
  recommendations: string[];
}

/**
 * Calculate quality score for a photo
 * Based on: resolution, sharpness, aspect ratio, file size
 */
export function calculateQualityScore(photo: {
  width: number;
  height: number;
  fileSize: number;
  sharpnessScore?: number | null;
  hasFaces?: boolean;
  faceCount?: number;
  mimeType?: string;
}): number {
  let score = 0;

  // Resolution score (40 points max)
  const megapixels = (photo.width * photo.height) / 1_000_000;
  if (megapixels >= 12) {
    score += 40;
  } else if (megapixels >= 8) {
    score += 35;
  } else if (megapixels >= 5) {
    score += 30;
  } else if (megapixels >= 3) {
    score += 20;
  } else {
    score += 10;
  }

  // Sharpness score (30 points max)
  if (photo.sharpnessScore !== null && photo.sharpnessScore !== undefined) {
    score += Math.min(30, (photo.sharpnessScore / 100) * 30);
  } else {
    // Default to 20 if not calculated
    score += 20;
  }

  // Face bonus (10 points)
  if (photo.hasFaces && photo.faceCount && photo.faceCount > 0) {
    score += Math.min(10, photo.faceCount * 3);
  }

  // Aspect ratio score (10 points)
  const aspectRatio = photo.width / photo.height;
  if (aspectRatio >= 0.75 && aspectRatio <= 1.5) {
    score += 10; // Good aspect ratio for most layouts
  } else if (aspectRatio >= 0.5 && aspectRatio <= 2) {
    score += 5; // Acceptable
  }

  // File size check (10 points)
  const fileSizeMB = photo.fileSize / (1024 * 1024);
  if (fileSizeMB >= 2 && fileSizeMB <= 20) {
    score += 10; // Good file size (not too compressed, not too large)
  } else if (fileSizeMB >= 1 || fileSizeMB <= 30) {
    score += 5;
  }

  return Math.min(100, Math.round(score));
}

/**
 * Analyze a photo and provide quality insights
 */
export function analyzePhoto(photo: {
  width: number;
  height: number;
  fileSize: number;
  sharpnessScore?: number | null;
  hasFaces?: boolean;
  faceCount?: number;
  mimeType?: string;
}): PhotoAnalysis {
  const qualityScore = calculateQualityScore(photo);
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check resolution
  const megapixels = (photo.width * photo.height) / 1_000_000;
  if (megapixels < 2) {
    issues.push('Low resolution - may appear blurry when printed');
    recommendations.push('Use this photo in smaller layouts only');
  } else if (megapixels < 5) {
    issues.push('Medium resolution - best for smaller prints');
    recommendations.push('Avoid using as a full-page photo');
  }

  // Check sharpness
  if (
    photo.sharpnessScore !== null &&
    photo.sharpnessScore !== undefined &&
    photo.sharpnessScore < 50
  ) {
    issues.push('Photo may appear soft or blurry');
    recommendations.push('Consider using photo editing to sharpen');
  }

  // Check file size
  const fileSizeMB = photo.fileSize / (1024 * 1024);
  if (fileSizeMB < 0.5) {
    issues.push('Small file size - may be overly compressed');
    recommendations.push('Check if you have a higher quality version');
  }

  // Check aspect ratio
  const aspectRatio = photo.width / photo.height;
  if (aspectRatio > 3 || aspectRatio < 0.3) {
    issues.push('Unusual aspect ratio - may be difficult to layout');
    recommendations.push('Consider cropping to a more standard ratio');
  }

  // Positive recommendations
  if (qualityScore >= 90) {
    recommendations.push('Excellent quality! Perfect for cover or full-page spreads');
  } else if (qualityScore >= 75) {
    recommendations.push('Great quality! Use for important pages');
  }

  if (photo.hasFaces && photo.faceCount && photo.faceCount > 0) {
    recommendations.push(
      `Contains ${photo.faceCount} ${photo.faceCount === 1 ? 'person' : 'people'} - great for portraits`
    );
  }

  return {
    qualityScore,
    sharpnessScore: photo.sharpnessScore || 0,
    hasFaces: photo.hasFaces || false,
    faceCount: photo.faceCount || 0,
    issues,
    recommendations,
  };
}

/**
 * Get print size recommendations based on resolution
 */
export function getRecommendedPrintSizes(width: number, height: number): {
  safe: string[];
  acceptable: string[];
  notRecommended: string[];
} {
  const megapixels = (width * height) / 1_000_000;
  const ppi = 300; // Print quality standard

  const safe: string[] = [];
  const acceptable: string[] = [];
  const notRecommended: string[] = [];

  // Calculate max dimensions at 300 PPI
  const maxWidthInches = width / ppi;
  const maxHeightInches = height / ppi;

  // Common print sizes
  const sizes = [
    { name: '4x6"', width: 4, height: 6 },
    { name: '5x7"', width: 5, height: 7 },
    { name: '8x10"', width: 8, height: 10 },
    { name: '8x12"', width: 8, height: 12 },
    { name: '11x14"', width: 11, height: 14 },
    { name: '12x18"', width: 12, height: 18 },
  ];

  sizes.forEach((size) => {
    const fits = size.width <= maxWidthInches && size.height <= maxHeightInches;
    const fitsAcceptable =
      size.width <= maxWidthInches * 1.2 && size.height <= maxHeightInches * 1.2;

    if (fits) {
      safe.push(size.name);
    } else if (fitsAcceptable) {
      acceptable.push(size.name);
    } else {
      notRecommended.push(size.name);
    }
  });

  return { safe, acceptable, notRecommended };
}
