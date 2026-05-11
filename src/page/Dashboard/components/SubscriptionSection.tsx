import type { MeResponse } from "../../../services/user.service";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../component/Button";
import {
	apiDowngradeSubscription,
	apiGetSubscription,
	apiUpgradeSubscription,
	type SubscriptionInfo,
} from "../../../tradeGPT/lib/api";
import { apiFetch } from "../../../services/api";
import { Badge, Section } from "./ui";
import { IoPricetagOutline, IoWalletOutline } from "react-icons/io5";

function fmtDate(value: string | null | undefined) {
	if (!value) return "—";
	try {
		return new Date(value).toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	} catch {
		return String(value);
	}
}

function fmtMoney(value: unknown) {
	const n =
		typeof value === "string"
			? Number(value)
			: typeof value === "number"
				? value
				: NaN;
	if (!Number.isFinite(n)) return "—";
	return `$${n.toFixed(2)}`;
}

function daysLeft(until: string | null | undefined) {
	if (!until) return null;
	const ts = new Date(until).getTime();
	if (!Number.isFinite(ts)) return null;
	const diff = ts - Date.now();
	return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

type ProductPrices = Partial<
	Record<"CryptDocker" | "TradeGPT" | "MentalShield", number>
>;

async function apiGetProductPrices(): Promise<ProductPrices> {
	const res = await apiFetch<{ price?: unknown }>("/constants/price");
	const raw = res?.price;
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

	const out: ProductPrices = {};
	for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
		if (typeof v === "number" && Number.isFinite(v)) {
			(out as Record<string, number>)[k] = v;
		}
	}
	return out;
}

type ProjectSubscriptionStatus = {
	project: "cryptdocker" | "tradegpt" | "mentalshield";
	paymentMethod: "free" | "pro";
	billingDate: string | null;
	trialExpiresAt: string | null;
	proGraceUntil: string | null;
	proCancelAtPeriodEnd: boolean;
	trialActive: boolean;
	trialDaysLeft: number;
	nextBillingDate: string | null;
};

async function apiGetProjectSubscriptions(token: string): Promise<ProjectSubscriptionStatus[]> {
	const res = await apiFetch<{ subscriptions: ProjectSubscriptionStatus[] }>("/user/subscriptions", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return Array.isArray(res.subscriptions) ? res.subscriptions : [];
}

async function apiUpgradeProjectSubscription(token: string, project: ProjectSubscriptionStatus["project"]) {
	return await apiFetch<{ user?: MeResponse; message?: string }>(
		`/user/subscriptions/${encodeURIComponent(project)}/upgrade-pro`,
		{
			method: "POST",
			headers: { Authorization: `Bearer ${token}` },
		},
	);
}

async function apiCancelProjectSubscription(token: string, project: ProjectSubscriptionStatus["project"]) {
	return await apiFetch<{ user?: MeResponse; message?: string }>(
		`/user/subscriptions/${encodeURIComponent(project)}/cancel-pro`,
		{
			method: "POST",
			headers: { Authorization: `Bearer ${token}` },
		},
	);
}

export function SubscriptionSection({
	me,
	plan,
	token,
	onTopUp,
	onUpgradeCryptDocker,
	onDowngradeCryptDocker,
	onRefreshMe,
}: {
	me: MeResponse | null;
	plan: { isPro: boolean; trialActive: boolean; graceActive: boolean };
	token: string;
	onTopUp: () => void;
	onUpgradeCryptDocker: () => Promise<void> | void;
	onDowngradeCryptDocker: () => Promise<void> | void;
	onRefreshMe: () => void;
}) {
	const [tradeGpt, setTradeGpt] = useState<SubscriptionInfo | null>(null);
	const [tradeGptLoading, setTradeGptLoading] = useState(false);
	const [tradeGptBusy, setTradeGptBusy] = useState(false);
	const [tradeGptError, setTradeGptError] = useState<string | null>(null);
	const [prices, setPrices] = useState<ProductPrices>({});
	const [projectSubs, setProjectSubs] = useState<ProjectSubscriptionStatus[]>([]);
	const [mentalBusy, setMentalBusy] = useState(false);
	const [mentalError, setMentalError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setTradeGptLoading(true);
		setTradeGptError(null);
		apiGetSubscription(token)
			.then((s) => {
				if (cancelled) return;
				setTradeGpt(s);
			})
			.catch((e) => {
				if (cancelled) return;
				setTradeGptError(
					e instanceof Error
						? e.message
						: "Failed to load TradeGPT subscription.",
				);
			})
			.finally(() => {
				if (cancelled) return;
				setTradeGptLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [token]);

	useEffect(() => {
		let cancelled = false;
		apiGetProjectSubscriptions(token)
			.then((subs) => {
				if (cancelled) return;
				setProjectSubs(subs);
			})
			.catch(() => {
				if (cancelled) return;
				setProjectSubs([]);
			});
		return () => {
			cancelled = true;
		};
	}, [token]);

	useEffect(() => {
		let cancelled = false;
		apiGetProductPrices()
			.then((p) => {
				if (cancelled) return;
				setPrices(p);
			})
			.catch(() => {
				if (cancelled) return;
				setPrices({});
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const cryptdockerPlan: "Free" | "Trial" | "Pro" = plan.isPro
		? "Pro"
		: plan.trialActive
			? "Trial"
			: "Free";
	const cryptdockerTrialDays = plan.trialActive
		? daysLeft(me?.trialExpiresAt)
		: null;
	// Backends sometimes serialize this flag with different casing.
	const cryptdockerCancelScheduled = Boolean(
		(me as any)?.proCancelAtPeriodEnd ?? (me as any)?.ProCancelAtPeriodEnd,
	);

	const tradegptPlan: "Free" | "Trial" | "Pro" | "—" = !tradeGpt
		? "—"
		: tradeGpt.plan === "pro"
			? "Pro"
			: tradeGpt.trialActive
				? "Trial"
				: "Free";

	const cryptdockerProPriceUsd = prices.CryptDocker ?? 0;
	const tradegptProPriceUsd = prices.TradeGPT ?? 0;
	const mentalshieldProPriceUsd = prices.MentalShield ?? 0;

	const mentalShieldSub = useMemo(() => {
		return projectSubs.find((s) => s.project === "mentalshield") ?? null;
	}, [projectSubs]);
	const mentalShieldPlan: "Free" | "Trial" | "Pro" | "—" = !mentalShieldSub
		? "—"
		: mentalShieldSub.paymentMethod === "pro"
			? "Pro"
			: mentalShieldSub.trialActive
				? "Trial"
				: "Free";

	const mentalCancelScheduled = Boolean(mentalShieldSub?.proCancelAtPeriodEnd);

	return (
		<Section
			title="Subscription"
			icon={<IoPricetagOutline className="text-lg" />}
			subtitle="Balance, top ups, and per-product subscription status."
		>
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-3 rounded-xl py-2">
					<div className="min-w-0">
						<p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
							Available balance
						</p>
						<p className="text-base font-semibold text-white leading-snug">
							{fmtMoney(me?.balance)}
						</p>
					</div>
					<Button size="sm" onClick={onTopUp}>
						<span className="inline-flex items-center gap-2">
							<IoWalletOutline className="text-base" />
							Top up
						</span>
					</Button>
				</div>

				<div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
					<div className="px-4 py-3 border-b border-white/8">
						<p className="text-sm font-semibold text-white">Products</p>
					</div>
					<div className="overflow-auto">
						<table className="w-full text-left text-sm">
							<thead className="text-xs uppercase tracking-wide text-slate-500 bg-black/10">
								<tr>
									<th className="px-4 py-2.5 font-semibold">Product Name</th>
									<th className="px-4 py-2.5 font-semibold">Current Plan</th>
									<th className="px-4 py-2.5 font-semibold">Trial Expires</th>
									<th className="px-4 py-2.5 font-semibold">Next Billing</th>
									<th className="px-4 py-2.5 font-semibold">Price</th>
									<th className="px-4 py-2.5 font-semibold text-right">
										Action
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/8">
								<tr className="text-slate-200">
									<td className="px-4 py-3 font-semibold">CryptDocker</td>
									<td className="px-4 py-3">
										<Badge
											variant={
												cryptdockerPlan === "Pro"
													? "good"
													: cryptdockerPlan === "Trial"
														? "good"
														: "neutral"
											}>
											{cryptdockerPlan}
										</Badge>
									</td>
									<td className="px-4 py-3 text-slate-300">
										{cryptdockerPlan === "Trial"
											? `${fmtDate(me?.trialExpiresAt)}${typeof cryptdockerTrialDays === "number" ? ` (${cryptdockerTrialDays}d)` : ""}`
											: "—"}
									</td>
									<td className="px-4 py-3 text-slate-300">
										{cryptdockerPlan === "Trial"
											? "—"
											: fmtDate(me?.billingDate)}
									</td>
									<td className="px-4 py-3 text-slate-300">
										{fmtMoney(cryptdockerProPriceUsd)}
									</td>
									<td className="px-4 py-3 text-right">
										{cryptdockerPlan === "Pro" ? (
											<Button
												size="sm"
												variant="outline"
												disabled={cryptdockerCancelScheduled}
												onClick={() => {
													if (cryptdockerCancelScheduled) return;
													void onDowngradeCryptDocker();
												}}>
												{cryptdockerCancelScheduled
													? "Cancellation Scheduled"
													: "Downgrade Plan"}
											</Button>
										) : (
											<Button size="sm" onClick={onUpgradeCryptDocker}>
												Upgrade Plan
											</Button>
										)}
									</td>
								</tr>

								<tr className="text-slate-200">
									<td className="px-4 py-3 font-semibold">TradeGPT</td>
									<td className="px-4 py-3">
										{tradeGptLoading ? (
											<span className="text-slate-500">Loading…</span>
										) : tradeGptError ? (
											<span className="text-red-200">Error</span>
										) : (
											<Badge
												variant={
													tradegptPlan === "Pro"
														? "good"
														: tradegptPlan === "Trial"
															? "good"
															: "neutral"
												}>
												{tradegptPlan}
											</Badge>
										)}
									</td>
									<td className="px-4 py-3 text-slate-300">
										{tradeGptLoading || tradeGptError
											? "—"
											: tradeGpt?.trialActive
												? `${fmtDate(tradeGpt.trialEndsAt)} (${tradeGpt.trialDaysLeft}d)`
												: "—"}
									</td>
									<td className="px-4 py-3 text-slate-300">
										{tradeGptLoading || tradeGptError
											? "—"
											: tradeGpt?.trialActive
												? "—"
												: fmtDate(tradeGpt?.nextBillingDate)}
									</td>
									<td className="px-4 py-3 text-slate-300">
										{tradeGptLoading || tradeGptError
											? "—"
											: fmtMoney(tradegptProPriceUsd)}
									</td>
									<td className="px-4 py-3 text-right">
										{tradeGptLoading ? null : tradeGptError ? (
											<Button
												size="sm"
												variant="outline"
												onClick={() => setTradeGptError(null)}>
												Dismiss
											</Button>
										) : tradeGpt?.plan === "pro" ? (
											<Button
												size="sm"
												variant="outline"
												disabled={
													tradeGptBusy ||
													!tradeGpt ||
													Boolean(
														(tradeGpt as any).proCancelAtPeriodEnd ??
															(tradeGpt as any).ProCancelAtPeriodEnd,
													)
												}
												onClick={async () => {
													if (!tradeGpt || tradeGpt.plan !== "pro") return;
													setTradeGptBusy(true);
													setTradeGptError(null);
													try {
														const res = await apiDowngradeSubscription(token);
														setTradeGpt(res.subscription);
														onRefreshMe();
													} catch (e) {
														setTradeGptError(
															e instanceof Error ? e.message : "Downgrade failed.",
														);
													} finally {
														setTradeGptBusy(false);
													}
												}}>
												{(tradeGpt as any).proCancelAtPeriodEnd ??
												(tradeGpt as any).ProCancelAtPeriodEnd
													? "Cancellation Scheduled"
													: "Downgrade Plan"}
											</Button>
										) : (
											<Button
												size="sm"
												disabled={tradeGptBusy || !tradeGpt}
												onClick={async () => {
													if (!tradeGpt || tradeGpt.plan === "pro") return;
													setTradeGptBusy(true);
													setTradeGptError(null);
													try {
														const res = await apiUpgradeSubscription(token);
														setTradeGpt(res.subscription);
														onRefreshMe();
													} catch (e) {
														setTradeGptError(
															e instanceof Error
																? e.message
																: "Upgrade failed.",
														);
													} finally {
														setTradeGptBusy(false);
													}
												}}>
												Upgrade Plan
											</Button>
										)}
									</td>
								</tr>

								<tr className="text-slate-200">
									<td className="px-4 py-3 font-semibold">MentalShield</td>
									<td className="px-4 py-3">
										<Badge
											variant={
												mentalShieldPlan === "Pro"
													? "good"
													: mentalShieldPlan === "Trial"
														? "good"
														: "neutral"
											}>
											{mentalShieldPlan}
										</Badge>
									</td>
									<td className="px-4 py-3 text-slate-300">
										{mentalShieldSub?.trialActive
											? `${fmtDate(mentalShieldSub.trialExpiresAt)} (${mentalShieldSub.trialDaysLeft}d)`
											: "—"}
									</td>
									<td className="px-4 py-3 text-slate-300">
										{mentalShieldSub?.trialActive
											? "—"
											: fmtDate(mentalShieldSub?.nextBillingDate)}
									</td>
									<td className="px-4 py-3 text-slate-300">
										{fmtMoney(mentalshieldProPriceUsd)}
									</td>
									<td className="px-4 py-3 text-right">
										{mentalError ? (
											<Button size="sm" variant="outline" onClick={() => setMentalError(null)}>
												Dismiss
											</Button>
										) : mentalShieldSub?.paymentMethod === "pro" ? (
											<Button
												size="sm"
												variant="outline"
												disabled={mentalBusy || mentalCancelScheduled}
												onClick={async () => {
													if (!token) return;
													if (!mentalShieldSub || mentalShieldSub.paymentMethod !== "pro") return;
													if (mentalCancelScheduled) return;
													setMentalBusy(true);
													setMentalError(null);
													try {
														await apiCancelProjectSubscription(token, "mentalshield");
														const subs = await apiGetProjectSubscriptions(token);
														setProjectSubs(subs);
														onRefreshMe();
													} catch (e) {
														setMentalError(e instanceof Error ? e.message : "Downgrade failed.");
													} finally {
														setMentalBusy(false);
													}
												}}>
												{mentalCancelScheduled ? "Cancellation Scheduled" : "Downgrade Plan"}
											</Button>
										) : (
											<Button
												size="sm"
												disabled={mentalBusy || !mentalShieldSub}
												onClick={async () => {
													if (!token) return;
													if (!mentalShieldSub || mentalShieldSub.paymentMethod === "pro") return;
													setMentalBusy(true);
													setMentalError(null);
													try {
														await apiUpgradeProjectSubscription(token, "mentalshield");
														const subs = await apiGetProjectSubscriptions(token);
														setProjectSubs(subs);
														onRefreshMe();
													} catch (e) {
														setMentalError(e instanceof Error ? e.message : "Upgrade failed.");
													} finally {
														setMentalBusy(false);
													}
												}}>
												Upgrade Plan
											</Button>
										)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Section>
	);
}
