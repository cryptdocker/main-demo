import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { PATH } from "./const";
import { PageLayout } from "./layout/PageLayout";
import { Home } from "./page/Home";
import { About } from "./page/About";
import { Blog } from "./page/Blog";
import { BlogPost } from "./page/BlogPost";
import { Careers } from "./page/Careers";
import { Contact } from "./page/Contact";
import { Support } from "./page/Support";
import { Privacy } from "./page/Privacy";
import { Terms } from "./page/Terms";
import { Download } from "./page/Download";
import { MentalShield } from "./page/MentalShield";
import { Documentation } from "./page/Documentation";
import { WalletAnalysis } from "./page/WalletAnalysis";
import { SiteAnalysis } from "./page/SiteAnalysis";
import { NewsAnalysis } from "./page/NewsAnalysis";
import { SignIn } from "./page/SignIn";
import { SignUp } from "./page/SignUp";
import { Dashboard } from "./page/Dashboard";
import { RequireAuth } from "./component/RequireAuth";
import { TradeGPTApp } from "./tradeGPT/TradeGPTApp";

/** Standalone TradeGPT used `/chat/...`; embedded app lives under `/trade-gpt/chat/...`. */
function LegacyTradeGPTChatRedirect() {
	const { pathname, search } = useLocation();
	const rest =
		pathname.startsWith("/chat") && pathname.length > "/chat".length
			? pathname.slice("/chat".length)
			: "";
	return <Navigate to={`${PATH.TRADE_GPT}/chat${rest}${search}`} replace />;
}

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/chat/*" element={<LegacyTradeGPTChatRedirect />} />
					<Route element={<PageLayout />}>
					<Route path={PATH.TRADE_GPT_WILDCARD} element={<TradeGPTApp />} />
					<Route path={PATH.HOME} element={<Home />} />
					<Route path={PATH.ABOUT} element={<About />} />
					<Route path={PATH.BLOG} element={<Blog />} />
					<Route path={PATH.BLOG_POST} element={<BlogPost />} />
					<Route path={PATH.CAREERS} element={<Careers />} />
					<Route path={PATH.CONTACT} element={<Contact />} />
					<Route path={PATH.SUPPORT} element={<Support />} />
					<Route path={PATH.DOCUMENTATION} element={<Documentation />} />
					<Route path={PATH.PRIVACY} element={<Privacy />} />
					<Route path={PATH.TERMS} element={<Terms />} />
					<Route path={PATH.DOWNLOAD} element={<Download />} />
					<Route path={PATH.MENTALSHIELD} element={<MentalShield />} />
					<Route
						path={PATH.WALLET_ANALYSIS}
						element={<WalletAnalysis />}
					/>
					<Route path={PATH.SITE_ANALYSIS} element={<SiteAnalysis />} />
					<Route path={PATH.NEWS_ANALYSIS} element={<NewsAnalysis />} />
					<Route path={PATH.SIGN_IN} element={<SignIn />} />
					<Route path={PATH.SIGN_UP} element={<SignUp />} />
					<Route
						path={PATH.DASHBOARD}
						element={
							<RequireAuth>
								<Dashboard />
							</RequireAuth>
						}
					/>
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
