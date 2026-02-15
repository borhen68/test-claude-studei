/**
 * Color Analysis Module
 * 
 * Extracts dominant colors and color palettes from photos using node-vibrant.
 * Used for:
 * - Automatic theme selection (warm/cool/vintage/b&w)
 * - Page background color harmonization
 * - Smart photo grouping by color similarity
 */

/**
 * Extract dominant colors and full color palette from an image
 * 
 * Uses the Vibrant.js library to identify key colors in the image.
 * Returns 6 color swatches: vibrant, muted, and their light/dark variants.
 * 
 * @param buffer - Image buffer to analyze
 * @returns Object containing dominant hex color and sorted palette array
 * @throws Error if color extraction fails (returns fallback gray)
 */
export async function extractColors(buffer: Buffer) {
  try {
    // Dynamic import for better compatibility (node-vibrant has native deps)
    const Vibrant = (await import('node-vibrant')).default;
    const palette = await Vibrant.from(buffer).getPalette();
    
    // Extract all available color swatches
    const colors = {
      vibrant: palette.Vibrant?.hex || null,
      muted: palette.Muted?.hex || null,
      darkVibrant: palette.DarkVibrant?.hex || null,
      darkMuted: palette.DarkMuted?.hex || null,
      lightVibrant: palette.LightVibrant?.hex || null,
      lightMuted: palette.LightMuted?.hex || null,
    };
    
    // Select dominant color: prefer vibrant, fallback to muted, then gray
    const dominantColor = colors.vibrant || colors.muted || '#808080';
    
    // Build sorted array of colors by population (how much of image uses that color)
    const colorPalette = Object.entries(colors)
      .filter(([_, hex]) => hex !== null) // Remove null entries
      .map(([name, hex]) => ({
        name,
        hex,
        population: (palette as any)[name]?.population || 0,
      }))
      .sort((a, b) => b.population - a.population); // Most common first
    
    return {
      dominantColor,
      palette: colorPalette,
    };
  } catch (error) {
    console.error('Color extraction failed:', error);
    // Return fallback neutral gray on error
    return {
      dominantColor: '#808080',
      palette: [],
    };
  }
}

/**
 * Suggest book theme based on dominant color temperature and saturation
 * 
 * Analyzes the hue and saturation to recommend an aesthetic theme.
 * Used for automatic theme selection when user chooses "auto".
 * 
 * @param dominantColor - Hex color code (e.g., "#FF5733")
 * @returns Theme suggestion: 'warm' | 'cool' | 'bw' | 'vintage'
 */
export function suggestTheme(dominantColor: string): 'warm' | 'cool' | 'bw' | 'vintage' {
  // Parse hex color to RGB
  const hex = dominantColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Convert RGB to HSL (Hue, Saturation, Lightness)
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2; // Lightness
  
  // Calculate hue (0-360 degrees on color wheel)
  let h = 0;
  if (max !== min) {
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r / 255:
        h = ((g / 255 - b / 255) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g / 255:
        h = ((b / 255 - r / 255) / d + 2) / 6;
        break;
      case b / 255:
        h = ((r / 255 - g / 255) / d + 4) / 6;
        break;
    }
  }
  
  const hue = h * 360;
  
  // Calculate saturation (0-1, how vivid the color is)
  const saturation = max === min ? 0 : l > 0.5 
    ? (max - min) / (2 - max - min) 
    : (max - min) / (max + min);
  
  // Low saturation = grayscale image -> black & white theme
  if (saturation < 0.1) return 'bw';
  
  // Warm hues: red, orange, yellow (0-60° and 300-360° on color wheel)
  if (hue < 60 || hue > 300) return 'warm';
  
  // Cool hues: blue, cyan, some greens (120-240°)
  if (hue >= 120 && hue <= 240) return 'cool';
  
  // Mid-range hues: green-yellow, yellow-green -> vintage theme
  return 'vintage';
}
