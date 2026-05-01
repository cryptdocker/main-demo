import {
	IoDownloadOutline,
	IoLockClosedOutline,
	IoServerOutline,
	IoEyeOffOutline,
	IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../component/Button";
import { PATH } from "../const";
import { detectOS } from "../utils/detectOS";

const MotionLink = motion(Link);

const HERO_ROTATING_LABELS = [
	"Built-in AI tools & Chrome extensions",
	"Per-site proxies & session isolation",
	"One secure desktop for exchanges, DeFi & research",
] as const;

const DOWNLOAD_URL_WINDOWS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.exe";
const DOWNLOAD_URL_MACOS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.dmg";
const DOWNLOAD_URL_LINUX =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker-1.0.0.AppImage";

const SLIDES = [
	"https://i.ibb.co/kVhzV5cy/slide-1.png",
	"https://i.ibb.co/yc9wHjqx/slide-2.png",
	"https://i.ibb.co/nMzTKDL2/slide-3.png",
	"https://i.ibb.co/jPJkmFwb/slide-4.png",
];

const FADE_MS = 300;
const INTERVAL_MS = 5000;
const SLIDE_INTERVAL_MS = 4000;

export const Hero: React.FC = () => {
	const [labelIndex, setLabelIndex] = useState(0);
	const [visible, setVisible] = useState(true);
	const [slideIndex, setSlideIndex] = useState(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const clientOS = useMemo(() => detectOS(), []);
	const isWindows = clientOS === "Windows";
	const isMacOS = clientOS === "macOS";
	const isLinux = clientOS === "Linux";
	const canDownload = isWindows || isMacOS || isLinux;

	const cycle = useCallback(() => {
		setVisible(false);
		timeoutRef.current = setTimeout(() => {
			setLabelIndex((prev) => (prev + 1) % HERO_ROTATING_LABELS.length);
			setVisible(true);
		}, FADE_MS);
	}, []);

	useEffect(() => {
		const id = window.setInterval(cycle, INTERVAL_MS);
		return () => {
			window.clearInterval(id);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [cycle]);

	useEffect(() => {
		const id = window.setInterval(
			() => setSlideIndex((prev) => (prev + 1) % SLIDES.length),
			SLIDE_INTERVAL_MS,
		);
		return () => window.clearInterval(id);
	}, []);

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
			<div className="absolute inset-0 mesh-gradient" />

			<div className="absolute top-20 right-[10%] w-80 h-80 bg-teal-500/8 rounded-full blur-3xl animate-float" />
			<div className="absolute bottom-32 left-[5%] w-96 h-96 bg-cyan-500/6 rounded-full blur-3xl animate-float-slow" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/3 rounded-full blur-3xl" />
			<div className="absolute top-40 left-[20%] w-48 h-48 bg-amber-500/5 rounded-full blur-3xl animate-float" />

			<div className="relative z-10 max-w-8xl mx-auto px-6 text-center pt-24 pb-16 w-full">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 glass"
				>
					<span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse motion-reduce:animate-none" />
					<span
						aria-live="polite"
						className="transition-opacity duration-300 text-slate-300"
						style={{ opacity: visible ? 1 : 0 }}
					>
						{HERO_ROTATING_LABELS[labelIndex]}
					</span>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.2 }}
					className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.1] sm:leading-tight mb-6 tracking-tight px-1 sm:px-0">
					A Dedicated, Secure
					<br />
					<span className="text-gradient animate-shimmer">
						Desktop Environment
					</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
					An installed desktop app that gives you a dedicated, secure
					environment for your crypto workflow — run exchanges, DeFi, and tools
					side-by-side with built-in AI tools, Chrome extensions, and per-site
					proxies.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.55 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
					<div className="flex flex-col items-center gap-1">
						<Button
							size="lg"
							disabled={!canDownload}
							onClick={() => {
								if (isWindows)
									window.open(
										DOWNLOAD_URL_WINDOWS,
										"_blank",
										"noopener,noreferrer",
									);
								else if (isMacOS)
									window.open(
										DOWNLOAD_URL_MACOS,
										"_blank",
										"noopener,noreferrer",
									);
								else if (isLinux)
									window.open(
										DOWNLOAD_URL_LINUX,
										"_blank",
										"noopener,noreferrer",
									);
							}}>
							<IoDownloadOutline className="w-5 h-5 mr-2" />
							Download for {clientOS}
						</Button>
						{!canDownload && (
							<span className="text-xs text-slate-500 text-center max-w-xs">
								Desktop installers are available for Windows, macOS, and Linux only.
							</span>
						)}
					</div>
					<MotionLink
						to={PATH.DOCUMENTATION}
						className="inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 cursor-pointer border border-white/12 text-slate-300 hover:border-teal-500/50 hover:text-teal-300 hover:bg-white/3 px-8 py-3 text-base"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						Learn More
					</MotionLink>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.7 }}
					className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-16"
				>
					{[
						{ icon: <IoLockClosedOutline className="w-4 h-4" />, label: "AES-256 Encrypted" },
						{ icon: <IoServerOutline className="w-4 h-4" />, label: "Local Storage Only" },
						{ icon: <IoEyeOffOutline className="w-4 h-4" />, label: "No API Logs" },
						{ icon: <IoShieldCheckmarkOutline className="w-4 h-4" />, label: "Zero Access to Keys" },
					].map((badge) => (
						<span
							key={badge.label}
							className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400"
						>
							<span className="text-emerald-400">{badge.icon}</span>
							{badge.label}
						</span>
					))}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 40, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.8, delay: 0.85, ease: "easeOut" }}
					className="relative w-full max-w-8xl mx-auto">
					<div className="w-full relative rounded-2xl glass-strong overflow-hidden glow-teal aspect-video">
						<AnimatePresence mode="wait">
							<motion.img
								key={slideIndex}
								src={SLIDES[slideIndex]}
								alt={`CryptDocker screenshot ${slideIndex + 1}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								className="absolute inset-0 w-full h-full object-cover"
							/>
						</AnimatePresence>

						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
							{SLIDES.map((_, i) => (
								<button
									key={i}
									type="button"
									aria-label={`Go to slide ${i + 1}`}
									className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
										i === slideIndex
											? "bg-teal-400 w-6"
											: "bg-white/30 hover:bg-white/50"
									}`}
									onClick={() => setSlideIndex(i)}
								/>
							))}
						</div>
					</div>

					<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-teal-500/10 blur-3xl rounded-full" />
				</motion.div>
			</div>
		</section>
	);
};
