import fs from 'fs';
import opentype from 'opentype.js';

// Parse command-line arguments
const args = process.argv.slice(2);
let fontPath = './Voyage-Regular.woff'; // default
let dynamicText = 'Lorem ipsum'; // default
let unicodeRanges = "U+0000-007F,U+0080-00FF,U+0153,U+20AC"; // default

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--font' && args[i + 1]) {
    fontPath = args[i + 1];
    i++;
  } else if (args[i] === '--text' && args[i + 1]) {
    dynamicText = args[i + 1];
    i++;
  } else if (args[i] === '--ranges' && args[i + 1]) {
    unicodeRanges = args[i + 1];
    i++;
  }
}

// Load the font
opentype.load(fontPath, (err, font) => {
  if (err) {
    console.error('Font loading error:', err);
    return;
  }

  
  // Get all glyphs that map to characters
  const supportedChars = getSupportedChars(font);
  
  // Export all kerning pairs
  const allKerningPairs = extractKerningPairs(font, unicodeRanges || supportedChars);
  
  let kerningFull = {
    unitsPerEm: font.unitsPerEm,
    kerningPairs: allKerningPairs
  }

  // Save all kerning
  fs.writeFileSync('./kerning-full.json', JSON.stringify(kerningFull, null, 2));
  console.log(`✔️ All kerning pairs saved: ${Object.keys(kerningFull.kerningPairs).length} pairs`);

  // OR: Export only kerning pairs from dynamic text
  const usedKerningPairs = extractUsedKerningPairs(dynamicText, font);
  
  let kerningOptimized = {
    unitsPerEm: font.unitsPerEm,
    kerningPairs: usedKerningPairs
  }

  fs.writeFileSync('./kerning-subset.json', JSON.stringify(kerningOptimized, null, 2));
  console.log(`✔️ Used kerning subset saved: ${Object.keys(kerningOptimized.kerningPairs).length} pairs`);
});

function parseUnicodeRanges(ranges) {
  const chars = new Set();
  
  ranges.split(',').forEach(range => {
    range = range.trim();
    if (range.includes('-')) {
      // Handle range like U+0000-007F
      const [start, end] = range.replace('U+', '').split('-').map(hex => parseInt(hex, 16));
      for (let i = start; i <= end; i++) {
        chars.add(String.fromCharCode(i));
      }
    } else {
      // Handle single character like U+0153
      const code = parseInt(range.replace('U+', ''), 16);
      chars.add(String.fromCharCode(code));
    }
  });
  
  return Array.from(chars);
}

function extractKerningPairs(font, charsOrRanges) {
  const pairs = {};
  const chars = typeof charsOrRanges === 'string' ? parseUnicodeRanges(charsOrRanges) : charsOrRanges;
  
  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars.length; j++) {
      const left = font.charToGlyph(chars[i]);
      const right = font.charToGlyph(chars[j]);
      const kern = font.getKerningValue(left, right);
      if (kern !== 0) {
        pairs[chars[i] + chars[j]] = kern;
      }
    }
  }
  return pairs;
}

function extractUsedKerningPairs(text, font) {
  const pairs = {};
  const words = text.split(/\s+/); // split by whitespace

  for (const word of words) {
    for (let i = 0; i < word.length - 1; i++) {
      const left = word[i];
      const right = word[i + 1];
      const leftGlyph = font.charToGlyph(left);
      const rightGlyph = font.charToGlyph(right);
      const kern = font.getKerningValue(leftGlyph, rightGlyph);
      if (kern !== 0) {
        pairs[left + right] = kern;
      }
    }
  }

  return pairs;
}

function getSupportedChars(font) {
  const cmap = font.tables.cmap.glyphIndexMap;
  return Object.keys(cmap).map(code => String.fromCharCode(code));
}
