import { ReactNode } from "react";
import { render } from "@testing-library/react";

export function renderWithProviders(
  ui: ReactNode,
) {
  return render(ui);
}