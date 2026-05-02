
type RouteHandler<TContext extends Record<string, unknown>> = (
  req: Request,
  context: TContext
) => Promise<Response>;

export function withErrorHandling<TContext extends Record<string, unknown>>(
  handler: RouteHandler<TContext>
) {
  return async (req: Request, context: TContext): Promise<Response> => {
    try {
      return await handler(req, context);
    } catch (err: unknown) {
      console.error(err);

      const message =
        err instanceof Error ? err.message : "Internal Server Error";

      return new Response(
        JSON.stringify({
          success: false,
          error: message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}