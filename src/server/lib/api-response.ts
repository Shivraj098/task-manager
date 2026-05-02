export function successResponse<T>(data: T) {
  return Response.json({
    success: true,
    data,
  });
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