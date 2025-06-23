import { describe, it, expect, beforeEach } from 'vitest';
import { splitText, applyKerningFromExport, KerningDataOptimized, convertOptimizedToKerningPairs } from '../index';

describe('splitText', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should split text into words and letters', () => {
    container.textContent = 'Hello World';
    splitText(container);

    const words = container.querySelectorAll('.word');
    expect(words.length).toBe(2);

    const letters = container.querySelectorAll('.char');
    expect(letters.length).toBe(10); // 'Hello' (5) + 'World' (5)
  });

  it('should preserve whitespace', () => {
    container.textContent = 'Hello  World';
    splitText(container);

    const words = container.querySelectorAll('.word');
    expect(words.length).toBe(2);
    expect(container.textContent).toBe('Hello  World');
  });

  it('should handle empty text', () => {
    container.textContent = '';
    splitText(container);
    expect(container.children.length).toBe(0);
  });
});

describe('applyKerningFromExport', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should apply kerning values correctly from optimized format', () => {
    container.textContent = 'AV';
    splitText(container);

    const kerningData = {
      kerningPairs: [
        {
          left: ['A'],
          right: ['V'],
          value: -100
        }
      ],
      unitsPerEm: 1000
    };

    const kerningDataNormalized = convertOptimizedToKerningPairs(kerningData as KerningDataOptimized);
    applyKerningFromExport(container, kerningDataNormalized);

    const firstChar = container.querySelector('.char') as HTMLElement;
    expect(firstChar?.style.marginInlineEnd).toBe('-0.1em');
  });

  it('should handle multiple character groups in optimized format', () => {
    container.textContent = 'AVAW';
    splitText(container);

    const kerningData = {
      kerningPairs: [
        {
          left: ['A'],
          right: ['V', 'W'],
          value: -80
        }
      ],
      unitsPerEm: 1000
    };

    const kerningDataNormalized = convertOptimizedToKerningPairs(kerningData as KerningDataOptimized);
    applyKerningFromExport(container, kerningDataNormalized);

    const chars = container.querySelectorAll('.char') as NodeListOf<HTMLElement>;
    expect(chars[0]?.style.marginInlineEnd).toBe('-0.08em'); // A before V
    expect(chars[2]?.style.marginInlineEnd).toBe('-0.08em'); // A before W
  });

  it('should handle non-existent kerning pairs', () => {
    container.textContent = 'AB';
    splitText(container);

    const kerningData = {
      kerningPairs: [],
      unitsPerEm: 1000
    };

    const kerningDataNormalized = convertOptimizedToKerningPairs(kerningData as KerningDataOptimized);
    applyKerningFromExport(container, kerningDataNormalized);

    const firstChar = container.querySelector('.char') as HTMLElement;
    expect(firstChar?.style.marginInlineEnd).toBe('0em');
  });

  it('should handle complex optimized kerning data', () => {
    container.textContent = 'AVBWCX';
    splitText(container);

    const kerningData = {
      kerningPairs: [
        {
          left: ['A'],
          right: ['V'],
          value: -120
        },
        {
          left: ['B', 'C'],
          right: ['W', 'X'],
          value: -60
        }
      ],
      unitsPerEm: 1000
    };

    const kerningDataNormalized = convertOptimizedToKerningPairs(kerningData as KerningDataOptimized);
    applyKerningFromExport(container, kerningDataNormalized);

    const chars = container.querySelectorAll('.char') as NodeListOf<HTMLElement>;
    expect(chars[0]?.style.marginInlineEnd).toBe('-0.12em'); // A before V
    expect(chars[2]?.style.marginInlineEnd).toBe('-0.06em'); // B before W
    expect(chars[4]?.style.marginInlineEnd).toBe('-0.06em'); // C before X
  });
}); 

