import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "../section/Navbar";
import { Footer } from "../section/Footer";
import { ScrollToHash } from "../component/ScrollToHash";
import { TradeGPTBadge } from "../component/TradeGPTBadge";

export const PageLayout: React.FC = () => {
	const location = useLocation();

	return (
		<div className="w-full relative overflow-x-hidden bg-dark-base min-h-screen">
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
					key={location.pathname}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="pt-16 outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-base"
					tabIndex={-1}
				>
					<Outlet />
				</motion.main>
			</AnimatePresence>
			<Footer />
		</div>
	);
};
