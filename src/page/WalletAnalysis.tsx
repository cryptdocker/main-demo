import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	IoWalletOutline,
	IoSearchOutline,
	IoShieldCheckmarkOutline,
	IoAlertCircleOutline,
	IoCheckmarkCircle,
	IoWarningOutline,
} from "react-icons/io5";
import { PageHeader } from "../layout/PageHeader";
import { Button } from "../component/Button";
import { SEO } from "../component/SEO";
import { useAuth } from "../auth/useAuth";
import { SignInCtaModal } from "../component/SignInCtaModal";
import {
	analyzeWallet,
	type RadarRiskResponse,
} from "../services/analysis.service";

const EVM_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;
const EVM_TX_REGEX = /^0x[0-9a-fA-F]{64}$/;

const FLAG_LABELS: Record<string, string> = {
	sanctioned: "Sanctioned",
	blacklisted: "Blacklisted",
	threat_actor: "Threat Actor",
	smart_money: "Smart Money",
};

function isValidPayload(value: string): boolean {
	const v = value.trim();
	return EVM_ADDRESS_REGEX.test(v) || EVM_TX_REGEX.test(v);
}

function riskColor(level: string | undefined) {
	const l = (level ?? "").toLowerCase();
	if (l === "critical" || l === "high")
		return {
			wrap: "border-red-500/30 bg-red-500/10",
			badge: "bg-red-500/20 text-red-300 border-red-500/40",
			text: "text-red-300",
		};
	if (l === "medium")
		return {
			wrap: "border-amber-500/30 bg-amber-500/10",
			badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
			text: "text-amber-300",
		};
	if (l === "low" || l === "minimal")
		return {
			wrap: "border-emerald-500/30 bg-emerald-500/10",
			badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
			text: "text-emerald-300",
		};
	return {
		wrap: "border-white/8 bg-white/4",
		badge: "bg-white/8 text-slate-300 border-white/12",
		text: "text-slate-300",
	};
}

export const WalletAnalysis: React.FC = () => {
	const { user, token } = useAuth();
	const authed = !!user && !!token;
	const [signInOpen, setSignInOpen] = useState(false);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<RadarRiskResponse | null>(null);
	const [showSignals, setShowSignals] = useState(false);

	useEffect(() => {
		if (!authed) setSignInOpen(true);
	}, [authed]);

	const trimmed = input.trim();
	const valid = isValidPayload(trimmed);

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
		setShowSignals(false);
		try {
			const res = await analyzeWallet(trimmed);
			if (res.success && res.data) {
				setData(res.data);
			} else {
				setError(res.error || "Analysis failed.");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Request failed.");
		} finally {
			setLoading(false);
		}
	};

	const colors = riskColor(data?.risk_level);

	return (
		<>
			<SignInCtaModal open={signInOpen} onClose={() => setSignInOpen(false)} />
			<SEO
				title="Wallet Analysis"
				description="Scan any wallet or contract address for sanctions, blacklists, threat intelligence, and on-chain risk signals — powered by FailSafe Radar."
				path="/tools/wallet-analysis"
			/>
			<PageHeader
				label="Wallet Analysis"
				title="Check any wallet or contract"
				description="Paste an EVM address or transaction hash to get an instant risk score, entity attribution, and threat signals before you sign."
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
							<IoWalletOutline className="w-4 h-4 text-teal-400" />
							Wallet or contract address
						</label>
						<div className="flex flex-col sm:flex-row gap-3">
							<input
								type="text"
								autoComplete="off"
								spellCheck={false}
								placeholder="0x… (address or tx hash)"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-white/8 bg-white/4 text-slate-200 placeholder:text-slate-600 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-500/50 transition"
							/>
							<Button
								type="submit"
								size="lg"
								disabled={!valid || loading}
								title={!valid ? "Enter a valid 0x address or tx hash" : undefined}
								aria-busy={loading}
							>
								<IoSearchOutline className="w-5 h-5 mr-2 shrink-0" aria-hidden />
								{loading ? "Analyzing…" : "Analyze"}
							</Button>
						</div>
						<p className="mt-3 text-xs text-slate-500">
							Accepts EVM addresses (0x + 40 hex) or transaction hashes (0x + 64 hex).
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
							<div className="h-24 rounded-2xl bg-white/4 border border-white/6 animate-pulse" />
							<div className="h-20 rounded-2xl bg-white/4 border border-white/6 animate-pulse" />
						</div>
					)}

					{data && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.45 }}
							className="mt-6 space-y-4"
						>
							<div className={`rounded-2xl border ${colors.wrap} p-5`}>
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
											Target
										</p>
										<p className="font-mono text-sm text-slate-200 break-all">
											{data.address}
										</p>
									</div>
									<div className="text-right shrink-0">
										<p className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
											Risk level
										</p>
										<span
											className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${colors.badge}`}
										>
											{(data.risk_level || "unknown").toString().toUpperCase()}
										</span>
									</div>
								</div>
								<div className="mt-4 flex items-end gap-6">
									<div>
										<p className="text-[11px] uppercase tracking-wider text-slate-400">
											Risk score
										</p>
										<p className={`text-4xl font-extrabold tabular-nums ${colors.text}`}>
											{data.score}
										</p>
									</div>
									<div>
										<p className="text-[11px] uppercase tracking-wider text-slate-400">
											Confidence
										</p>
										<p className="text-xl font-semibold text-slate-200 tabular-nums">
											{Math.round((data.confidence ?? 0) * 100)}%
										</p>
									</div>
								</div>
							</div>

							{data.flags && Object.keys(data.flags).length > 0 && (
								<div className="rounded-2xl border border-white/8 bg-white/4 p-5">
									<p className="text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
										<IoWarningOutline className="w-4 h-4 text-amber-400" />
										Risk flags
									</p>
									<div className="flex flex-wrap gap-2">
										{Object.entries(data.flags).map(([key, val]) => {
											const label = FLAG_LABELS[key] ?? key.replace(/_/g, " ");
											const active = !!val;
											return (
												<span
													key={key}
													className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
														active
															? "bg-red-500/15 text-red-300 border-red-500/40"
															: "bg-white/6 text-slate-400 border-white/10"
													}`}
												>
													{label}
												</span>
											);
										})}
									</div>
								</div>
							)}

							{data.labels && data.labels.length > 0 && (
								<div className="rounded-2xl border border-white/8 bg-white/4 p-5">
									<p className="text-xs uppercase tracking-wider text-slate-400 mb-3">
										Labels
									</p>
									<div className="flex flex-wrap gap-2">
										{data.labels.map((l, i) => (
											<span
												key={i}
												className="text-xs px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
											>
												{l}
											</span>
										))}
									</div>
								</div>
							)}

							{data.entity && (
								<div className="rounded-2xl border border-white/8 bg-white/4 p-5">
									<p className="text-xs uppercase tracking-wider text-slate-400 mb-3">
										Entity information
									</p>
									<div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
										<span className="text-slate-500">Name</span>
										<span className="text-slate-200">{data.entity.name || "—"}</span>
										<span className="text-slate-500">Type</span>
										<span className="text-slate-200 capitalize">
											{data.entity.type || "—"}
										</span>
									</div>
								</div>
							)}

							{data.recommendation && (
								<div className="rounded-2xl border border-white/8 bg-white/4 p-5">
									<p className="text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
										<IoShieldCheckmarkOutline className="w-4 h-4 text-teal-400" />
										Recommendation
									</p>
									{data.recommendation.action && (
										<span
											className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
												data.recommendation.action === "ALLOW"
													? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
													: "bg-red-500/15 text-red-300 border-red-500/40"
											}`}
										>
											{data.recommendation.action === "ALLOW" && (
												<IoCheckmarkCircle className="w-3.5 h-3.5" />
											)}
											{data.recommendation.action}
										</span>
									)}
									{data.recommendation.summary && (
										<p className="mt-3 text-sm text-slate-200 leading-relaxed">
											{data.recommendation.summary}
										</p>
									)}
									{data.recommendation.details && (
										<p className="mt-1 text-sm text-slate-400 leading-relaxed">
											{data.recommendation.details}
										</p>
									)}
								</div>
							)}

							{data.signals && data.signals.length > 0 && (
								<div className="rounded-2xl border border-white/8 bg-white/4 p-5">
									<button
										type="button"
										onClick={() => setShowSignals((s) => !s)}
										className="text-sm font-medium text-teal-400 hover:underline cursor-pointer"
									>
										{showSignals ? "Hide" : "Show"} signals ({data.signals.length})
									</button>
									{showSignals && (
										<ul className="mt-3 space-y-1.5 max-h-60 overflow-y-auto text-sm">
											{data.signals.map((s, i) => (
												<li
													key={i}
													className="flex flex-wrap gap-x-2 text-slate-400"
												>
													<span className="text-slate-500">{s.signal}:</span>
													<span className="text-slate-300 break-all">
														{s.matched_value}
													</span>
												</li>
											))}
										</ul>
									)}
								</div>
							)}
						</motion.div>
					)}
				</div>
			</section>
		</>
	);
};
