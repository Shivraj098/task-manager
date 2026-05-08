import {
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  it,
  expect,
} from "vitest";

import { ToastContainer } from "@/components/ui/toast";

describe(
  "ToastContainer",
  () => {
    it(
      "renders success toast",
      () => {
        render(
          <ToastContainer
            toasts={[
              {
                id: "1",
                message:
                  "Success",
                type:
                  "success",
              },
            ]}
          />,
        );

        expect(
          screen.getByText(
            "Success",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders error toast",
      () => {
        render(
          <ToastContainer
            toasts={[
              {
                id: "2",
                message: "Error",
                type: "error",
              },
            ]}
          />,
        );

        expect(
          screen.getByText(
            "Error",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);