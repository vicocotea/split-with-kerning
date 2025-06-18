/**
 * Interface for kerning data exported from a font
 */
export interface KerningData {
  kerningPairs: Record<string, number>;
  unitsPerEm: number;
}




export interface KerningPairOptimized {
  left: string[];
  right: string[];
  value: number;
}

export interface KerningDataOptimized {
  kerningPairs: KerningPairOptimized[];
  unitsPerEm: number;
}

/**
 * Options for applying kerning
 */
export interface KerningOptions {
  wordSelector?: string;
  charSelector?: string;
}

/**
 * Type for the font parameter in applyKerningFromFont
 * This is a minimal type that matches the required properties from opentype.js
 */
export interface FontLike {
  getKerningValue: (left: string, right: string) => number;
  unitsPerEm: number;
} 