# Split With Kerning

A simple TypeScript library to split text into letters while respecting kerning.

Font kerning explaination from [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-kerning)

## Installation

```bash
npm install split-with-kerning opentype.js
```

## Usage

```typescript
import opentype from "opentype.js";
import { splitText, applyKerningFromFont } from "split-with-kerning";

// first load font needed to get the kerning
const font = await opentype.load("./fonts/Voyage-Regular.woff")
  .then(() => {
    const paragraph = document.querySelectorAll("p");
    
    // split a DOM element into words and letters
    const { reset, splitted } = splitText(paragraph);
    
    // apply the kerning from the font to .char elements
    applyKerningFromFont(paragraph, font, {
      wordSelector: ".word",
      charSelector: ".char",
    });
  })
```

```css
.word {
  white-space: nowrap;
}
.char {
  display: inline-block;
}
```

## Optimized version (no opentype.js)

First, exports the kernings from a font with [export-kerning](https://www.npmjs.com/package/export-kerning) package.
Then, we can use this exported json (no need to load opentype.js) and `applyKerningFromExport` function

```typescript
import { splitText, applyKerningFromExport, convertOptimizedToKerningPairs } from "split-with-kerning";

await fetch("./kerning.json")
  .then((res) => res.json())
  .then((json) => convertOptimizedToKerningPairs(json))
  .then((kerningPairs) => {
    const paragraph = document.querySelectorAll("p");

    // split a DOM element into words and letters
    const { reset, splitted } = splitText(paragraph);

    // apply the kerning from the exported data to .char elements
    applyKerningFromExport(paragraph, kerningPairs, {
      wordSelector: ".word",
      charSelector: ".char",
    });
  });
```

## With GSAP
```typescript
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { applyKerningFromExport, convertOptimizedToKerningPairs } from "split-with-kerning";

gsap.registerPlugin(SplitText);

await fetch("./kerning.json")
  .then((res) => res.json())
  .then((json) => convertOptimizedToKerningPairs(json))
  .then((kerningPairs) => {
    const paragraphs = document.querySelectorAll("p");

    new SplitText(paragraphs, {
      type: "words, chars",
      wordsClass: "word",
      charsClass: "char",
    });

    // apply the kerning from the exported data to .char elements
    paragraphs.forEach((p) => {
      applyKerningFromExport(p, kerningPairs, {
        wordSelector: ".word",
        charSelector: ".char",
      });
    });
  });
```

## Development

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Build the library:

```bash
npm run build
```

## License

ISC
