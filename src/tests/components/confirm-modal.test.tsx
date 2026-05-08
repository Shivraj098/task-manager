import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { describe, it, expect, vi } from "vitest";

import { ConfirmModal } from "@/components/ui/confirm-modal";

describe(
  "ConfirmModal",
  () => {
    it(
      "renders modal content",
      () => {
        render(
          <ConfirmModal
            open
            title="Delete Task"
            description="Are you sure?"
            onConfirm={vi.fn()}
            onCancel={vi.fn()}
          />,
        );

        expect(
          screen.getByText(
            "Delete Task",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Are you sure?",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "calls onCancel",
      () => {
        const onCancel = vi.fn();

        render(
          <ConfirmModal
            open
            title="Test"
            description="Test"
            onConfirm={vi.fn()}
            onCancel={onCancel}
          />,
        );

        fireEvent.click(
          screen.getByText(
            "Cancel",
          ),
        );

        expect(onCancel).toHaveBeenCalled();
      },
    );

    it(
      "calls onConfirm",
      () => {
        const onConfirm = vi.fn();

        render(
          <ConfirmModal
            open
            title="Test"
            description="Test"
            onConfirm={onConfirm}
            onCancel={vi.fn()}
          />,
        );

        fireEvent.click(
          screen.getByText(
            "Confirm",
          ),
        );

        expect(onConfirm).toHaveBeenCalled();
      },
    );
  },
);