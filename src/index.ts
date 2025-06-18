import { getKerningValue } from "./utils/get-kerning-value";
import { convertOptimizedToKerningPairs } from "./utils/convert-to-kerning-pairs";
import { FontLike, KerningDataOptimized, KerningOptions } from "./types/KerningTypes";

function applyKerningToElement(
  element: HTMLElement,
  getKerning: (currentChar: string, nextChar: string) => number,
  options: KerningOptions = {}
) {
  if (!element) {
    throw new Error("Element is required");
  }

  const { wordSelector = ".word", charSelector = ".char" } = options;

  // Batch DOM reads
  const words = Array.from(element.querySelectorAll<HTMLElement>(wordSelector));
  const updates: { element: HTMLElement; margin: string }[] = [];

  // Process all words and collect updates
  for (const word of words) {
    const letters = Array.from(
      word.querySelectorAll<HTMLElement>(charSelector)
    );
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      if (letter.textContent) {
        const kerning = getKerning(
          letter.textContent,
          letters[i + 1]?.textContent ?? ""
        );
        updates.push({
          element: letter,
          margin: `${kerning}em`,
        });
      }
    }
  }

  // Batch DOM writes
  if (updates.length > 0) {
    for (const { element, margin } of updates) {
      element.style.marginInlineEnd = margin;
    }
  }
}

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
  kernings: KerningDataOptimized,
  options: KerningOptions = {}
) {
  const normKernings = convertOptimizedToKerningPairs(kernings);
  applyKerningToElement(
    element,
    (currentChar, nextChar) =>
      (normKernings.kerningPairs[`${currentChar}${nextChar}`] ?? 0) /
      normKernings.unitsPerEm,
    options
  );
}

export function splitText(
  element: HTMLElement,
  splitType: "word" | "letter" = "letter"
) {
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

        if (splitType === "word") {
          wordSpan.textContent = part;
        } else {
          for (const char of part) {
            const charSpan = document.createElement("span");
            charSpan.ariaHidden = "true";
            charSpan.className = "char";
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
          }
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
}

export { getKerningValue };
