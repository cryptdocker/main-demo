import { useState, useEffect, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import {
	IoNewspaperOutline,
	IoPricetagOutline,
	IoSearchOutline,
	IoAlertCircleOutline,
	IoClose,
	IoTrendingUp,
	IoTrendingDown,
	IoPulse,
	IoOpenOutline,
	IoBookmarkOutline,
	IoTrashOutline,
} from "react-icons/io5";
import { PageHeader } from "../layout/PageHeader";
import { Button } from "../component/Button";
import { SEO } from "../component/SEO";
import { useAuth } from "../auth/useAuth";
import { SignInCtaModal } from "../component/SignInCtaModal";
import {
	analyzeNews,
	type NewsAnalysisResponse,
} from "../services/analysis.service";

const SUGGESTIONS = [
	"Bitcoin",
	"Ethereum",
	"Solana",
	"DeFi",
	"Stablecoins",
	"Layer 2",
	"NFTs",
	"Airdrops",
];
const MAX_KEYWORDS = 8;
const STORAGE_KEY_CUSTOM_KEYWORDS = "cryptdocker_news_analysis_custom_keywords";
const MAX_SAVED_CUSTOM = 30;
const MAX_KEYWORD_LEN = 80;

function readSavedCustomKeywords(): string[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_KEYWORDS);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];
		return Array.from(
			new Set(
				parsed
					.map((x) => (typeof x === "string" ? x.trim() : ""))
					.filter(Boolean)
					.map((s) => s.slice(0, MAX_KEYWORD_LEN)),
			),
		).slice(0, MAX_SAVED_CUSTOM);
	} catch {
		return [];
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

export const NewsAnalysis: React.FC = () => {
	const { user, token } = useAuth();
	const authed = !!user && !!token;
	const [signInOpen, setSignInOpen] = useState(false);
	const [keywords, setKeywords] = useState<string[]>([]);
	const [draft, setDraft] = useState("");
	const [savedCustomKeywords, setSavedCustomKeywords] = useState<string[]>(
		readSavedCustomKeywords,
	);
	const [customSaveDraft, setCustomSaveDraft] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<NewsAnalysisResponse | null>(null);

	useEffect(() => {
		try {
			localStorage.setItem(
				STORAGE_KEY_CUSTOM_KEYWORDS,
				JSON.stringify(savedCustomKeywords),
			);
		} catch {
			// ignore quota / private mode
		}
	}, [savedCustomKeywords]);

	useEffect(() => {
		if (!authed) setSignInOpen(true);
	}, [authed]);

	const addKeyword = (raw: string) => {
		const v = raw.trim().replace(/^#/, "");
		if (!v) return;
		if (keywords.length >= MAX_KEYWORDS) return;
		if (keywords.some((k) => k.toLowerCase() === v.toLowerCase())) return;
		setKeywords((prev) => [...prev, v]);
		setDraft("");
	};

	const removeKeyword = (k: string) => {
		setKeywords((prev) => prev.filter((x) => x !== k));
	};

	const saveCustomKeywordsToLibrary = () => {
		const raw = customSaveDraft.trim();
		if (!raw) return;
		const parts = raw
			.split(/[,#]/)
			.map((s) => s.trim())
			.filter(Boolean)
			.map((s) => s.slice(0, MAX_KEYWORD_LEN));

		setSavedCustomKeywords((prev) => {
			const next = [...prev];
			for (const p of parts) {
				if (next.length >= MAX_SAVED_CUSTOM) break;
				if (next.some((k) => k.toLowerCase() === p.toLowerCase())) continue;
				next.push(p);
			}
			return next;
		});
		setCustomSaveDraft("");
	};

	const removeSavedCustom = (k: string) => {
		setSavedCustomKeywords((prev) => prev.filter((x) => x !== k));
	};

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addKeyword(draft);
		} else if (e.key === "Backspace" && !draft && keywords.length > 0) {
			setKeywords((prev) => prev.slice(0, -1));
		}
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!authed) {
			setSignInOpen(true);
			return;
		}
		if (loading) return;

		const finalKeywords =
			draft.trim()
				? [...keywords, ...draft.split(",").map((s) => s.trim()).filter(Boolean)]
				: [...keywords];

		setKeywords(finalKeywords);
		setDraft("");
		setLoading(true);
		setError(null);
		setData(null);

		try {
			const res = await analyzeNews(finalKeywords);
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
				title="News Analysis"
				description="Track the crypto news flow on your watchlist. Enter keywords and get an AI-summarized sentiment read with headlines and sources."
				path="/tools/news-analysis"
			/>
			<PageHeader
				label="News Analysis"
				title="Sentiment on the topics you care about"
				description="Type a few keywords (tokens, narratives, projects). We aggregate the latest headlines and distill them into a clear bullish / bearish / neutral signal."
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
							<IoPricetagOutline className="w-4 h-4 text-teal-400" />
							Interested keywords
						</label>

						<div className="flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-xl border border-white/8 bg-white/4 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/30 transition">
							{keywords.map((k) => (
								<span
									key={k}
									className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-teal-500/40 bg-teal-500/15 text-teal-300 text-xs font-medium"
								>
									{k}
									<button
										type="button"
										onClick={() => removeKeyword(k)}
										className="text-teal-300/80 hover:text-teal-200 cursor-pointer"
										aria-label={`Remove ${k}`}
									>
										<IoClose className="w-3.5 h-3.5" />
									</button>
								</span>
							))}
							<input
								type="text"
								autoComplete="off"
								spellCheck={false}
								placeholder={
									keywords.length === 0
										? "Type keyword, press Enter (e.g. Bitcoin, DeFi)"
										: "Add another…"
								}
								value={draft}
								onChange={(e) => setDraft(e.target.value)}
								onKeyDown={onKeyDown}
								onBlur={() => draft.trim() && addKeyword(draft)}
								className="flex-1 min-w-32 bg-transparent border-0 outline-none text-sm text-slate-200 placeholder:text-slate-600 py-0.5"
							/>
						</div>

						<div className="mt-3 flex flex-wrap items-center gap-2">
							<span className="text-xs text-slate-500">Try:</span>
							{SUGGESTIONS.map((s) => {
								const already = keywords.some(
									(k) => k.toLowerCase() === s.toLowerCase(),
								);
								return (
									<button
										key={s}
										type="button"
										disabled={already}
										onClick={() => addKeyword(s)}
										className={`text-xs px-2.5 py-1 rounded-full border transition ${
											already
												? "border-white/6 text-slate-600 cursor-not-allowed"
												: "border-white/10 text-slate-400 hover:border-teal-500/40 hover:text-teal-300 cursor-pointer"
										}`}
									>
										{s}
									</button>
								);
							})}
						</div>

						<div className="mt-5 pt-5 border-t border-white/8">
							<p className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
								<IoBookmarkOutline className="w-4 h-4 text-teal-400" />
								Your saved keywords
							</p>
							<p className="text-xs text-slate-500 mb-3">
								Save phrases you reuse often. Separate multiple with commas. Click a
								saved tag to add it to this search, or remove it from your library.
							</p>
							<div className="flex flex-col sm:flex-row gap-2">
								<input
									type="text"
									autoComplete="off"
									spellCheck={false}
									placeholder="e.g. EigenLayer, restaking, RWA"
									value={customSaveDraft}
									onChange={(e) => setCustomSaveDraft(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											saveCustomKeywordsToLibrary();
										}
									}}
									className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-white/8 bg-white/4 text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-500/50 transition"
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="shrink-0 sm:self-stretch"
									disabled={!customSaveDraft.trim()}
									onClick={saveCustomKeywordsToLibrary}
								>
									Save to library
								</Button>
							</div>
							{savedCustomKeywords.length > 0 ? (
								<div className="mt-3 flex flex-wrap gap-2">
									{savedCustomKeywords.map((k) => {
										const inSearch = keywords.some(
											(x) => x.toLowerCase() === k.toLowerCase(),
										);
										return (
											<span
												key={k}
												className="inline-flex items-center gap-0.5 rounded-full border border-violet-500/35 bg-violet-500/12 text-violet-200 text-xs font-medium overflow-hidden"
											>
												<button
													type="button"
													title={inSearch ? "Already in search" : "Add to this search"}
													disabled={inSearch}
													onClick={() => addKeyword(k)}
													className={`pl-2.5 pr-1 py-1.5 max-w-[200px] truncate cursor-pointer transition ${
														inSearch
															? "text-slate-500 cursor-not-allowed"
															: "hover:bg-white/8 hover:text-white"
													}`}
												>
													{k}
												</button>
												<button
													type="button"
													onClick={() => removeSavedCustom(k)}
													className="px-1.5 py-1.5 text-violet-300/80 hover:text-red-300 hover:bg-red-500/15 cursor-pointer border-l border-white/10"
													aria-label={`Remove ${k} from library`}
												>
													<IoTrashOutline className="w-3.5 h-3.5" />
												</button>
											</span>
										);
									})}
								</div>
							) : (
								<p className="mt-3 text-xs text-slate-600">
									No saved keywords yet — add one above.
								</p>
							)}
							<p className="mt-2 text-[11px] text-slate-600">
								Stored in this browser only (localStorage). Up to {MAX_SAVED_CUSTOM}{" "}
								saved, {MAX_KEYWORD_LEN} characters each.
							</p>
						</div>

						<div className="mt-4 flex justify-end">
							<Button
								type="submit"
								size="lg"
								disabled={loading || (keywords.length === 0 && !draft.trim())}
								aria-busy={loading}
							>
								<IoSearchOutline className="w-5 h-5 mr-2 shrink-0" aria-hidden />
								{loading ? "Analyzing…" : "Analyze news"}
							</Button>
						</div>
						<p className="mt-3 text-xs text-slate-500">
							No keywords? We'll default to general crypto/blockchain news.
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
										Market read
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
									No recent headlines found for these keywords.
								</div>
							)}
						</motion.div>
					)}
				</div>
			</section>
		</>
	);
};
