import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { FaLinkedin, FaTelegram } from "react-icons/fa";
import { FaMedium } from "react-icons/fa6";
import { IoDownloadOutline } from "react-icons/io5";
import { IMG } from "../assets/image";
import { PATH } from "../const";
import { detectOS } from "../utils/detectOS";

const DOWNLOAD_URL_WINDOWS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.exe";
const DOWNLOAD_URL_MACOS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.dmg";
const DOWNLOAD_URL_LINUX =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker-1.0.0.AppImage";

const footerLinks = [
	{
		title: "Product",
		links: [
			{ label: "Features", to: `${PATH.HOME}#features` },
			{ label: "Pricing", to: `${PATH.HOME}#pricing` },
			{ label: "Download", to: PATH.DOWNLOAD },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About", to: PATH.ABOUT },
			{ label: "Blog", to: PATH.BLOG },
			{ label: "Careers", to: PATH.CAREERS },
			{ label: "Contact", to: PATH.CONTACT },
		],
	},
	{
		title: "Resources",
		links: [
			{ label: "Documentation", to: PATH.DOCUMENTATION },
			{ label: "Support", to: PATH.SUPPORT },
			{ label: "Privacy Policy", to: PATH.PRIVACY },
			{ label: "Terms of Service", to: PATH.TERMS },
		],
	},
];

export const Footer: React.FC = () => {
	const location = useLocation();
	const isHash = (to: string) => to.includes("#");
	const clientOS = useMemo(() => detectOS(), []);
	const isWindows = clientOS === "Windows";
	const isMacOS = clientOS === "macOS";
	const isLinux = clientOS === "Linux";
	const canDownload = isWindows || isMacOS || isLinux;

	const downloadNow = () => {
		if (isWindows) window.open(DOWNLOAD_URL_WINDOWS, "_blank", "noopener,noreferrer");
		else if (isMacOS) window.open(DOWNLOAD_URL_MACOS, "_blank", "noopener,noreferrer");
		else if (isLinux) window.open(DOWNLOAD_URL_LINUX, "_blank", "noopener,noreferrer");
	};

	return (
		<footer className="border-t border-white/6">
			{/* CTA banner */}
			<div className="relative overflow-hidden bg-linear-to-r from-teal-600/10 via-teal-500/5 to-transparent border-b border-white/6">
				<div className="max-w-8xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
					<div>
						<h3 className="text-lg font-semibold text-white mb-1">
							Ready to streamline your crypto workflow?
						</h3>
						<p className="text-sm text-slate-400">
							Download CryptDocker free and organize everything in one secure desktop hub.
						</p>
					</div>
					<div className="flex items-center gap-3 shrink-0">
						<button
							type="button"
							onClick={downloadNow}
							disabled={!canDownload}
							title={!canDownload ? "Desktop installers available for Windows, macOS, and Linux" : undefined}
							className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
								canDownload
									? "bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 cursor-pointer"
									: "bg-white/6 text-slate-500 cursor-not-allowed"
							}`}
						>
							<IoDownloadOutline className="w-4 h-4" />
							Download Now
						</button>
						<Link
							to={PATH.DOCUMENTATION}
							className="px-5 py-2.5 text-sm font-medium text-slate-300 border border-white/12 rounded-xl hover:border-teal-500/50 hover:text-teal-300 transition-all duration-300"
						>
							Learn More
						</Link>
					</div>
				</div>
			</div>

			<div className="max-w-8xl mx-auto px-6 py-16">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					<div className="col-span-2 md:col-span-1">
						<Link
							to={PATH.HOME}
							className="flex items-center gap-2.5 mb-4 group"
							onClick={() => {
								if (location.pathname === PATH.HOME) {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}
							}}
						>
							<div className="w-8 h-8 rounded-lg bg-linear-to-br from-teal-600 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow duration-300">
								<img src={IMG.Logo} className="w-6" />
							</div>
							<span className="text-lg font-bold text-white">
								CryptDocker
							</span>
						</Link>
						<p className="text-sm text-slate-500 leading-relaxed">
							A dedicated, secure desktop environment for your crypto workflow.
						</p>
					</div>

					{footerLinks.map((group) => (
						<div key={group.title}>
							<h4 className="text-sm font-semibold text-white mb-4">
								{group.title}
							</h4>
							<ul className="space-y-3">
								{group.links.map((link) => (
									<li key={link.label}>
										{isHash(link.to) ? (
											<a
												href={link.to}
												className="text-sm text-slate-500 hover:text-teal-400 transition-colors duration-200"
											>
												{link.label}
											</a>
										) : (
											<Link
												to={link.to}
												className="text-sm text-slate-500 hover:text-teal-400 transition-colors duration-200"
											>
												{link.label}
											</Link>
										)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-12 pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-sm text-slate-500">
						&copy; {new Date().getFullYear()} CryptDocker. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<a
							href="https://linkedin.com/company/cryptdocker"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn"
							className="text-slate-500 hover:text-teal-400 transition-colors duration-200"
						>
							<FaLinkedin className="w-5 h-5" />
						</a>
						<a
							href="https://medium.com/@cryptdocker"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Medium"
							className="text-slate-500 hover:text-teal-400 transition-colors duration-200"
						>
							<FaMedium className="w-5 h-5" />
						</a>
						<a
							href="https://t.me/cryptdocker"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Telegram"
							className="text-slate-500 hover:text-teal-400 transition-colors duration-200"
						>
							<FaTelegram className="w-5 h-5" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};
