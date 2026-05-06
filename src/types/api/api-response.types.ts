export type SuccessApiResponse<T> = {
  success: true;
  data: T;
};

export type ErrorApiResponse = {
  success: false;
  error: string;
};

export type ApiResponse<T> =
  | SuccessApiResponse<T>
  | ErrorApiResponse;