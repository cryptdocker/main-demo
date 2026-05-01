import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	IoGlobeOutline,
	IoSearchOutline,
	IoAlertCircleOutline,
	IoNewspaperOutline,
	IoTrendingUp,
	IoTrendingDown,
	IoPulse,
	IoOpenOutline,
} from "react-icons/io5";
import { PageHeader } from "../layout/PageHeader";
import { Button } from "../component/Button";
import { SEO } from "../component/SEO";
import { useAuth } from "../auth/useAuth";
import { SignInCtaModal } from "../component/SignInCtaModal";
import {
	analyzeSite,
	type SiteAnalysisResponse,
} from "../services/analysis.service";

function extractHost(input: string): string | null {
	const v = input.trim();
	if (!v) return null;
	try {
		const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
		const u = new URL(withScheme);
		const host = u.hostname.replace(/^www\./i, "");
		if (!host.includes(".")) return null;
		return host.toLowerCase();
	} catch {
		return null;
	}
}

function sentimentStyle(sentiment: string | undefined) {
	const s = (sentiment || "").toLowerCase();
	if (s === "bullish")
		return {
			label: "Bullish",
			icon: <IoTrendingUp className="w-4 h-4" />,
			wrap: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
		};
	if (s === "bearish")
		return {
			label: "Bearish",
			icon: <IoTrendingDown className="w-4 h-4" />,
			wrap: "border-red-500/40 bg-red-500/15 text-red-300",
		};
	return {
		label: "Neutral",
		icon: <IoPulse className="w-4 h-4" />,
		wrap: "border-white/12 bg-white/8 text-slate-300",
	};
}

export const SiteAnalysis: React.FC = () => {
	const { user, token } = useAuth();
	const authed = !!user && !!token;
	const [signInOpen, setSignInOpen] = useState(false);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<SiteAnalysisResponse | null>(null);

	useEffect(() => {
		if (!authed) setSignInOpen(true);
	}, [authed]);

	const host = extractHost(input);
	const valid = !!host;

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!authed) {
			setSignInOpen(true);
			return;
		}
		if (!valid || loading) return;
		setLoading(true);
		setError(null);
		setData(null);
		try {
			const res = await analyzeSite(input.trim());
			if (res.success) setData(res);
			else setError(res.error || "Analysis failed.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Request failed.");
		} finally {
			setLoading(false);
		}
	};

	const tone = sentimentStyle(data?.sentiment);

	return (
		<>
			<SignInCtaModal open={signInOpen} onClose={() => setSignInOpen(false)} />
			<SEO
				title="Site Analysis"
				description="Get AI-summarized news sentiment and headlines for any domain before you connect your wallet."
				path="/tools/site-analysis"
			/>
			<PageHeader
				label="Site Analysis"
				title="Check any site's news sentiment"
				description="Enter a URL to pull the latest news and get an AI-summarized sentiment read with headlines and sources."
			/>

			<section className="pb-24">
				<div className="max-w-3xl mx-auto px-6">
					<motion.form
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						onSubmit={onSubmit}
						className="glass rounded-2xl p-5 sm:p-6"
						aria-busy={loading}
					>
						<label className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
							<IoGlobeOutline className="w-4 h-4 text-teal-400" />
							Site URL or domain
						</label>
						<div className="flex flex-col sm:flex-row gap-3">
							<input
								type="text"
								autoComplete="off"
								spellCheck={false}
								placeholder="https://example.com"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-white/8 bg-white/4 text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-500/50 transition"
							/>
							<Button
								type="submit"
								size="lg"
								disabled={!valid || loading}
								title={!valid ? "Enter a valid URL or domain" : undefined}
								aria-busy={loading}
							>
								<IoSearchOutline className="w-5 h-5 mr-2 shrink-0" aria-hidden />
								{loading ? "Analyzing…" : "Analyze"}
							</Button>
						</div>
						<p className="mt-3 text-xs text-slate-500">
							Example: <span className="font-mono">binance.com</span>,{" "}
							<span className="font-mono">https://uniswap.org</span>
						</p>
					</motion.form>

					{error && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 flex gap-3"
						>
							<IoAlertCircleOutline className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
							<div className="min-w-0">
								<p className="text-sm font-medium text-red-200">Analysis failed</p>
								<p className="text-sm text-red-300/80 mt-1 wrap-break-word">{error}</p>
							</div>
						</motion.div>
					)}

					{loading && !data && !error && (
						<div className="mt-6 space-y-3">
							<div className="h-32 rounded-2xl bg-white/4 border border-white/6 animate-pulse" />
							<div className="h-24 rounded-2xl bg-white/4 border border-white/6 animate-pulse" />
							<div className="h-24 rounded-2xl bg-white/4 border border-white/6 animate-pulse" />
						</div>
					)}

					{data && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.45 }}
							className="mt-6 space-y-4"
						>
							<div className="rounded-2xl border border-white/8 bg-white/4 p-5">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<p className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
										<IoNewspaperOutline className="w-4 h-4 text-teal-400" />
										Site News Analysis: {data.domain}
									</p>
									<span
										className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${tone.wrap}`}
									>
										{tone.icon}
										{tone.label}
									</span>
								</div>
								{data.summary && (
									<p className="mt-3 text-slate-200 leading-relaxed">
										{data.summary}
									</p>
								)}
								{data.takeaway && (
									<p className="mt-3 text-sm text-slate-400 italic border-l-2 border-teal-500/40 pl-3">
										Trader takeaway: {data.takeaway}
									</p>
								)}
							</div>

							{data.items && data.items.length > 0 && (
								<div className="rounded-2xl border border-white/8 bg-white/4 p-5">
									<p className="text-xs uppercase tracking-wider text-slate-400 mb-3">
										Headlines ({data.items.length})
									</p>
									<ul className="space-y-3">
										{data.items.slice(0, 15).map((item, i) => (
											<li
												key={i}
												className="flex gap-3 rounded-xl p-2 -mx-2 hover:bg-white/4 transition"
											>
												{item.thumbnail ? (
													<img
														src={item.thumbnail}
														alt=""
														loading="lazy"
														className="w-16 h-16 rounded-lg object-cover shrink-0 bg-white/4"
													/>
												) : (
													<div className="w-16 h-16 rounded-lg shrink-0 bg-white/4 border border-white/6 flex items-center justify-center">
														<IoNewspaperOutline className="w-6 h-6 text-slate-600" />
													</div>
												)}
												<div className="min-w-0 flex-1">
													<a
														href={item.link}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm font-medium text-slate-100 hover:text-teal-300 transition-colors line-clamp-2 inline-flex items-start gap-1"
													>
														{item.title}
														<IoOpenOutline className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-60" />
													</a>
													{item.snippet && (
														<p className="mt-1 text-xs text-slate-400 line-clamp-2">
															{item.snippet}
														</p>
													)}
													<div className="mt-1 text-[11px] text-slate-500 flex items-center gap-2">
														{item.source && <span>{item.source}</span>}
														{item.source && item.date && <span>•</span>}
														{item.date && <span>{item.date}</span>}
													</div>
												</div>
											</li>
										))}
									</ul>
								</div>
							)}

							{data.items && data.items.length === 0 && (
								<div className="rounded-2xl border border-white/8 bg-white/4 p-5 text-sm text-slate-400">
									No recent headlines found for this site.
								</div>
							)}
						</motion.div>
					)}
				</div>
			</section>
		</>
	);
};
