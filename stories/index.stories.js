import { cleanup } from "../src/index.ts";
import './doc-style.css';

export default {
  parameters: {
    layout: "centered",
  },
};

export const main = () => {
  cleanup();
  return `
    <p>This Santa will fly off anywhere from your HTML document element, mwuahuahahaha >:)</p>
    <flying-santa></flying-santa>
  `;
};

export const changeSpeed = () => {
  cleanup();
  return `
    <p>You can configure how quick it changes direction</p>
    <flying-santa change-speed="1000"></flying-santa>
  `;
}

export const speed = () => {
  cleanup();
  return `
    <p>You can configure how quick it moves</p>
    <flying-santa speed="2"></flying-santa>
  `;
}

export const presentsDistance = () => {
  cleanup();
  return `
    <p>You can configure from how far it starts throwing presents</p>
    <flying-santa presents-distance="300"></flying-santa>
  `;
}

export const presentsInterval = () => {
  cleanup();
  return `
    <p>You can configure from how often it throws presents. Smaller interval = more presents</p>
    <flying-santa presents-interval="40"></flying-santa>
  `;
}

export const presentsDropSpeed = () => {
  cleanup();
  return `
    <p>You can configure from how hard gravity pulls on presents</p>
    <flying-santa presents-drop-speed="0.25"></flying-santa>
  `;
}