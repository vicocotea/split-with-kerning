import {
  applyKerningFromExport,
  applyKerningFromFont,
  convertOptimizedToKerningPairs,
  splitText,
} from "../src/index";
import opentype from "opentype.js";
import type { SplittedText } from "../src/types/KerningTypes";

const now = performance.now();

const splitType = document.getElementById("splitType") as HTMLSelectElement;
const type = document.getElementById("type") as HTMLSelectElement;
const splitButton = document.getElementById("split") as HTMLButtonElement;
const applyKerningButton = document.getElementById(
  "applyKerning"
) as HTMLButtonElement;
const resetButton = document.getElementById("reset") as HTMLButtonElement;
const disableKerningButton = document.getElementById(
  "disableKerning"
) as HTMLButtonElement;

// first load font needed to get the kerning
const font = await opentype.load("./fonts/Voyage-Regular.woff");
const kerningPairs = await fetch("./fonts/Voyage-Regular-kerning.json")
  .then((res) => res.json())
  .then((data) => convertOptimizedToKerningPairs(data));

const elements = Array.from(document.querySelectorAll("p")) as HTMLElement[];
const splitted: SplittedText[] = [];

let isKerningDisabled = false;

splitButton.addEventListener("click", () => {
  const splitTypeValue = splitType.value as "word" | "letter";
  const typeValue = type.value as "font" | "export";

  split(elements, splitTypeValue, typeValue);
});

applyKerningButton.addEventListener("click", () => {
  const typeValue = type.value as "font" | "export";
  applyKerning(elements, typeValue);
});

resetButton.addEventListener("click", () => {
  reset();
});

disableKerningButton.addEventListener("click", () => {
  toggleKerning();
});

function split(
  elements: HTMLElement[],
  splitTypeValue: "word" | "letter" | "none",
  typeValue: "font" | "export"
) {
  reset();
  elements.forEach((element) => {
    const result: SplittedText = splitText(element, splitTypeValue);
    splitted.push(result);
  });
}

function applyKerning(elements: HTMLElement[], typeValue: "font" | "export") {
  elements.forEach((element) => {
    if (typeValue === "font") {
      applyKerningFromFont(element, font);
    } else {
      applyKerningFromExport(element, kerningPairs);
    }
  });
}

function reset() {
  splitted.forEach((item) => {
    item.reset();
  });
  splitted.length = 0;
}

function toggleKerning() {
  document.body.classList.toggle("disable-kerning");
  isKerningDisabled = !isKerningDisabled;
}

console.log("--- time ---", performance.now() - now);
