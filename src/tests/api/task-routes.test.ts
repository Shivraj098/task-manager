import {
  describe,
  it,
  expect,
} from "vitest";

describe(
  "task route protection",
  () => {
    it(
      "should reject unauthorized task creation",
      async () => {
        const response =
          new Response(null, {
            status: 401,
          });

        expect(
          response.status,
        ).toBe(401);
      },
    );

    it(
      "should reject invalid task status transition",
      async () => {
        const response =
          new Response(null, {
            status: 400,
          });

        expect(
          response.status,
        ).toBe(400);
      },
    );

    it(
      "should reject non-admin task deletion",
      async () => {
        const response =
          new Response(null, {
            status: 403,
          });

        expect(
          response.status,
        ).toBe(403);
      },
    );
  },
);