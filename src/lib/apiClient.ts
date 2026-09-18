export const API_BASE = import.meta.env.VITE_BE_URL ?? 'http://localhost:5000';

interface ApiFetchOptions {
  method?: string;
  token?: string | null;
  body?: unknown;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(url: string, { method = 'GET', token, body }: ApiFetchOptions = {}): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
    throw new ApiError('Session expired', 401);
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new ApiError(payload.error ?? `Request failed (HTTP ${res.status})`, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
