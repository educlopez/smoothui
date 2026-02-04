import pc from "picocolors";
import { SYMBOLS } from "../constants.js";

export const S = SYMBOLS;

export const dim = pc.dim;
export const cyan = pc.cyan;
export const green = pc.green;
export const red = pc.red;
export const yellow = pc.yellow;
export const bold = pc.bold;
export const gray = pc.gray;

// ANSI 256-color grays for gradient (works on light and dark terminals)
const GRAYS = [
  "\x1b[38;5;252m", // lightest
  "\x1b[38;5;249m",
  "\x1b[38;5;246m",
  "\x1b[38;5;243m",
  "\x1b[38;5;240m",
  "\x1b[38;5;237m", // darkest
];
const RESET = "\x1b[0m";

// ASCII art logo for SmoothUI
const LOGO = [
  "███████╗███╗   ███╗ ██████╗  ██████╗ ████████╗██╗  ██╗██╗   ██╗██╗",
  "██╔════╝████╗ ████║██╔═══██╗██╔═══██╗╚══██╔══╝██║  ██║██║   ██║██║",
  "███████╗██╔████╔██║██║   ██║██║   ██║   ██║   ███████║██║   ██║██║",
  "╚════██║██║╚██╔╝██║██║   ██║██║   ██║   ██║   ██╔══██║██║   ██║██║",
  "███████║██║ ╚═╝ ██║╚██████╔╝╚██████╔╝   ██║   ██║  ██║╚██████╔╝██║",
  "╚══════╝╚═╝     ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝",
];

// Version from package.json (injected at build time or read dynamically)
const VERSION = "1.1.1";

export function step(symbol: string, message: string): void {
  console.log(`${symbol}  ${message}`);
}

export function active(message: string): void {
  step(cyan(S.active), message);
}

export function done(message: string): void {
  step(dim(S.done), message);
}

export function success(message: string): void {
  step(green(S.success), message);
}

export function error(message: string): void {
  step(red(S.error), message);
}

export function bar(message = ""): void {
  console.log(`${dim(S.bar)}  ${message}`);
}

export function header(): void {
  console.log();

  // Print logo with gradient
  for (let i = 0; i < LOGO.length; i++) {
    console.log(`${GRAYS[i]}${LOGO[i]}${RESET}`);
  }

  // Print version below
  console.log();
  console.log(`  ${dim(`v${VERSION}`)}`);
  console.log();
}
