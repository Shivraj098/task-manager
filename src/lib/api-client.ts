import type {
  ApiResponse,
} from "@/types/api/api-response.types";

export async function apiClient<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    ...init,
  });

  const json =
    (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    throw new Error(
      json.success
        ? "Request failed"
        : json.error,
    );
  }

  return json.data;
}