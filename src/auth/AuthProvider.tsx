import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../const";
import { AuthContext, type AuthUser, type AuthUserPatch, AUTH_STORAGE_KEY } from "./AuthContext";
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
	const navigate = useNavigate();
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
		navigate(PATH.HOME, { replace: true });
	}, [navigate]);

	const updateUser = useCallback(
		(patch: AuthUserPatch) => {
			setUser((prev) => {
				if (!prev || !token) return prev;
				const next = { ...prev, ...patch };
				const payload = { user: next, token };
				localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
				setCrossDomainAuth(payload);
				return next;
			});
		},
		[token],
	);

	const value = useMemo(
		() => ({ user, token, signIn, signOut, updateUser }),
		[user, token, signIn, signOut, updateUser],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

