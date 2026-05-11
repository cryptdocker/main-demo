/**
 * Cross-domain auth cookie shared between cryptdocker.com and trade.cryptdocker.com.
 *
 * Demo site must not authenticate the live site, so we include an `env` flag in
 * the cookie payload and only accept cookies created by the demo environment.
 *
 * Since localStorage is origin-specific, we use a cookie on `.cryptdocker.com`
 * so both subdomains can read/write the same auth state.
 * The cookie stores a JSON payload: { user: AuthUser, token: string }
 */

const COOKIE_NAME = "cd_auth";
const COOKIE_DOMAIN = ".cryptdocker.com";
const COOKIE_MAX_AGE_DAYS = 30;
const APP_ENV = "demo";

export type CrossDomainAuthPayload = {
  user: { uuid: string; email: string; fullName?: string; avatar?: string };
  token: string;
};

type CookiePayload = CrossDomainAuthPayload & { env: "demo" | "live" };

function isSecureContext(): boolean {
  return location.protocol === "https:";
}

export function setCrossDomainAuth(payload: CrossDomainAuthPayload): void {
  try {
    const cookiePayload: CookiePayload = { ...payload, env: APP_ENV };
    const value = encodeURIComponent(JSON.stringify(cookiePayload));
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    const parts = [
      `${COOKIE_NAME}=${value}`,
      `domain=${COOKIE_DOMAIN}`,
      `path=/`,
      `max-age=${maxAge}`,
      `samesite=lax`,
    ];
    if (isSecureContext()) parts.push("secure");
    document.cookie = parts.join("; ");
  } catch {
    /* ignore */
  }
}

export function getCrossDomainAuth(): CrossDomainAuthPayload | null {
  try {
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
      const [name, ...rest] = c.trim().split("=");
      if (name === COOKIE_NAME) {
        const raw = decodeURIComponent(rest.join("="));
        const parsed = JSON.parse(raw) as Partial<CookiePayload>;
        if (parsed?.env !== APP_ENV) continue;
        if (parsed?.token && parsed?.user?.uuid && parsed?.user?.email) {
          const { user, token } = parsed as CookiePayload;
          return { user, token };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function clearCrossDomainAuth(): void {
  try {
    const parts = [
      `${COOKIE_NAME}=`,
      `domain=${COOKIE_DOMAIN}`,
      `path=/`,
      `max-age=0`,
      `samesite=lax`,
    ];
    if (isSecureContext()) parts.push("secure");
    document.cookie = parts.join("; ");
  } catch {
    /* ignore */
  }
}
