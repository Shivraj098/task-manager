type ErrorResponse = {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    issues?: unknown;
  };
};

type SuccessResponse<T> = {
  success: true;
  data: T;
};

export function successResponse<T>(data: T) {
  const body: SuccessResponse<T> = {
    success: true,
    data,
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function errorResponse(
  message: string,
  statusCode = 400,
  code = "BAD_REQUEST",
  issues?: unknown
) {
  const body: ErrorResponse = {
    success: false,
    error: {
      message,
      code,
      statusCode,
      issues,
    },
  };

  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
  });
}