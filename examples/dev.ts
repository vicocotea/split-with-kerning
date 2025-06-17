import {
  applyKerningFromExport,
  applyKerningFromFont,
  splitText,
} from "../src/index";
import opentype from "opentype.js";

const now = performance.now();

const splitType = document.getElementById("splitType") as HTMLSelectElement;
const type = document.getElementById("type") as HTMLSelectElement;
const splitButton = document.getElementById("split") as HTMLButtonElement;
const applyKerningButton = document.getElementById(
  "applyKerning"
) as HTMLButtonElement;
const resetButton = document.getElementById("reset") as HTMLButtonElement;
const disableKerningButton = document.getElementById("disableKerning") as HTMLButtonElement;

// first load font needed to get the kerning
const font = await opentype.load("./fonts/Voyage-Regular.woff");
const elements = Array.from(document.querySelectorAll("p")) as HTMLElement[];
const backupElements = elements.map((element) => element.cloneNode(true) as HTMLElement);

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
  splitTypeValue: "word" | "letter",
  typeValue: "font" | "export"
) {
  reset();
  elements.forEach((element) => {    
    splitText(element, splitTypeValue);
  });
}

function applyKerning(elements: HTMLElement[], typeValue: "font" | "export") {
  elements.forEach((element) => {
    if (typeValue === "font") {
      applyKerningFromFont(element, font);
    } else {
      applyKerningFromExport(element, font);
    }
  });
}

function reset() {
  elements.forEach((element, index) => {
    element.ariaLabel = backupElements[index].ariaLabel;
    element.innerHTML = backupElements[index].innerHTML;
  });
}

function toggleKerning() {
  document.body.classList.toggle("disable-kerning");
  isKerningDisabled = !isKerningDisabled;
}

console.log("--- time ---", performance.now() - now);
