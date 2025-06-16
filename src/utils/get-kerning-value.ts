// import type { Font } from 'opentype.js';

/**
   * Calculates kerning value between two characters
   * @param leftChar - The left character
   * @param rightChar - The right character
   * @returns The kerning value in font units
   */
export function getKerningValue(font: any, leftChar: string, rightChar: string): number {
  if (!font) return 0;

  const leftGlyph = font.charToGlyph(leftChar);
  const rightGlyph = font.charToGlyph(rightChar);

  if (!leftGlyph || !rightGlyph) return 0;

  let kerning = font.getKerningValue(leftGlyph, rightGlyph);
  kerning /= font.unitsPerEm;
  return kerning;
}