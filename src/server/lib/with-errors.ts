import { ZodError } from "zod";
import { AppError } from "./app-errors";

export function withErrorHandling<T>(
  handler: (
    req: Request,
    context?: T,
  ) => Promise<Response>,
) {
  return async (
    req: Request,
    context?: T,
  ): Promise<Response> => {
    try {
      return await handler(req, context);
    } catch (error: unknown) {
      console.error(
        "[API_ERROR]",
        error,
      );

      if (error instanceof ZodError) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "Validation failed",
            issues: error.issues,
          }),
          {
            status: 422,
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );
      }

      if (error instanceof AppError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: error.message,
          }),
          {
            status: error.statusCode,
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Internal server error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );
    }
  };
}