import type { ApiErrorBody, ApiResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message || `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code;
  }
}

async function requestResponse<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    signal: options?.signal,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  let body: ApiResponse<T> | ApiErrorBody;
  try {
    body = (await response.json()) as ApiResponse<T> | ApiErrorBody;
  } catch {
    throw new ApiError(response.status, { message: 'The server returned an invalid response' });
  }

  if (!response.ok) {
    const error = 'error' in body && body.error ? body.error : (body as ApiErrorBody);
    throw new ApiError(response.status, error);
  }

  if ('success' in body && !body.success) {
    throw new ApiError(response.status, body.error || { message: 'Request failed' });
  }

  return body as ApiResponse<T>;
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await requestResponse<T>(path, options);
  return response.data;
}

export async function apiRequestWithMeta<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  return requestResponse<T>(path, options);
}