import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { useAuth as useMainAuth } from "../../auth/useAuth";
import { apiGetSubscription, type AuthUser, type SubscriptionInfo } from "../lib/api";
import { readJson, removeKey, writeJson, STORAGE_KEYS } from "../config/storage";

type TradeGPTUserContextValue = {
	user: AuthUser | null;
	token: string | null;
	subscription: SubscriptionInfo | null;
	refreshSubscription: () => Promise<void>;
	logout: () => void;
	/** True while loading TradeGPT subscription for a signed-in user */
	loading: boolean;
};

const TradeGPTUserContext = createContext<TradeGPTUserContextValue | null>(null);

export function TradeGPTUserProvider({ children }: { children: ReactNode }) {
	const { user, token, signOut } = useMainAuth();
	const [subscription, setSubscription] = useState<SubscriptionInfo | null>(() =>
		readJson<SubscriptionInfo>(STORAGE_KEYS.subscription),
	);
	const [loading, setLoading] = useState(false);

	const refreshSubscription = useCallback(async () => {
		if (!token) return;
		try {
			const sub = await apiGetSubscription(token);
			writeJson(STORAGE_KEYS.subscription, sub);
			setSubscription(sub);
		} catch {
			// stale cache is acceptable
		}
	}, [token]);

	useEffect(() => {
		if (!token || !user) {
			removeKey(STORAGE_KEYS.subscription);
			setSubscription(null);
			setLoading(false);
			return;
		}
		let cancelled = false;
		setLoading(true);
		refreshSubscription()
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [token, user, refreshSubscription]);

	const value = useMemo<TradeGPTUserContextValue>(
		() => ({
			user,
			token,
			subscription,
			refreshSubscription,
			logout: signOut,
			loading,
		}),
		[user, token, subscription, refreshSubscription, signOut, loading],
	);

	return (
		<TradeGPTUserContext.Provider value={value}>{children}</TradeGPTUserContext.Provider>
	);
}

export function useTradeGPTUser(): TradeGPTUserContextValue {
	const ctx = useContext(TradeGPTUserContext);
	if (!ctx) throw new Error("useTradeGPTUser must be used within TradeGPTUserProvider");
	return ctx;
}
