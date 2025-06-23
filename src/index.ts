import { getKerningValue } from "./utils/get-kerning-value";
import { convertOptimizedToKerningPairs } from "./utils/convert-to-kerning-pairs";
import { applyKerningToElement } from "./utils/apply-kerning";
import type {
  FontLike,
  KerningOptions,
  SplitType,
  Letter,
  Word,
  TextElement,
  SplittedText,
  KerningData,
} from "./types/KerningTypes";

export function applyKerningFromFont(
  element: HTMLElement,
  font: FontLike,
  options: KerningOptions = {}
) {
  applyKerningToElement(
    element,
    (currentChar, nextChar) => getKerningValue(font, currentChar, nextChar),
    options
  );
}

export function applyKerningFromExport(
  element: HTMLElement,
  kernings: KerningData,
  options: KerningOptions = {}
) {
  applyKerningToElement(
    element,
    (currentChar, nextChar) =>
      (kernings.kerningPairs[`${currentChar}${nextChar}`] ?? 0) /
      kernings.unitsPerEm,
    options
  );
}

export function splitText(
  element: HTMLElement,
  splitType: SplitType = "letter"
): SplittedText {
  // Store original content for reset functionality
  const originalContent = element.innerHTML;
  const originalAriaLabel = element.getAttribute("aria-label");

  // Initialize the splitted text structure
  const text: TextElement = {
    value: element.textContent ?? "",
    words: [],
    element: element,
  };

  function processTextNode(textNode: Node) {
    const frag = document.createDocumentFragment();
    const words = textNode.textContent?.split(/(\s+)/) ?? [];

    for (const part of words) {
      if (!part.trim()) {
        frag.appendChild(document.createTextNode(part));
      } else {
        const wordSpan = document.createElement("span");
        wordSpan.ariaHidden = "true";
        wordSpan.className = "word";

        const word: Word = {
          value: part,
          element: wordSpan,
          letters: [],
        };

        if (splitType === "word") {
          wordSpan.textContent = part;
        } else {
          for (const char of part) {
            const charSpan = document.createElement("span");
            charSpan.ariaHidden = "true";
            charSpan.className = "char";
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);

            const letter: Letter = {
              value: char,
              element: charSpan,
            };
            word.letters!.push(letter);
          }
        }

        text.words!.push(word);
        frag.appendChild(wordSpan);
      }
    }

    return frag;
  }

  function processNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return processTextNode(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      for (const child of node.childNodes) {
        clone.appendChild(processNode(child));
      }
      return clone;
    }
    return document.createDocumentFragment();
  }

  const newContent = document.createDocumentFragment();
  for (const child of [...element.childNodes]) {
    newContent.appendChild(processNode(child));
  }

  element.ariaLabel = element.textContent ?? "";
  element.innerHTML = "";
  element.appendChild(newContent);

  // Return object with reset method and splitted text structure
  return {
    reset: () => {
      element.innerHTML = originalContent;
      if (originalAriaLabel) {
        element.setAttribute("aria-label", originalAriaLabel);
      } else {
        element.removeAttribute("aria-label");
      }
    },
    splitted: text,
  };
}

export * from "./types/KerningTypes";
export { getKerningValue, convertOptimizedToKerningPairs };
