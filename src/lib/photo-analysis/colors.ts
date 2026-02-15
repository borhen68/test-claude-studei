import Vibrant from 'node-vibrant';

/**
 * Extract dominant colors from image
 */
export async function extractColors(buffer: Buffer) {
  try {
    const palette = await Vibrant.from(buffer).getPalette();
    
    const colors = {
      vibrant: palette.Vibrant?.hex || null,
      muted: palette.Muted?.hex || null,
      darkVibrant: palette.DarkVibrant?.hex || null,
      darkMuted: palette.DarkMuted?.hex || null,
      lightVibrant: palette.LightVibrant?.hex || null,
      lightMuted: palette.LightMuted?.hex || null,
    };
    
    // Get dominant color (most vibrant or fallback to muted)
    const dominantColor = colors.vibrant || colors.muted || '#808080';
    
    // Build color palette array
    const colorPalette = Object.entries(colors)
      .filter(([_, hex]) => hex !== null)
      .map(([name, hex]) => ({
        name,
        hex,
        population: palette[name as keyof typeof palette]?.population || 0,
      }))
      .sort((a, b) => b.population - a.population);
    
    return {
      dominantColor,
      palette: colorPalette,
    };
  } catch (error) {
    console.error('Color extraction failed:', error);
    return {
      dominantColor: '#808080',
      palette: [],
    };
  }
}

/**
 * Determine theme suggestion based on dominant colors
 */
export function suggestTheme(dominantColor: string): 'warm' | 'cool' | 'bw' | 'vintage' {
  const hex = dominantColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Convert to HSL
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  
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
  
  // Low saturation = black & white
  const saturation = max === min ? 0 : l > 0.5 
    ? (max - min) / (2 - max - min) 
    : (max - min) / (max + min);
  
  if (saturation < 0.1) return 'bw';
  
  // Warm hues: red, orange, yellow (0-60 degrees)
  if (hue < 60 || hue > 300) return 'warm';
  
  // Cool hues: blue, green (60-300 degrees)
  if (hue >= 120 && hue <= 240) return 'cool';
  
  // Default to vintage for mid-tones
  return 'vintage';
}
