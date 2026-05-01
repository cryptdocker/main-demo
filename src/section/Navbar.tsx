import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	IoMenu,
	IoClose,
	IoChevronDown,
	IoExtensionPuzzleOutline,
	IoWalletOutline,
	IoGlobeOutline,
	IoNewspaperOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../component/Button";
import { IMG } from "../assets/image";
import { PATH } from "../const";
import { detectOS } from "../utils/detectOS";
import { IoIosDesktop } from "react-icons/io";
import { RiRobot2Line } from "react-icons/ri";
import { useAuth } from "../auth/useAuth";

const DOWNLOAD_URL_WINDOWS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.exe";
const DOWNLOAD_URL_MACOS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.dmg";
const DOWNLOAD_URL_LINUX =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker-1.0.0.AppImage";

/** MentalShield (MV3) on Chrome Web Store */
const MENTALSHIELD_CHROME_STORE_URL =
	"https://chromewebstore.google.com/detail/cpeblpceimlpngbfddfikhdlpcdmbhgl";

const navLinks = [
	{ label: "Features", to: `${PATH.HOME}#features` },
	{ label: "AI Tools", to: `${PATH.HOME}#ai` },
	{ label: "Pricing", to: `${PATH.HOME}#pricing` },
];

const resourceLinks = [
	{ label: "About", to: PATH.ABOUT },
	{ label: "Blog", to: PATH.BLOG },
	{ label: "Support / FAQ", to: PATH.SUPPORT },
	{ label: "Docs", to: PATH.DOCUMENTATION },
];

export const Navbar: React.FC = () => {
	const { user, signOut } = useAuth();
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [resourcesOpen, setResourcesOpen] = useState(false);
	const [productsOpen, setProductsOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
	const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
	const location = useLocation();
	const clientOS = useMemo(() => detectOS(), []);
	const isWindows = clientOS === "Windows";
	const isMacOS = clientOS === "macOS";
	const isLinux = clientOS === "Linux";
	const canDownload = isWindows || isMacOS || isLinux;
	const resourcesRef = useRef<HTMLDivElement | null>(null);
	const productsRef = useRef<HTMLDivElement | null>(null);
	const profileRef = useRef<HTMLDivElement | null>(null);

	const downloadNow = () => {
		if (isWindows) {
			window.open(DOWNLOAD_URL_WINDOWS, "_blank", "noopener,noreferrer");
		} else if (isMacOS) {
			window.open(DOWNLOAD_URL_MACOS, "_blank", "noopener,noreferrer");
		} else if (isLinux) {
			window.open(DOWNLOAD_URL_LINUX, "_blank", "noopener,noreferrer");
		}
	};

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		if (!mobileOpen) return;
		document.body.style.overflow = "hidden";
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setMobileOpen(false);
				setMobileProductsOpen(false);
				setMobileResourcesOpen(false);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [mobileOpen]);

	const isHash = (to: string) => to.includes("#");

	useEffect(() => {
		const t = window.setTimeout(() => {
			setResourcesOpen(false);
			setProductsOpen(false);
			setProfileOpen(false);
			setMobileOpen(false);
			setMobileResourcesOpen(false);
			setMobileProductsOpen(false);
		}, 0);
		return () => clearTimeout(t);
	}, [location.pathname]);

	useEffect(() => {
		if (!resourcesOpen) return;
		const onPointerDown = (e: MouseEvent | TouchEvent) => {
			if (!resourcesRef.current) return;
			if (!resourcesRef.current.contains(e.target as Node))
				setResourcesOpen(false);
		};
		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("touchstart", onPointerDown);
		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("touchstart", onPointerDown);
		};
	}, [resourcesOpen]);

	useEffect(() => {
		if (!productsOpen) return;
		const onPointerDown = (e: MouseEvent | TouchEvent) => {
			if (!productsRef.current) return;
			if (!productsRef.current.contains(e.target as Node))
				setProductsOpen(false);
		};
		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("touchstart", onPointerDown);
		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("touchstart", onPointerDown);
		};
	}, [productsOpen]);

	useEffect(() => {
		if (!profileOpen) return;
		const onPointerDown = (e: MouseEvent | TouchEvent) => {
			if (!profileRef.current) return;
			if (!profileRef.current.contains(e.target as Node)) setProfileOpen(false);
		};
		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("touchstart", onPointerDown);
		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("touchstart", onPointerDown);
		};
	}, [profileOpen]);

	return (
		<motion.nav
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
				scrolled
					? "bg-dark-base/80 backdrop-blur-xl shadow-2xl shadow-black/20"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
				<Link
					to={PATH.HOME}
					className="flex items-center gap-2.5 group"
					onClick={() => {
						if (location.pathname === PATH.HOME) {
							window.scrollTo({ top: 0, behavior: "smooth" });
						}
					}}
				>
					<div className="w-8 h-8 rounded-lg bg-linear-to-br from-teal-600 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow duration-300">
						<img src={IMG.Logo} className="w-6" />
					</div>
					<span className="text-xl font-bold text-white">CryptDocker</span>
				</Link>

				<div className="hidden md:flex items-center gap-8">
					{navLinks.map((link) =>
						isHash(link.to) ? (
							<a
								key={link.to}
								href={link.to}
								className="text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200"
							>
								{link.label}
							</a>
						) : (
							<Link
								key={link.to}
								to={link.to}
								className={`text-sm transition-colors duration-200 ${
									location.pathname === link.to
										? "text-teal-400 font-medium"
										: "text-slate-400 hover:text-teal-400"
								}`}
							>
								{link.label}
							</Link>
						),
					)}

					<div className="relative" ref={productsRef}>
						<button
							type="button"
							className={`inline-flex items-center gap-1 text-sm transition-colors duration-200 cursor-pointer ${
								productsOpen
									? "text-teal-400 font-medium"
									: "text-slate-400 hover:text-teal-400"
							}`}
							aria-haspopup="menu"
							aria-expanded={productsOpen}
							onClick={() => setProductsOpen((v) => !v)}
						>
							Products
							<IoChevronDown
								className={`w-4 h-4 transition-transform duration-200 ${
									productsOpen ? "rotate-180" : ""
								}`}
							/>
						</button>

						<AnimatePresence>
							{productsOpen && (
								<motion.div
									initial={{ opacity: 0, y: 8, scale: 0.96 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 8, scale: 0.96 }}
									transition={{ duration: 0.15 }}
									role="menu"
									aria-label="Products"
									className="absolute top-full mt-3 right-0 w-72 rounded-xl bg-dark-surface border border-white/8 shadow-xl shadow-black/40 overflow-hidden"
								>
									<div className="py-2">
										<p className="px-4 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
											Apps
										</p>
										<Link
											to={PATH.DOWNLOAD}
											role="menuitem"
											className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-200 text-slate-300 hover:bg-white/5 hover:text-teal-400"
											onClick={() => setProductsOpen(false)}
										>
											<IoIosDesktop className="w-4 h-4 text-teal-400" />
											CryptDocker
										</Link>
										<button
											type="button"
											role="menuitem"
											className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left text-sm transition-colors duration-200 text-slate-300 hover:bg-white/5 hover:text-teal-400 cursor-pointer"
											onClick={() => {
												setProductsOpen(false);
												window.open(
													"https://trade.cryptdocker.com",
													"_blank",
													"noopener,noreferrer",
												);
											}}
										>
											<RiRobot2Line className="w-4 h-4 text-teal-400" />
											TradeGPT
										</button>
										{user ? (
											<Link
												to={PATH.DASHBOARD}
												role="menuitem"
												className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-200 ${
													location.pathname === PATH.DASHBOARD
														? "text-teal-400 bg-teal-500/10 font-medium"
														: "text-slate-300 hover:bg-white/5 hover:text-teal-400"
												}`}
												onClick={() => setProductsOpen(false)}
											>
												<IoExtensionPuzzleOutline className="w-4 h-4 text-teal-400" />
												MentalShield
											</Link>
										) : (
											<button
												type="button"
												role="menuitem"
												className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left text-sm transition-colors duration-200 text-slate-300 hover:bg-white/5 hover:text-teal-400 cursor-pointer"
												onClick={() => {
													setProductsOpen(false);
													window.open(
														MENTALSHIELD_CHROME_STORE_URL,
														"_blank",
														"noopener,noreferrer",
													);
												}}
											>
												<IoExtensionPuzzleOutline className="w-4 h-4 text-teal-400" />
												MentalShield
												<span className="ml-auto uppercase tracking-wider text-slate-500">
													<img src={IMG.Store} className="w-4 h-4" />
												</span>
											</button>
										)}
										<div className="my-2 h-px bg-white/6" />
										<p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
											Analysis Tools
										</p>
										<Link
											to={PATH.WALLET_ANALYSIS}
											role="menuitem"
											className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-200 ${
												location.pathname === PATH.WALLET_ANALYSIS
													? "text-teal-400 bg-teal-500/10 font-medium"
													: "text-slate-300 hover:bg-white/5 hover:text-teal-400"
											}`}
											onClick={() => setProductsOpen(false)}
										>
											<IoWalletOutline className="w-4 h-4 text-teal-400" />
											Wallet Analysis
										</Link>
										<Link
											to={PATH.SITE_ANALYSIS}
											role="menuitem"
											className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-200 ${
												location.pathname === PATH.SITE_ANALYSIS
													? "text-teal-400 bg-teal-500/10 font-medium"
													: "text-slate-300 hover:bg-white/5 hover:text-teal-400"
											}`}
											onClick={() => setProductsOpen(false)}
										>
											<IoGlobeOutline className="w-4 h-4 text-teal-400" />
											Site Analysis
										</Link>
										<Link
											to={PATH.NEWS_ANALYSIS}
											role="menuitem"
											className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-200 ${
												location.pathname === PATH.NEWS_ANALYSIS
													? "text-teal-400 bg-teal-500/10 font-medium"
													: "text-slate-300 hover:bg-white/5 hover:text-teal-400"
											}`}
											onClick={() => setProductsOpen(false)}
										>
											<IoNewspaperOutline className="w-4 h-4 text-teal-400" />
											News Analysis
										</Link>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					<div className="relative" ref={resourcesRef}>
						<button
							type="button"
							className={`inline-flex items-center gap-1 text-sm transition-colors duration-200 cursor-pointer ${
								resourcesOpen
									? "text-teal-400 font-medium"
									: "text-slate-400 hover:text-teal-400"
							}`}
							aria-haspopup="menu"
							aria-expanded={resourcesOpen}
							onClick={() => setResourcesOpen((v) => !v)}
						>
							Resources
							<IoChevronDown
								className={`w-4 h-4 transition-transform duration-200 ${
									resourcesOpen ? "rotate-180" : ""
								}`}
							/>
						</button>

						<AnimatePresence>
							{resourcesOpen && (
								<motion.div
									initial={{ opacity: 0, y: 8, scale: 0.96 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 8, scale: 0.96 }}
									transition={{ duration: 0.15 }}
									role="menu"
									aria-label="Resources"
									className="absolute top-full mt-3 right-0 w-52 rounded-xl bg-dark-surface border border-white/8 shadow-xl shadow-black/40 overflow-hidden"
								>
									<div className="py-2">
										{resourceLinks.map((link) => (
											<Link
												key={link.to}
												to={link.to}
												role="menuitem"
												className={`block px-4 py-2.5 text-sm transition-colors duration-200 ${
													location.pathname === link.to
														? "text-teal-400 bg-teal-500/10 font-medium"
														: "text-slate-300 hover:bg-white/5 hover:text-teal-400"
												}`}
												onClick={() => setResourcesOpen(false)}
											>
												{link.label}
											</Link>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				<div className="hidden md:flex items-center gap-3">
					{user ? (
						<div className="relative" ref={profileRef}>
							<button
								type="button"
								className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/8 transition-colors cursor-pointer overflow-hidden"
								aria-haspopup="menu"
								aria-expanded={profileOpen}
								onClick={() => setProfileOpen((v) => !v)}
								title={user.email}
							>
								{user.avatar ? (
									<img
										src={user.avatar}
										alt={user.fullName || user.email}
										className="w-full h-full object-cover"
										referrerPolicy="no-referrer"
									/>
								) : (
									<span className="text-sm font-semibold text-slate-200">
										{(user.fullName || user.email || "U")
											.trim()
											.slice(0, 1)
											.toUpperCase()}
									</span>
								)}
							</button>

							<AnimatePresence>
								{profileOpen && (
									<motion.div
										initial={{ opacity: 0, y: 8, scale: 0.98 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: 8, scale: 0.98 }}
										transition={{ duration: 0.15 }}
										role="menu"
										aria-label="Account menu"
										className="absolute top-full mt-3 right-0 w-56 rounded-xl bg-dark-surface border border-white/8 shadow-xl shadow-black/40 overflow-hidden"
									>
										<div className="px-4 py-3 border-b border-white/6">
											<p className="text-sm text-slate-200 font-medium truncate">
												{user.fullName || "Account"}
											</p>
											<p className="text-xs text-slate-500 truncate">{user.email}</p>
										</div>
										<div className="py-2">
											<Link
												to={PATH.DASHBOARD}
												role="menuitem"
												className="block px-4 py-2.5 text-sm transition-colors duration-200 text-slate-300 hover:bg-white/5 hover:text-teal-400"
												onClick={() => setProfileOpen(false)}
											>
												Dashboard
											</Link>
											<button
												type="button"
												role="menuitem"
												className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 text-slate-300 hover:bg-white/5 hover:text-teal-400 cursor-pointer"
												onClick={() => {
													setProfileOpen(false);
													signOut();
												}}
											>
												Log out
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					) : (
						<Link to={PATH.SIGN_IN}>
							<Button size="sm" variant="outline">
								Sign in
							</Button>
						</Link>
					)}
					<Button
						size="sm"
						disabled={!canDownload}
						title={!canDownload ? "Coming soon for your OS" : undefined}
						onClick={downloadNow}
					>
						Download
					</Button>
				</div>

				<button
					type="button"
					id="site-mobile-nav-toggle"
					className="md:hidden p-2 text-slate-400 cursor-pointer rounded-lg hover:bg-white/5 focus-visible:outline-none"
					aria-label={mobileOpen ? "Close menu" : "Open menu"}
					aria-expanded={mobileOpen}
					aria-controls="site-mobile-nav"
					onClick={() => setMobileOpen(!mobileOpen)}
				>
					{mobileOpen ? (
						<IoClose className="w-6 h-6" aria-hidden />
					) : (
						<IoMenu className="w-6 h-6" aria-hidden />
					)}
				</button>
			</div>

			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						id="site-mobile-nav"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="md:hidden bg-dark-surface/95 backdrop-blur-xl border-t border-white/6 px-6 py-4 space-y-3 overflow-y-auto max-h-[min(70vh,calc(100dvh-4rem))]"
					>
						{navLinks.map((link) =>
							isHash(link.to) ? (
								<a
									key={link.to}
									href={link.to}
									className="block text-sm text-slate-400 hover:text-teal-400 py-2"
									onClick={() => setMobileOpen(false)}
								>
									{link.label}
								</a>
							) : (
								<Link
									key={link.to}
									to={link.to}
									className="block text-sm text-slate-400 hover:text-teal-400 py-2"
								>
									{link.label}
								</Link>
							),
						)}

						<div className="pt-1">
							<button
								type="button"
								className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-teal-400 py-2 cursor-pointer"
								aria-expanded={mobileProductsOpen}
								onClick={() => setMobileProductsOpen((v) => !v)}
							>
								<span>Products</span>
								<IoChevronDown
									className={`w-4 h-4 transition-transform ${
										mobileProductsOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{mobileProductsOpen && (
								<div className="mt-1 pl-3 border-l border-white/8 space-y-1">
									<p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 pt-1">
										Apps
									</p>
									<Link
										to={PATH.DOWNLOAD}
										className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 py-2"
										onClick={() => setMobileOpen(false)}
									>
										<IoIosDesktop />
										CryptDocker
									</Link>
									<button
										type="button"
										className="flex items-center gap-2 w-full text-left text-sm text-slate-400 hover:text-teal-400 py-2 cursor-pointer"
										onClick={() => {
											window.open(
												"https://trade.cryptdocker.com",
												"_blank",
												"noopener,noreferrer",
											);
											setMobileOpen(false);
										}}
									>
										<RiRobot2Line />
										TradeGPT
									</button>
									{user ? (
										<Link
											to={PATH.DASHBOARD}
											className={`flex items-center gap-2 text-sm py-2 ${
												location.pathname === PATH.DASHBOARD
													? "text-teal-400 font-medium"
													: "text-slate-400 hover:text-teal-400"
											}`}
											onClick={() => setMobileOpen(false)}
										>
											<IoExtensionPuzzleOutline />
											MentalShield
										</Link>
									) : (
										<button
											type="button"
											className="flex items-center gap-2 w-full text-left text-sm text-slate-400 hover:text-teal-400 py-2 cursor-pointer"
											onClick={() => {
												window.open(
													MENTALSHIELD_CHROME_STORE_URL,
													"_blank",
													"noopener,noreferrer",
												);
												setMobileOpen(false);
											}}
										>
											<IoExtensionPuzzleOutline />
											MentalShield
											<span className="ml-auto text-[10px] uppercase tracking-wider text-slate-500">
												Chrome
											</span>
										</button>
									)}
									<p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 pt-3">
										Analysis Tools
									</p>
									<Link
										to={PATH.WALLET_ANALYSIS}
										className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 py-2"
										onClick={() => setMobileOpen(false)}
									>
										<IoWalletOutline />
										Wallet Analysis
									</Link>
									<Link
										to={PATH.SITE_ANALYSIS}
										className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 py-2"
										onClick={() => setMobileOpen(false)}
									>
										<IoGlobeOutline />
										Site Analysis
									</Link>
									<Link
										to={PATH.NEWS_ANALYSIS}
										className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 py-2"
										onClick={() => setMobileOpen(false)}
									>
										<IoNewspaperOutline />
										News Analysis
									</Link>
								</div>
							)}
						</div>

						<div className="pt-1">
							<button
								type="button"
								className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-teal-400 py-2 cursor-pointer"
								aria-expanded={mobileResourcesOpen}
								onClick={() => setMobileResourcesOpen((v) => !v)}
							>
								<span>Resources</span>
								<IoChevronDown
									className={`w-4 h-4 transition-transform ${
										mobileResourcesOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{mobileResourcesOpen && (
								<div className="mt-1 pl-3 border-l border-white/8 space-y-1">
									{resourceLinks.map((link) => (
										<Link
											key={link.to}
											to={link.to}
											className="block text-sm text-slate-400 hover:text-teal-400 py-2"
											onClick={() => setMobileOpen(false)}
										>
											{link.label}
										</Link>
									))}
								</div>
							)}
						</div>

						<div className="flex gap-3 pt-2">
							<Button
								size="sm"
								className="w-full"
								disabled={!canDownload}
								title={!canDownload ? "Coming soon for your OS" : undefined}
								onClick={() => {
									downloadNow();
									setMobileOpen(false);
								}}
							>
								Download
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.nav>
	);
};
