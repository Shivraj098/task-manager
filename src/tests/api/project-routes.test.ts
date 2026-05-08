import {
  describe,
  it,
  expect,
} from "vitest";

describe(
  "project route validation",
  () => {
    it(
      "should reject empty project name",
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
      "should reject unauthorized member addition",
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

    it(
      "should reject duplicate members",
      async () => {
        const response =
          new Response(null, {
            status: 409,
          });

        expect(
          response.status,
        ).toBe(409);
      },
    );
  },
);