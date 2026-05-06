import { motion } from "framer-motion";
import { IoCheckmarkCircleOutline, IoExtensionPuzzleOutline } from "react-icons/io5";
import { PageHeader } from "../layout/PageHeader";
import { Button } from "../component/Button";
import { SEO } from "../component/SEO";
import { IMG } from "../assets/image";

const CHROME_WEB_STORE_URL =
	"https://chromewebstore.google.com/detail/cpeblpceimlpngbfddfikhdlpcdmbhgl";

const highlights = [
	"Manifest V3 — Chromium extension available through Chrome Web Store today.",
	"Firefox extension is planned but not shipped yet.",
	"Brave builds are planned — Chromium-compatible when released.",
];

const browsers = [
	{
		id: "chrome" as const,
		logoSrc: IMG.Chrome,
		title: "Chrome",
		subtitle: "Install from Chrome Web Store (MV3).",
		available: true,
		disabledReason: "",
		iconBg: "bg-teal-500/20",
	},
	{
		id: "firefox" as const,
		logoSrc: IMG.Firefox,
		title: "Firefox",
		subtitle: "Extension build in progress.",
		available: false,
		disabledReason: "Firefox extension not available yet",
		iconBg: "bg-orange-500/15",
	},
	{
		id: "brave" as const,
		logoSrc: IMG.Brave,
		title: "Brave",
		subtitle: "Extension build in progress (Chromium).",
		available: false,
		disabledReason: "Brave browser extension not available yet",
		iconBg: "bg-orange-950/40",
	},
];

export const MentalShield: React.FC = () => {
	return (
		<>
			<SEO
				title="MentalShield Browser Extension"
				description="Install the MentalShield extension for Chrome — with Firefox and Brave coming soon."
				path="/mentalshield"
			/>
			<PageHeader
				label="MentalShield"
				title="Browser extension"
				description="Shield your browsing while you trade and research crypto. Chrome Web Store installs are live; Firefox and Brave are coming soon."
			/>

			<section className="py-16 pb-24">
				<div className="max-w-5xl mx-auto px-6">
					<div className="grid md:grid-cols-3 gap-6 mb-14">
						{browsers.map(
							({
								id,
								logoSrc,
								title,
								subtitle,
								available,
								iconBg,
								disabledReason,
							}) => (
								<motion.div
									key={id}
									id={id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.45 }}
									whileHover={
										available ? { y: -4, transition: { duration: 0.2 } } : undefined
									}
									className={`relative rounded-2xl p-8 flex flex-col text-center transition-all duration-500 ${
										available
											? "glass-strong glow-teal border-teal-500/30"
											: "glass opacity-90 border-white/6"
									}`}
								>
									{available && (
										<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-linear-to-r from-teal-600 to-teal-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-teal-500/30">
											Available now
										</div>
									)}
									<div
										className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 p-2.5 ${iconBg}`}
									>
										<img
											src={logoSrc}
											alt=""
											className="w-full h-full object-contain object-center pointer-events-none"
											loading="lazy"
											decoding="async"
											aria-hidden
										/>
									</div>
									<h2 className="text-xl font-bold text-white mb-1">{title}</h2>
									<p className="text-sm text-slate-500 mb-6 grow">{subtitle}</p>
									{id === "chrome" ? (
										<Button
											size="lg"
											className="w-full shrink-0"
											onClick={() =>
												window.open(CHROME_WEB_STORE_URL, "_blank", "noopener,noreferrer")
											}
										>
											<IoExtensionPuzzleOutline className="w-5 h-5" aria-hidden />
											Chrome Web Store
										</Button>
									) : (
										<Button
											disabled
											variant="outline"
											size="lg"
											className="w-full shrink-0"
											title={disabledReason}
											type="button"
										>
											Coming soon
										</Button>
									)}
								</motion.div>
							),
						)}
					</div>

					<ul className="max-w-xl mx-auto space-y-3">
						{highlights.map((text) => (
							<li key={text} className="flex gap-3 text-sm text-slate-400">
								<IoCheckmarkCircleOutline
									className="w-5 h-5 text-teal-400 shrink-0 mt-0.5"
									aria-hidden
								/>
								{text}
							</li>
						))}
					</ul>
				</div>
			</section>
		</>
	);
};
