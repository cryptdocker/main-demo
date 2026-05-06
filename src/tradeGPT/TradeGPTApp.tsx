import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { PATH } from "../const";
import { ThemeProvider } from "./context/ThemeContext";
import { TradeGPTUserProvider } from "./context/TradeGPTUserContext";
import { TradeGPTDashboard } from "./pages/TradeGPTDashboard";
import { isValidSettingsSection } from "./pages/SettingsPage";

const BASE = "/trade-gpt";

function RequireTradeGPTAuth({ children }: { children: React.ReactNode }) {
	const { user, token } = useAuth();
	const location = useLocation();

	if (!user || !token) {
		return (
			<Navigate
				to={PATH.SIGN_IN}
				replace
				state={{ from: `${location.pathname}${location.search}` }}
			/>
		);
	}
	return <>{children}</>;
}

function LegacySettingsRedirect() {
	const { section } = useParams<{ section?: string }>();
	const target = isValidSettingsSection(section)
		? `${BASE}/chat?settings=${encodeURIComponent(section ?? "")}`
		: `${BASE}/chat?settings=general`;
	return <Navigate to={target} replace />;
}

export function TradeGPTApp() {
	return (
		<ThemeProvider>
			<TradeGPTUserProvider>
				<Routes>
					<Route
						path="auth"
						element={
							<Navigate
								to={PATH.SIGN_IN}
								replace
								state={{ from: `${BASE}/chat` }}
							/>
						}
					/>
					<Route
						path="chat/:conversationId?"
						element={
							<RequireTradeGPTAuth>
								<TradeGPTDashboard />
							</RequireTradeGPTAuth>
						}
					/>
					<Route
						path="settings/:section?"
						element={
							<RequireTradeGPTAuth>
								<LegacySettingsRedirect />
							</RequireTradeGPTAuth>
						}
					/>
					<Route path="*" element={<Navigate to={`${BASE}/chat`} replace />} />
				</Routes>
			</TradeGPTUserProvider>
		</ThemeProvider>
	);
}
