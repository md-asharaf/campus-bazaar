/**
 * Cookie helpers for frontend token persistence.
 *
 * Why cookies on the frontend?
 * - Your frontend and backend are on different registrable domains.
 * - Browser rules block many cross-site cookies set by the backend.
 * - Setting cookies on the frontend domain makes them first-party and persistent across reloads.
 *
 * Security notes:
 * - Values are encoded using encodeURIComponent.
 * - For first-party cookies on HTTPS, prefer SameSite='lax' and Secure=true.
 * - Avoid SameSite='none' unless you explicitly need cross-site cookie behavior (and then Secure must be true).
 */

export type SameSite = "lax" | "strict" | "none";

export type CookieOptions = {
  /**
   * Max age in seconds. If provided, takes precedence over `expires`.
   */
  maxAgeSeconds?: number;
  /**
   * Absolute expiration date. Only used when `maxAgeSeconds` is not provided.
   */
  expires?: Date;
  /**
   * Cookie path. Defaults to "/".
   */
  path?: string;
  /**
   * Cookie domain. Omit for host-only cookies (recommended).
   */
  domain?: string;
  /**
   * SameSite attribute. Defaults to "lax" for first-party cookies.
   */
  sameSite?: SameSite;
  /**
   * Whether to mark cookie as Secure. Defaults to true in production, false otherwise.
   * Note: Secure cookies are only sent over HTTPS.
   */
  secure?: boolean;
};

/** Internal: detect browser environment safely */
function isBrowser(): boolean {
  return typeof document !== "undefined" && typeof window !== "undefined";
}

/** Build cookie attribute string from options */
function buildCookieAttributes(options?: CookieOptions): string {
  const opts = options ?? {};
  const parts: string[] = [];

  // Path
  parts.push(`Path=${opts.path ?? "/"}`);

  // Domain (omit if not provided -> host-only cookie)
  if (opts.domain) {
    parts.push(`Domain=${opts.domain}`);
  }

  // Max-Age / Expires
  if (typeof opts.maxAgeSeconds === "number" && Number.isFinite(opts.maxAgeSeconds)) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(opts.maxAgeSeconds))}`);
  } else if (opts.expires instanceof Date) {
    parts.push(`Expires=${opts.expires.toUTCString()}`);
  }

  // SameSite
  const sameSite = (opts.sameSite ?? "lax").toLowerCase();
  if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
    // Capitalize first letter per convention
    const cap = sameSite.charAt(0).toUpperCase() + sameSite.slice(1);
    parts.push(`SameSite=${cap}`);
  }

  // Secure
  const isProd = typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production";
  const secure = typeof opts.secure === "boolean" ? opts.secure : isProd;
  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

/** Set a cookie on the current frontend domain */
export function setCookie(name: string, value: string, options?: CookieOptions): void {
  if (!isBrowser()) return;
  const encoded = encodeURIComponent(value);
  const attrs = buildCookieAttributes(options);
  document.cookie = `${name}=${encoded}; ${attrs}`;
}

/** Get a cookie by name (decoded). Returns null if not found. */
export function getCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const c of cookies) {
    const eqIdx = c.indexOf("=");
    if (eqIdx === -1) continue;
    const key = c.substring(0, eqIdx);
    if (key === name) {
      const raw = c.substring(eqIdx + 1);
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }
  return null;
}

/** Delete a cookie by setting Max-Age=0. Use same path/domain as when set. */
export function deleteCookie(name: string, options?: Pick<CookieOptions, "path" | "domain" | "sameSite" | "secure">): void {
  if (!isBrowser()) return;
  const attrs = buildCookieAttributes({
    ...options,
    maxAgeSeconds: 0,
  });
  document.cookie = `${name}=; ${attrs}`;
}

/** Convenience: parse all cookies into an object map */
export function getAllCookies(): Record<string, string> {
  const out: Record<string, string> = {};
  if (!isBrowser()) return out;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const c of cookies) {
    const eqIdx = c.indexOf("=");
    if (eqIdx === -1) continue;
    const key = c.substring(0, eqIdx);
    const raw = c.substring(eqIdx + 1);
    try {
      out[key] = decodeURIComponent(raw);
    } catch {
      out[key] = raw;
    }
  }
  return out;
}

/* ===== Auth token specific helpers ===== */

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/** Defaults for auth cookies: first-party, secure over HTTPS, Lax same-site, path=/ */
const defaultAuthCookieOptions: CookieOptions = {
  path: "/",
  sameSite: "lax",
  secure: true,
  // Access token short-lived (e.g., 15 min). Set explicitly per setter.
  // Refresh token longer-lived (e.g., 7 days). Set explicitly per setter.
};

/** Set access token cookie (default: 15 minutes) */
export function setAccessToken(token: string, options?: CookieOptions): void {
  setCookie(
    ACCESS_TOKEN_KEY,
    token,
    {
      ...defaultAuthCookieOptions,
      maxAgeSeconds: 15 * 60,
      ...(options ?? {}),
    }
  );
}

/** Set refresh token cookie (default: 7 days) */
export function setRefreshToken(token: string, options?: CookieOptions): void {
  setCookie(
    REFRESH_TOKEN_KEY,
    token,
    {
      ...defaultAuthCookieOptions,
      maxAgeSeconds: 7 * 24 * 60 * 60,
      ...(options ?? {}),
    }
  );
}

/** Set both tokens at once */
export function setTokenCookies(accessToken?: string | null, refreshToken?: string | null, options?: CookieOptions): void {
  if (typeof accessToken === "string") {
    setAccessToken(accessToken, options);
  }
  if (typeof refreshToken === "string") {
    setRefreshToken(refreshToken, options);
  }
}

/** Get access token from cookie */
export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY);
}

/** Get refresh token from cookie */
export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY);
}

/** Delete access token cookie */
export function deleteAccessToken(options?: Pick<CookieOptions, "path" | "domain" | "sameSite" | "secure">): void {
  deleteCookie(ACCESS_TOKEN_KEY, options);
}

/** Delete refresh token cookie */
export function deleteRefreshToken(options?: Pick<CookieOptions, "path" | "domain" | "sameSite" | "secure">): void {
  deleteCookie(REFRESH_TOKEN_KEY, options);
}

/** Clear both auth cookies */
export function clearAuthCookies(options?: Pick<CookieOptions, "path" | "domain" | "sameSite" | "secure">): void {
  deleteAccessToken(options);
  deleteRefreshToken(options);
}

/**
 * Utility: Ensures cookies are marked Secure if the site is running on HTTPS.
 * If you need to relax for local development (http), pass secure: false in options explicitly.
 */
export function normalizeAuthCookieOptions(options?: CookieOptions): CookieOptions {
  const isHttps = isBrowser() && window.location.protocol === "https:";
  return {
    ...defaultAuthCookieOptions,
    ...(options ?? {}),
    secure: typeof options?.secure === "boolean" ? options.secure : isHttps,
  };
}