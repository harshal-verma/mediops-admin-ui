// Lightweight API client for the MediOps backend.
// Handles bearer tokens, automatic refresh, and JSON parsing.

export const API_BASE = "https://tenant-management-ee8u.onrender.com";

const ACCESS_KEY = "medi.accessToken";
const REFRESH_KEY = "medi.refreshToken";
const USER_KEY = "medi.user";

export type AuthUser = {
  id: number;
  email: string;
  role: string;
};

export const tokenStore = {
  get access() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  get user(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
  set(tokens: { accessToken: string; refreshToken: string; user?: AuthUser }) {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    if (tokens.user) localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
    window.dispatchEvent(new Event("medi:auth"));
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("medi:auth"));
  },
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

let refreshInflight: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  const refreshToken = tokenStore.refresh;
  if (!refreshToken) return null;
  if (refreshInflight) return refreshInflight;
  refreshInflight = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        tokenStore.clear();
        return null;
      }
      const json = await res.json();
      const data = json?.data ?? json;
      if (data?.accessToken) {
        tokenStore.set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? refreshToken,
          user: data.user ?? tokenStore.user ?? undefined,
        });
        return data.accessToken as string;
      }
      tokenStore.clear();
      return null;
    } finally {
      refreshInflight = null;
    }
  })();
  return refreshInflight;
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit & { auth?: boolean; raw?: boolean } = {},
): Promise<T> {
  const { auth = true, raw = false, headers, ...rest } = init;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const buildHeaders = (token: string | null): HeadersInit => {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
      ...(headers as Record<string, string> | undefined),
    };
    if (auth && token) h.Authorization = `Bearer ${token}`;
    return h;
  };

  let res = await fetch(url, { ...rest, headers: buildHeaders(tokenStore.access) });

  if (res.status === 401 && auth) {
    const newToken = await tryRefresh();
    if (newToken) {
      res = await fetch(url, { ...rest, headers: buildHeaders(newToken) });
    }
  }

  const text = await res.text();
  const json = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (json && (json.message || json.error)) || res.statusText || "Request failed";
    throw new ApiError(res.status, message, json);
  }

  if (raw) return json as T;
  return ((json && "data" in json ? json.data : json) as T);
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
