# Split With Kerning

A simple TypeScript library to split text into letters while respecting kerning.

Font kerning explaination from [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-kerning)


## Installation

```bash
npm install split-with-kerning opentype.js
```

## Usage

```typescript
import opentype from 'opentype.js';
import { splitText, applyKerningFromFont } from 'split-with-kerning'

// first load font needed to get the kerning
const font = await opentype.load("./Voyage-Regular.woff");

const paragraph = document.querySelectorAll("p");

// split a DOM element into words and letters
splitText(paragraph);

// apply the kerning from the font to .char elements
applyKerningFromFont(paragraph, font, {
  wordSelector: ".word",
  charSelector: ".char",
});
```

## Optimized version 

First, we will export the kernings from a font with [export-kerning](https://www.npmjs.com/package/export-kerning) package.
Then, we can use the exported json (no need to load opentype.js) and `applyKerningFromExport` function

```typescript
import { splitText, applyKerningFromExport } from 'split-with-kerning'

const paragraph = document.querySelectorAll("p");

// split a DOM element into words and letters
splitText(paragraph);

// apply the kerning from the exported data to .char elements
applyKerningFromExport(paragraph, font, {
  wordSelector: ".word",
  charSelector: ".char",
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
