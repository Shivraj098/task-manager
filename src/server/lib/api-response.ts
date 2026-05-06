export function successResponse(data: unknown) {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}