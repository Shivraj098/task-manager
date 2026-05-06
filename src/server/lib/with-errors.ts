import { ZodError } from "zod";

import { errorResponse } from "./api-response";
import { AppError } from "./errors";

export function withErrorHandling<T>(
  handler: (req: Request, context?: T) => Promise<Response>
) {
  return async (req: Request, context?: T): Promise<Response> => {
    try {
      return await handler(req, context);
    } catch (err: unknown) {
      console.error("API Error:", err);

      // Zod validation
      if (err instanceof ZodError) {
        return errorResponse(
          "Validation error",
          400,
          "VALIDATION_ERROR",
          err.issues
        );
      }

      // App errors
      if (err instanceof AppError) {
        return errorResponse(
          err.message,
          err.statusCode,
          err.code
        );
      }

      // Unknown fallback
      return errorResponse(
        "Internal server error",
        500,
        "INTERNAL_SERVER_ERROR"
      );
    }
  };
}