import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement } from "react";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { ...options });

export * from "@testing-library/react";
export { customRender as render };
