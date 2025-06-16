import { getKerningValue } from "./utils/get-kerning-value";
import { FontLike, KerningData, KerningOptions } from "./types/KerningTypes";

export function applyKerningFromFont(
  element: HTMLElement,
  font: FontLike,
  options: KerningOptions = {}
) {
  const { wordSelector = ".word", charSelector = ".char" } = options;
  const words = element.querySelectorAll(wordSelector);
  words.forEach((word) => {
    const letters: HTMLElement[] = Array.from(
      word.querySelectorAll(charSelector)
    );
    letters.forEach((letter: HTMLElement, index: number) => {
      if (letter.textContent) {
        const kerning = getKerningValue(
          font,
          letter.textContent,
          letters[index + 1]?.textContent ?? ""
        );
        letter.style.marginRight = `${kerning}em`;
      }
    });
  });
}

export function applyKerningFromExport(
  element: HTMLElement,
  kernings: KerningData,
  options: KerningOptions = {}
) {
  const { wordSelector = ".word", charSelector = ".char" } = options;
  const words = element.querySelectorAll(wordSelector);
  words.forEach((word) => {
    const letters: HTMLElement[] = Array.from(
      word.querySelectorAll(charSelector)
    );
    letters.forEach((letter: HTMLElement, index: number) => {
      if (letter.textContent && letters[index + 1]) {
        const pair = `${letter.textContent}${
          letters[index + 1]?.textContent ?? ""
        }`;
        const kerning = kernings.kerningPairs[pair];
        letter.style.marginRight = `${kerning / kernings.unitsPerEm}em`;
      }
    });
  });
}

export function splitText(element: HTMLElement) {
  function processTextNode(textNode: Node) {
    const frag = document.createDocumentFragment();
    const words = textNode.textContent?.split(/(\s+)/) ?? []; // split and keep spaces

    for (const part of words) {
      if (!part.trim()) {
        // Just whitespace — preserve as a text node
        frag.appendChild(document.createTextNode(part));
      } else {
        // Word — wrap in word and char spans
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";

        for (const char of part) {
          const charSpan = document.createElement("span");
          charSpan.className = "char";
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
        }

        frag.appendChild(wordSpan);
      }
    }

    return frag;
  }

  function processNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return processTextNode(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false); // shallow clone of the element
      for (const child of node.childNodes) {
        clone.appendChild(processNode(child));
      }
      return clone;
    }
    return document.createDocumentFragment(); // ignore comments, etc.
  }

  const newContent = document.createDocumentFragment();
  for (const child of [...element.childNodes]) {
    newContent.appendChild(processNode(child));
  }

  element.innerHTML = "";
  element.appendChild(newContent);
}

export { getKerningValue };
