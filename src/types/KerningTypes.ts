/**
 * Interface for kerning data exported from a font
 */
export interface KerningData {
  kerningPairs: Record<string, number>;
  unitsPerEm: number;
}

/**
 * Interface for kerning pair optimized for performance
 */
export interface KerningPairOptimized {
  left: string[];
  right: string[];
  value: number;
}

/**
 * Interface for kerning data optimized for performance
 */
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

/**
 * Type of hierarchical splitting
 */
export type SplitType = 'letter' | 'word';

/**
 * Represents a single letter
 */
export interface Letter {
  value: string;
  kerning?: number; // Kerning value with the next letter
  element?: HTMLElement;
}

/**
 * Represents a word composed of letters
 */
export interface Word {
  value: string;
  element?: HTMLElement;
  letters?: Letter[];
}

/**
 * Represents a text element
 */
export interface TextElement {
  value: string;
  words?: Word[];
  element?: HTMLElement; // Root DOM element
} 

/**
 * Represents the complete text structure after splitting
 */
export interface SplittedText {
  reset: () => void;
  splitted: TextElement;
} 