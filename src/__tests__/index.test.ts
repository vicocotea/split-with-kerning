import { describe, it, expect, beforeEach } from 'vitest';
import { splitText, applyKerningFromExport } from '../index';

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

  it('should apply kerning values correctly', () => {
    container.textContent = 'AV';
    splitText(container);

    const kerningData = {
      kerningPairs: {
        'AV': -100
      },
      unitsPerEm: 1000
    };

    applyKerningFromExport(container, kerningData);

    const firstChar = container.querySelector('.char') as HTMLElement;
    expect(firstChar?.style.marginInlineEnd).toBe('-0.1em');
  });

  it('should handle non-existent kerning pairs', () => {
    container.textContent = 'AB';
    splitText(container);

    const kerningData = {
      kerningPairs: {},
      unitsPerEm: 1000
    };

    applyKerningFromExport(container, kerningData);

    const firstChar = container.querySelector('.char') as HTMLElement;
    expect(firstChar?.style.marginInlineEnd).toBe('0em');
  });
}); 