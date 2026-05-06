import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "../section/Navbar";
import { Footer } from "../section/Footer";
import { ScrollToHash } from "../component/ScrollToHash";
import { TradeGPTBadge } from "../component/TradeGPTBadge";
import { useAuth } from "../auth/useAuth";
import { PATH } from "../const";

export const PageLayout: React.FC = () => {
	const location = useLocation();
	const { user, token } = useAuth();
	const hideFooterForTradeGPT =
		location.pathname.startsWith(PATH.TRADE_GPT) && Boolean(user && token);
	const hideFooterForDashboard = location.pathname === PATH.DASHBOARD;
	const motionKey = location.pathname.startsWith(PATH.TRADE_GPT)
		? PATH.TRADE_GPT
		: location.pathname;

	return (
		<div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-dark-base">
			<ScrollToHash />
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-xl focus:bg-teal-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:shadow-teal-900/40"
			>
				Skip to main content
			</a>
			<Navbar />
			{location.pathname === "/" && <TradeGPTBadge />}
			<AnimatePresence mode="wait">
				<motion.main
					id="main-content"
					key={motionKey}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="flex min-h-0 flex-1 flex-col pt-16 outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-base"
					tabIndex={-1}
				>
					<Outlet />
				</motion.main>
			</AnimatePresence>
			{!(hideFooterForTradeGPT || hideFooterForDashboard) && <Footer />}
		</div>
	);
};
