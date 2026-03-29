/**
 * Prefer same-origin proxy in dev (`/api-backend` → Laravel) so the browser does not
 * block requests (CORS / localhost vs 127.0.0.1). Override with NEXT_PUBLIC_API_URL
 * if the API is on another host.
 */
function getApiBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }
  if (typeof window !== "undefined") {
    return "/api-backend";
  }
  return "http://127.0.0.1:8000/api";
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export type ApiUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
};

export function getStoredUser(): ApiUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ApiUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: ApiUser) {
  localStorage.setItem("user", JSON.stringify(user));
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (e) {
    const hint =
      typeof window !== "undefined"
        ? " Start the API with: cd backend && php artisan serve (or set NEXT_PUBLIC_API_URL to your API base URL)."
        : "";
    throw new Error(
      e instanceof Error
        ? `${e.message}.${hint}`
        : `Network error.${hint}`
    );
  }

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = parseApiError(body) ?? res.statusText;
    throw new Error(msg);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

function parseApiError(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const o = body as { message?: string; error?: string; errors?: Record<string, string[]> };
  if (o.message && typeof o.message === "string") return o.message;
  if (o.error && typeof o.error === "string") return o.error;
  if (o.errors) {
    for (const v of Object.values(o.errors)) {
      if (Array.isArray(v) && typeof v[0] === "string") return v[0];
      if (typeof v === "string") return v;
    }
  }
  return null;
}
