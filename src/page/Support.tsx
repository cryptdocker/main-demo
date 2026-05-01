import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	IoBookOutline,
	IoMailOutline,
	IoChevronForward,
	IoDownloadOutline,
} from "react-icons/io5";
import { PageHeader } from "../layout/PageHeader";
import { PATH } from "../const";
import { SEO } from "../component/SEO";
import { detectOS } from "../utils/detectOS";

const DOWNLOAD_URL_WINDOWS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.exe";
const DOWNLOAD_URL_MACOS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.dmg";
const DOWNLOAD_URL_LINUX =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker-1.0.0.AppImage";

const supportOptions = [
	{
		icon: <IoBookOutline className="w-6 h-6" />,
		title: "Documentation",
		description:
			"Browse guides, tutorials, and API references for everything CryptDocker.",
		linkText: "View Docs",
		href: PATH.DOCUMENTATION,
		internal: true,
	},
	{
		icon: <IoMailOutline className="w-6 h-6" />,
		title: "Email Support",
		description:
			"Send us an email and we'll get back to you within 24 hours.",
		linkText: "contact@cryptdocker.com",
		href: "mailto:contact@cryptdocker.com",
	},
];

const faqs = [
	{
		q: "How do I add a custom app?",
		a: 'Click the "+" button in the sidebar, select "Custom App", enter the URL and name, and it\'ll appear in your workspace.',
	},
	{
		q: "Can I use multiple accounts on the same service?",
		a: "Yes. Each workspace runs in an isolated session, so you can log into the same service with different accounts in different workspaces.",
	},
	{
		q: "How do per-site proxies work?",
		a: "Open the app settings for any site, go to the Proxy tab, and configure an HTTP or SOCKS5 proxy. Each app can have its own proxy.",
	},
	{
		q: "What AI models does the chatbot use?",
		a: "Pro users get access to GPT-4o, GPT-4o-mini, GPT-4.1, and GPT-5 variants, plus web search capabilities.",
	},
	{
		q: "How do I cancel my Pro subscription?",
		a: "Go to Settings → Billing and click 'Cancel Plan'. You'll retain Pro access until the end of your billing period.",
	},
	{
		q: "Is my data encrypted?",
		a: "Yes. All sessions are isolated and encrypted. We never store your credentials or access your app data.",
	},
];

const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: faqs.map((faq) => ({
		"@type": "Question",
		name: faq.q,
		acceptedAnswer: { "@type": "Answer", text: faq.a },
	})),
};

export const Support: React.FC = () => {
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
		<>
			<SEO
				title="Support & FAQ"
				description="Get help with CryptDocker. Browse FAQs about custom apps, multiple accounts, per-site proxies, AI tools, subscriptions, and data encryption."
				path="/support"
				jsonLd={faqJsonLd}
			/>
			<PageHeader
				label="Support"
				title="How Can We Help?"
				description="Find answers, reach our team, or browse the documentation."
			/>

			<section className="py-20">
				<div className="max-w-4xl mx-auto px-6">
					<div className="grid md:grid-cols-2 gap-6 mb-20">
						{supportOptions.map((opt, i) => {
							const cardClass =
								"group p-6 rounded-2xl glass hover:bg-white/5 transition-all duration-300 text-center";
							const content = (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: i * 0.1 }}
								>
									<div className="w-12 h-12 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center mx-auto mb-4">
										{opt.icon}
									</div>
									<h3 className="font-semibold text-white mb-1">
										{opt.title}
									</h3>
									<p className="text-sm text-slate-500 mb-3">
										{opt.description}
									</p>
									<span className="text-sm font-medium text-teal-400">
										{opt.linkText}
									</span>
								</motion.div>
							);
							return opt.internal ? (
								<Link key={opt.title} to={opt.href} className={cardClass}>
									{content}
								</Link>
							) : (
								<a key={opt.title} href={opt.href} className={cardClass}>
									{content}
								</a>
							);
						})}
					</div>

					<h2 className="text-2xl font-bold text-white mb-8 text-center">
						Frequently Asked Questions
					</h2>
					<div className="max-w-2xl mx-auto space-y-4">
						{faqs.map((faq, i) => (
							<motion.details
								key={faq.q}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.05 }}
								className="group rounded-xl glass"
							>
								<summary className="flex items-center justify-between cursor-pointer p-5 text-white font-medium text-[15px]">
									{faq.q}
									<IoChevronForward className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform" />
								</summary>
								<div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
									{faq.a}
								</div>
							</motion.details>
						))}
					</div>

					<div className="mt-16 text-center">
						<p className="text-slate-500 mb-4">Still need help?</p>
						<Link
							to={PATH.CONTACT}
							className="inline-flex items-center px-6 py-3 bg-linear-to-r from-teal-600 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
						>
							Contact Us
						</Link>
					</div>
				</div>
			</section>

			<section className="pb-20">
				<div className="max-w-4xl mx-auto px-6">
					<div className="rounded-2xl bg-linear-to-br from-teal-600/15 via-teal-500/8 to-transparent border border-teal-500/20 p-10 text-center">
						<h3 className="text-2xl font-bold text-white mb-3">
							Try CryptDocker today
						</h3>
						<p className="text-slate-400 mb-8 max-w-lg mx-auto">
							One download, one workspace for all your crypto apps. Free to start.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<button
								onClick={downloadNow}
								disabled={!canDownload}
								className={`inline-flex items-center gap-2 px-7 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
									canDownload
										? "bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 cursor-pointer"
										: "bg-white/6 text-slate-500 cursor-not-allowed"
								}`}
							>
								<IoDownloadOutline className="w-5 h-5" />
								Download Now
							</button>
							<Link
								to={PATH.HOME}
								className="inline-flex items-center gap-1.5 px-6 py-3 text-sm font-medium text-slate-300 border border-white/12 rounded-xl hover:border-teal-500/50 hover:text-teal-300 transition-all duration-300"
							>
								Back to Homepage
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};
