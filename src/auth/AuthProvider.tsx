import { useCallback, useMemo, useState } from "react";
import { AuthContext, type AuthUser, AUTH_STORAGE_KEY } from "./AuthContext";
import {
	getCrossDomainAuth,
	setCrossDomainAuth,
	clearCrossDomainAuth,
} from "./crossDomainAuth";

/**
 * Load auth from localStorage first; if not found, check cross-domain cookie.
 * This allows SSO between cryptdocker.com and trade.cryptdocker.com.
 */
function loadStoredAuth(): { user: AuthUser; token: string } | null {
	try {
		const raw = localStorage.getItem(AUTH_STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as { user?: AuthUser; token?: string };
			if (parsed?.token && parsed?.user?.email) return { user: parsed.user, token: parsed.token };
		}
	} catch { /* ignore */ }

	const cookie = getCrossDomainAuth();
	if (cookie) {
		localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(cookie));
		return cookie;
	}
	return null;
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const stored = loadStoredAuth();
	const [user, setUser] = useState<AuthUser | null>(stored?.user ?? null);
	const [token, setToken] = useState<string | null>(stored?.token ?? null);

	const signIn = useCallback((payload: { user: AuthUser; token: string }) => {
		setUser(payload.user);
		setToken(payload.token);
		localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
		setCrossDomainAuth(payload);
	}, []);

	const signOut = useCallback(() => {
		setUser(null);
		setToken(null);
		localStorage.removeItem(AUTH_STORAGE_KEY);
		clearCrossDomainAuth();
	}, []);

	const value = useMemo(() => ({ user, token, signIn, signOut }), [user, token, signIn, signOut]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

