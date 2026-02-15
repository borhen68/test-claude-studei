/**
 * Theme Definitions for Frametale
 * 
 * Pre-designed themes that users can apply to their photo books and calendars.
 * Each theme includes color palette, typography, and styling preferences.
 */

export interface Theme {
  id: string;
  name: string;
  description: string;
  
  // Color palette
  bgColor: string;
  accentColor: string;
  textColor: string;
  
  // Border styling
  borderStyle: 'none' | 'thin' | 'thick' | 'rounded';
  borderColor?: string;
  
  // Page numbers
  pageNumbers: {
    show: boolean;
    position: 'bottom-center' | 'bottom-right' | 'bottom-left';
    color: string;
  };
  
  // Typography
  headingFont: string;
  bodyFont: string;
  
  // Preview thumbnail
  previewGradient: string;
}

export const BOOK_THEMES: Theme[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean lines and bold contrasts for contemporary photos',
    bgColor: '#FFFFFF',
    accentColor: '#2563EB',
    textColor: '#1F2937',
    borderStyle: 'none',
    pageNumbers: {
      show: true,
      position: 'bottom-right',
      color: '#6B7280',
    },
    headingFont: 'Inter',
    bodyFont: 'Inter',
    previewGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant, letting your photos shine',
    bgColor: '#FAFAFA',
    accentColor: '#000000',
    textColor: '#374151',
    borderStyle: 'thin',
    borderColor: '#E5E7EB',
    pageNumbers: {
      show: false,
      position: 'bottom-center',
      color: '#9CA3AF',
    },
    headingFont: 'Helvetica Neue',
    bodyFont: 'Helvetica Neue',
    previewGradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold colors and playful energy for fun memories',
    bgColor: '#FFFBEB',
    accentColor: '#F59E0B',
    textColor: '#92400E',
    borderStyle: 'thick',
    borderColor: '#FCD34D',
    pageNumbers: {
      show: true,
      position: 'bottom-center',
      color: '#D97706',
    },
    headingFont: 'Poppins',
    bodyFont: 'Poppins',
    previewGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated serif fonts and cream tones',
    bgColor: '#FDF8F3',
    accentColor: '#78716C',
    textColor: '#292524',
    borderStyle: 'thin',
    borderColor: '#D6D3D1',
    pageNumbers: {
      show: true,
      position: 'bottom-center',
      color: '#A8A29E',
    },
    headingFont: 'Playfair Display',
    bodyFont: 'Lora',
    previewGradient: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
  },
  
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless design with traditional aesthetics',
    bgColor: '#F8F9FA',
    accentColor: '#1E40AF',
    textColor: '#1F2937',
    borderStyle: 'rounded',
    borderColor: '#9CA3AF',
    pageNumbers: {
      show: true,
      position: 'bottom-right',
      color: '#6B7280',
    },
    headingFont: 'Georgia',
    bodyFont: 'Georgia',
    previewGradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  },
];

export const COVER_FONTS = [
  {
    id: 'serif',
    name: 'Serif',
    fontFamily: 'Georgia, "Times New Roman", serif',
    preview: 'Your Title',
    description: 'Classic and traditional',
  },
  {
    id: 'sans',
    name: 'Sans Serif',
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
    preview: 'Your Title',
    description: 'Modern and clean',
  },
  {
    id: 'script',
    name: 'Script',
    fontFamily: '"Dancing Script", cursive',
    preview: 'Your Title',
    description: 'Elegant and flowing',
  },
  {
    id: 'modern',
    name: 'Modern',
    fontFamily: 'Poppins, system-ui, sans-serif',
    preview: 'Your Title',
    description: 'Bold and contemporary',
  },
  {
    id: 'playful',
    name: 'Playful',
    fontFamily: '"Comic Sans MS", "Marker Felt", fantasy',
    preview: 'Your Title',
    description: 'Fun and casual',
  },
];

/**
 * Get a theme by ID
 */
export function getThemeById(id: string): Theme | undefined {
  return BOOK_THEMES.find((theme) => theme.id === id);
}

/**
 * Get default theme
 */
export function getDefaultTheme(): Theme {
  return BOOK_THEMES[0]; // Modern
}

/**
 * Extract color palette from a photo (placeholder - would use actual color extraction)
 */
export function extractPhotoColors(imageUrl: string): string[] {
  // In production, this would use a library like node-vibrant
  // For now, return some default colors
  return ['#1F2937', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB'];
}
