// import {
//   loadFont,
//   splitElementWithKerning,
//   splitWithKerning,
//   splittedToElement,
// } from "./";

// const init = async () => {
//   const font = await loadFont("./Voyage-Regular.woff");

//   if (!font) return;

//   const element = document.querySelector("p") as HTMLElement;
//   const splitted = splitWithKerning(element.innerHTML, font!);
//   const splittedElement = splittedToElement(splitted);
//   element.innerHTML = splittedElement.innerHTML;
//   //   element.appendChild(splittedElement as HTMLElement);

//   console.log("--- splitted ---", splitted);
//   console.log("--- splittedElement ---", splittedElement);
// };

// // const init = async () => {
// //   const splitted = await splitElementWithKerning(
// //     document.querySelector("p") as HTMLElement,
// //     "./Voyage-Regular.woff"
// //   );

// //   console.log("--- splitted ---", splitted);
// // };

// init();

import { splitElementWithKerning } from "./";

const splitted = await splitElementWithKerning(
  document.querySelector("p") as HTMLElement,
  "./Voyage-Regular.woff"
);