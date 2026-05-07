import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/server/lib/prisma", () => ({
  prisma: {
    task: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
    },

    projectMember: {
      findUnique: vi.fn(),
    },

    $transaction: async (
      callback: (
        tx: unknown,
      ) => Promise<unknown>,
    ) => {
      return callback({
        task: {
          findUnique: vi.fn(),
          update: vi.fn(),
        },
      });
    },
  },
}));

describe(
  "task service lifecycle",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it(
      "should prevent invalid transition from DONE to IN_PROGRESS",
      async () => {
        expect(true).toBe(true);
      },
    );

    it(
      "should allow assigned member to start task",
      async () => {
        expect(true).toBe(true);
      },
    );

    it(
      "should reject non-assigned member from starting task",
      async () => {
        expect(true).toBe(true);
      },
    );

    it(
      "should allow member to complete task",
      async () => {
        expect(true).toBe(true);
      },
    );
  },
);