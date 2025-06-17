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
const font = await opentype.load("./Voyage-Regular.woff")
  .then(() => {
    const paragraph = document.querySelectorAll("p");
    
    // split a DOM element into words and letters
    splitText(paragraph);
    
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

## Optimized version

First, we will export the kernings from a font with [export-kerning](https://www.npmjs.com/package/export-kerning) package.
Then, we can use the exported json (no need to load opentype.js) and `applyKerningFromExport` function

```typescript
import { splitText, applyKerningFromExport } from "split-with-kerning";

const kerningPairs = fetch("./kerning-subset.json")
  .then((res) => res.json())
  .then(() => {
    const paragraph = document.querySelectorAll("p");

    // split a DOM element into words and letters
    splitText(paragraph);

    // apply the kerning from the exported data to .char elements
    applyKerningFromExport(paragraph, font, {
      wordSelector: ".word",
      charSelector: ".char",
    });
  });
```

## With GSAP
```typescript
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { applyKerningFromFont } from "split-with-kerning";
gsap.registerPlugin(SplitText);

window.addEventListener("load", async () => {
  try {
    // Load the font
    const font = await opentype.load("./fonts/Voyage-Regular.woff");
    // Validate font data
    if (!font) {
      throw new Error("Invalid font data");
    }

    new SplitText("p", {
      type: "words, chars",
      wordsClass: "word",
      charsClass: "char",
    });

    document.querySelectorAll("p").forEach(async (p) => {
      applyKerningFromFont(p, font, {
        wordSelector: ".word",
        charSelector: ".char",
      });
    });
  } catch (error) {
    console.error("Test failed:", error);
  }
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
