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
import { cx } from "./shared";
import { IoPricetagOutline, IoWalletOutline } from "react-icons/io5";

function CellSkeleton({ className }: { className?: string }) {
	return (
		<span
			className={cx(
				"inline-block align-middle rounded-md bg-white/8 animate-pulse motion-reduce:animate-none",
				className,
			)}
			aria-hidden
		/>
	);
}

/** Skeleton cells for Current Plan → Action (use after Product Name column). */
function ProductRowDataSkeletonCells() {
	return (
		<>
			<td className="px-4 py-3 align-middle">
				<CellSkeleton className="h-6 w-21 rounded-full" />
			</td>
			<td className="px-4 py-3 align-middle">
				<CellSkeleton className="h-4 w-40 max-w-full" />
			</td>
			<td className="px-4 py-3 align-middle">
				<CellSkeleton className="h-4 w-32 max-w-full" />
			</td>
			<td className="px-4 py-3 align-middle">
				<CellSkeleton className="h-4 w-14" />
			</td>
			<td className="px-4 py-3 align-middle text-right">
				<div className="flex min-h-9 items-center justify-end">
					<CellSkeleton className="h-9 w-35 rounded-xl" />
				</div>
			</td>
		</>
	);
}

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
	const [tradeGptBusy, setTradeGptBusy] = useState(false);
	const [tradeGptError, setTradeGptError] = useState<string | null>(null);
	const [prices, setPrices] = useState<ProductPrices>({});
	const [projectSubs, setProjectSubs] = useState<ProjectSubscriptionStatus[]>([]);
	/** True until TradeGPT subscription, project subscriptions, and prices have all settled (then rows render together). */
	const [productsDataLoading, setProductsDataLoading] = useState(true);
	const [mentalBusy, setMentalBusy] = useState(false);
	const [mentalError, setMentalError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setProductsDataLoading(true);
		setTradeGptError(null);

		void (async () => {
			const [tradeRes, projectRes, priceRes] = await Promise.allSettled([
				apiGetSubscription(token),
				apiGetProjectSubscriptions(token),
				apiGetProductPrices(),
			]);
			if (cancelled) return;

			if (tradeRes.status === "fulfilled") {
				setTradeGpt(tradeRes.value);
			} else {
				setTradeGpt(null);
				const e = tradeRes.reason;
				setTradeGptError(
					e instanceof Error
						? e.message
						: "Failed to load TradeGPT subscription.",
				);
			}

			if (projectRes.status === "fulfilled") {
				setProjectSubs(projectRes.value);
			} else {
				setProjectSubs([]);
			}

			if (priceRes.status === "fulfilled") {
				setPrices(priceRes.value);
			} else {
				setPrices({});
			}

			setProductsDataLoading(false);
		})();

		return () => {
			cancelled = true;
		};
	}, [token]);

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
						<table
							className="w-full min-w-[640px] table-fixed text-left text-sm"
							aria-busy={productsDataLoading}>
							<colgroup>
								<col className="w-[17%]" />
								<col className="w-[12%]" />
								<col className="w-[22%]" />
								<col className="w-[17%]" />
								<col className="w-[10%]" />
								<col className="w-[22%]" />
							</colgroup>
							<thead className="text-xs uppercase tracking-wide text-slate-500 bg-black/10">
								<tr>
									<th className="px-4 py-2.5 font-semibold align-middle">Product Name</th>
									<th className="px-4 py-2.5 font-semibold align-middle">Current Plan</th>
									<th className="px-4 py-2.5 font-semibold align-middle">Trial Expires</th>
									<th className="px-4 py-2.5 font-semibold align-middle">Next Billing</th>
									<th className="px-4 py-2.5 font-semibold align-middle">Price</th>
									<th className="px-4 py-2.5 font-semibold align-middle text-right">
										Action
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/8">
								<tr className="text-slate-200">
									<td className="px-4 py-3 align-middle font-semibold text-slate-200">
										CryptDocker
									</td>
									{productsDataLoading ? (
										<ProductRowDataSkeletonCells />
									) : (
										<>
											<td className="px-4 py-3 align-middle">
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
											<td className="px-4 py-3 align-middle text-slate-300">
												{cryptdockerPlan === "Trial"
													? `${fmtDate(me?.trialExpiresAt)}${typeof cryptdockerTrialDays === "number" ? ` (${cryptdockerTrialDays}d)` : ""}`
													: "—"}
											</td>
											<td className="px-4 py-3 align-middle text-slate-300">
												{cryptdockerPlan === "Trial"
													? "—"
													: fmtDate(me?.billingDate)}
											</td>
											<td className="px-4 py-3 align-middle text-slate-300">
												{fmtMoney(cryptdockerProPriceUsd)}
											</td>
											<td className="px-4 py-3 align-middle text-right">
												<div className="flex min-h-9 items-center justify-end gap-2">
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
												</div>
											</td>
										</>
									)}
								</tr>

								<tr className="text-slate-200">
									<td className="px-4 py-3 align-middle font-semibold text-slate-200">
										TradeGPT
									</td>
									{productsDataLoading ? (
										<ProductRowDataSkeletonCells />
									) : (
										<>
											<td className="px-4 py-3 align-middle">
												{tradeGptError ? (
													<span className="text-sm text-red-200">Error</span>
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
											<td className="px-4 py-3 align-middle text-slate-300">
												{tradeGptError
													? "—"
													: tradeGpt?.trialActive
														? `${fmtDate(tradeGpt.trialEndsAt)} (${tradeGpt.trialDaysLeft}d)`
														: "—"}
											</td>
											<td className="px-4 py-3 align-middle text-slate-300">
												{tradeGptError
													? "—"
													: tradeGpt?.trialActive
														? "—"
														: fmtDate(tradeGpt?.nextBillingDate)}
											</td>
											<td className="px-4 py-3 align-middle text-slate-300">
												{tradeGptError ? "—" : fmtMoney(tradegptProPriceUsd)}
											</td>
											<td className="px-4 py-3 align-middle text-right">
												<div className="flex min-h-9 items-center justify-end gap-2">
													{tradeGptError ? (
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
												</div>
											</td>
										</>
									)}
								</tr>

								<tr className="text-slate-200">
									<td className="px-4 py-3 align-middle font-semibold text-slate-200">
										MentalShield
									</td>
									{productsDataLoading ? (
										<ProductRowDataSkeletonCells />
									) : (
										<>
											<td className="px-4 py-3 align-middle">
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
											<td className="px-4 py-3 align-middle text-slate-300">
												{mentalShieldSub?.trialActive
													? `${fmtDate(mentalShieldSub.trialExpiresAt)} (${mentalShieldSub.trialDaysLeft}d)`
													: "—"}
											</td>
											<td className="px-4 py-3 align-middle text-slate-300">
												{mentalShieldSub?.trialActive
													? "—"
													: fmtDate(mentalShieldSub?.nextBillingDate)}
											</td>
											<td className="px-4 py-3 align-middle text-slate-300">
												{fmtMoney(mentalshieldProPriceUsd)}
											</td>
											<td className="px-4 py-3 align-middle text-right">
												<div className="flex min-h-9 items-center justify-end gap-2">
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
												</div>
											</td>
										</>
									)}
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Section>
	);
}
