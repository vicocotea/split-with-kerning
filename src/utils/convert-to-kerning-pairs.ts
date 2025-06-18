// Utility to convert SVG-style optimized kerning format back to simple kerning pairs
// Input: { unitsPerEm, kerningPairs: [ { left: [...], right: [...], value: ... }, ... ] }
// Output: { unitsPerEm, kerningPairs: { 'AV': -80, ... } }

import type { KerningData, KerningDataOptimized } from "../types/KerningTypes";

export function convertOptimizedToKerningPairs(optimizedData: KerningDataOptimized): KerningData {
  const result: KerningData['kerningPairs'] = {};
  for (const group of optimizedData.kerningPairs) {
    for (const left of group.left) {
      for (const right of group.right) {
        result[left + right] = group.value;
      }
    }
  }
  
  return {
    unitsPerEm: optimizedData.unitsPerEm,
    kerningPairs: result
  };
}