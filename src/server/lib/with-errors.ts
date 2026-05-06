import { ZodError } from "zod";

export function withErrorHandling<T>(
  handler: (req: Request, context?: T) => Promise<Response>
) {
  return async (req: Request, context?: T): Promise<Response> => {
    try {
      return await handler(req, context);
    } catch (err: unknown) {
      console.error("API Error:", err);

      // ✅ Handle Zod validation errors properly
      if (err instanceof ZodError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Validation error",
            issues: err.issues,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: err instanceof Error ? err.message : "Server error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}