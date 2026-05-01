import { IoDownloadOutline } from "react-icons/io5";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../component/Button";
import { PATH } from "../const";
import { detectOS } from "../utils/detectOS";

const DOWNLOAD_URL_WINDOWS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.exe";
const DOWNLOAD_URL_MACOS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.dmg";
const DOWNLOAD_URL_LINUX =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker-1.0.0.AppImage";

export const CTA: React.FC = () => {
	const clientOS = useMemo(() => detectOS(), []);
	const isWindows = clientOS === "Windows";
	const isMacOS = clientOS === "macOS";
	const isLinux = clientOS === "Linux";
	const canDownload = isWindows || isMacOS || isLinux;

	return (
		<section className="py-24">
			<div className="max-w-8xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-50px" }}
					transition={{ duration: 0.6 }}
					className="relative rounded-3xl overflow-hidden"
				>
					<div className="absolute inset-0 bg-linear-to-br from-teal-600/90 via-teal-700/90 to-teal-900/90" />
					<div className="absolute inset-0 mesh-gradient opacity-30" />

					<div className="absolute inset-0 opacity-10">
						<div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
						<div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
					</div>

					<div className="relative z-10 p-12 md:p-16 text-center">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Ready to Streamline Your Crypto Workflow?
						</h2>
						<p className="text-teal-200/80 text-lg max-w-xl mx-auto mb-8">
							Join crypto teams and power users who run their workflow inside a
							dedicated, secure desktop environment.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<div className="flex flex-col items-center gap-1">
								<Button
									variant="white"
									size="lg"
									disabled={!canDownload}
									onClick={() => {
										if (isWindows)
											window.open(DOWNLOAD_URL_WINDOWS, "_blank", "noopener,noreferrer");
										else if (isMacOS)
											window.open(DOWNLOAD_URL_MACOS, "_blank", "noopener,noreferrer");
										else if (isLinux)
											window.open(DOWNLOAD_URL_LINUX, "_blank", "noopener,noreferrer");
									}}
								>
									<IoDownloadOutline className="w-5 h-5 mr-2" />
									Download for {clientOS}
								</Button>
								{!canDownload && (
									<span className="text-xs text-teal-300/60">
										Coming soon for Linux
									</span>
								)}
							</div>
							<Link to={PATH.DOCUMENTATION}>
								<Button variant="ghost" size="lg">
									View Documentation
								</Button>
							</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
