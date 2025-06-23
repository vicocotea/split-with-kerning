import type { KerningOptions } from "../types/KerningTypes";

export function applyKerningToElement(
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
