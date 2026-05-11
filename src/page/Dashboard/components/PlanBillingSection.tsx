import { useEffect, useState } from "react";
import { Button } from "../../../component/Button";
import type { MeResponse } from "../../../services/user.service";
import {
	IoCashOutline,
	IoCheckmarkCircleOutline,
	IoCopyOutline,
} from "react-icons/io5";
import { useAuth } from "../../../auth/useAuth";
import { apiFetch } from "../../../services/api";
import {
	apiGetSubscription,
	type SubscriptionInfo,
} from "../../../tradeGPT/lib/api";
import { cx } from "./shared";
import { Section, Select } from "./ui";
import type { CreatePaymentResult } from "../../../services/payment.service";
import { usePaymentQr } from "./usePaymentQr";

type PlanProductPlan = "Free" | "Trial" | "Pro" | "—";

function planProductVisualVariant(plan: PlanProductPlan): "good" | "neutral" {
	return plan === "Pro" || plan === "Trial" ? "good" : "neutral";
}

/** Product + plan in one pill; vertical divider is edge-to-edge (no horizontal padding). */
function PlanProductBadge({
	product,
	plan,
}: {
	product: string;
	plan: PlanProductPlan;
}) {
	const v = planProductVisualVariant(plan);
	return (
		<span
			className={cx(
				"inline-flex min-h-0 items-stretch rounded-full border text-xs font-semibold",
				v === "good" &&
					"border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
				v === "neutral" && "border-white/10 bg-white/5 text-slate-300",
			)}>
			<span className="inline-flex items-center px-2.5 py-1">{product}</span>
			<span
				className={cx(
					"w-px shrink-0 self-stretch",
					v === "good" && "bg-emerald-500/35",
					v === "neutral" && "bg-white/20",
				)}
				aria-hidden
			/>
			<span className="inline-flex items-center px-2.5 py-1">{plan}</span>
		</span>
	);
}

function PlanProductBadgeSkeleton() {
	return (
		<span
			className="inline-flex h-7 min-w-40 max-w-48 shrink-0 items-stretch overflow-hidden rounded-full border border-white/10 bg-white/5"
			aria-hidden>
			<span className="min-w-18 flex-1 animate-pulse bg-white/10 motion-reduce:animate-none" />
			<span className="w-px shrink-0 self-stretch bg-white/10" />
			<span className="w-11 shrink-0 animate-pulse bg-white/10 motion-reduce:animate-none" />
		</span>
	);
}

export function PlanBillingSection({
	me,
	plan,
	topUp,
}: {
	me: MeResponse | null;
	plan: { isPro: boolean; trialActive: boolean; graceActive: boolean };
	topUp: {
		amount: string;
		onAmountChange: (v: string) => void;
		method: string;
		onMethodChange: (v: string) => void;
		minimumAmount: number;
		busy: boolean;
		payment: CreatePaymentResult | null;
		onPay: () => void;
		onReset: () => void;
	};
}) {
	const qrImageSrc = usePaymentQr(topUp.payment);

	const cryptdockerPlan: "Free" | "Trial" | "Pro" = plan.isPro
		? "Pro"
		: plan.trialActive
			? "Trial"
			: "Free";

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

	const { token } = useAuth();
	const [projectSubs, setProjectSubs] = useState<ProjectSubscriptionStatus[]>(
		[],
	);
	const [tradeGpt, setTradeGpt] = useState<SubscriptionInfo | null>(null);
	const [planBadgesLoading, setPlanBadgesLoading] = useState(false);

	useEffect(() => {
		if (!token) {
			setProjectSubs([]);
			setTradeGpt(null);
			setPlanBadgesLoading(false);
			return;
		}

		let cancelled = false;
		setPlanBadgesLoading(true);
		void (async () => {
			const [subsRes, tgRes] = await Promise.allSettled([
				apiFetch<{ subscriptions: ProjectSubscriptionStatus[] }>(
					"/user/subscriptions",
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				),
				apiGetSubscription(token),
			]);
			if (cancelled) return;
			if (subsRes.status === "fulfilled") {
				setProjectSubs(
					Array.isArray(subsRes.value.subscriptions)
						? subsRes.value.subscriptions
						: [],
				);
			} else {
				setProjectSubs([]);
			}
			if (tgRes.status === "fulfilled") {
				setTradeGpt(tgRes.value);
			} else {
				setTradeGpt(null);
			}
			setPlanBadgesLoading(false);
		})();

		return () => {
			cancelled = true;
		};
	}, [token]);

	type PlanLabel = PlanProductPlan;

	const mentalShieldSub =
		projectSubs.find((s) => s.project === "mentalshield") ?? null;

	const tradeGptPlan: PlanLabel = !tradeGpt
		? "—"
		: tradeGpt.plan === "pro"
			? "Pro"
			: tradeGpt.trialActive
				? "Trial"
				: "Free";

	const mentalShieldPlan: PlanLabel = !mentalShieldSub
		? "—"
		: mentalShieldSub.paymentMethod === "pro"
			? "Pro"
			: mentalShieldSub.trialActive
				? "Trial"
				: "Free";

	return (
		<Section
			title="Plan & billing"
			icon={<IoCashOutline className="text-lg" />}>
			<div className="flex flex-col items-center justify-center w-full h-full gap-4">
				<div className="flex w-full flex-col items-center gap-4 max-w-5xl">
					{/* Balance (top + highlighted) */}
					<div className="flex items-center gap-2 min-w-0 w-full">
						<p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wide">
							Balance
						</p>
						<p className="text-base font-semibold text-white leading-snug">
							$ {me?.balance ?? "—"}
						</p>
					</div>

					{/* Product + Plan badges (single row) */}
					<div className="w-full">
						<div
							className="flex items-center gap-2 flex-nowrap overflow-x-auto"
							aria-busy={planBadgesLoading}
							aria-label={planBadgesLoading ? "Loading product plans" : undefined}>
							{planBadgesLoading ? (
								<>
									<PlanProductBadgeSkeleton />
									<PlanProductBadgeSkeleton />
									<PlanProductBadgeSkeleton />
								</>
							) : (
								<>
									<PlanProductBadge product="CryptDocker" plan={cryptdockerPlan} />
									<PlanProductBadge product="TradeGPT" plan={tradeGptPlan} />
									<PlanProductBadge product="MentalShield" plan={mentalShieldPlan} />
								</>
							)}
						</div>
					</div>
				</div>

				<div className="rounded-2xl border border-white/10 bg-dark-card/40 p-4 w-full max-w-5xl">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<label className="space-y-1">
							<span className="text-xs font-semibold text-slate-500">
								Payment method
							</span>
							<Select
								value={topUp.method}
								onChange={topUp.onMethodChange}
								disabled={topUp.busy || !!topUp.payment}>
								<option value="usdt-erc20">USDT (ERC-20)</option>
								<option value="usdt-trc20">USDT (TRC-20)</option>
								<option value="usdt-bep20">USDT (BEP-20)</option>
								<option value="usdc-erc20">USDC (ERC-20)</option>
								<option value="usdc-bep20">USDC (BEP-20)</option>
							</Select>
						</label>

						<label className="space-y-1">
							<span className="text-xs font-semibold text-slate-500">
								Amount (USD)
							</span>
							<input
								min={0}
								step={0.01}
								value={topUp.amount}
								onChange={(e) => topUp.onAmountChange(e.target.value)}
								disabled={topUp.busy || !!topUp.payment}
								className={cx(
									"w-full rounded-lg border border-th-border bg-th-input px-3 py-2 text-sm text-th-text outline-none focus:border-teal-500 placeholder:text-slate-500",
									(topUp.busy || !!topUp.payment) &&
										"opacity-60 cursor-not-allowed",
								)}
								placeholder="10"
							/>
							<p className="text-xs text-slate-600">
								Minimum for {topUp.method.toUpperCase()}: ${topUp.minimumAmount}
							</p>
						</label>
					</div>

					<div className="mt-3 flex flex-wrap items-center gap-2">
						<Button
							size="sm"
							onClick={topUp.onPay}
							disabled={topUp.busy || !!topUp.payment}>
							{topUp.busy ? "Creating…" : "Create payment"}
						</Button>
						{topUp.payment && (
							<Button size="sm" variant="outline" onClick={topUp.onReset}>
								New payment
							</Button>
						)}
					</div>

					<div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
						<div className="flex justify-center shrink-0">
							<div className="rounded-xl border border-white/10 bg-dark-card/40 p-3 w-44 h-44 flex items-center justify-center">
								{topUp.payment && qrImageSrc ? (
									<img
										src={qrImageSrc}
										alt="Payment QR code"
										className="w-full h-full object-contain"
									/>
								) : topUp.payment ? (
									<p className="px-2 text-center text-xs text-slate-500 leading-snug">
										QR unavailable — use the deposit address beside this panel.
									</p>
								) : (
									<p className="px-2 text-center text-xs text-slate-500 leading-snug">
										Create a payment to show the QR code here.
									</p>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-2 flex-1 min-w-0">
							{topUp.payment ? (
								<>
									<p className="text-xs font-semibold text-slate-500 mb-1">
										Send {topUp.payment.amount}{" "}
										{topUp.payment.ticker.toLowerCase().includes("usdc")
											? "USDC"
											: "USDT"}{" "}
										to
									</p>
									<div className="flex items-center gap-2">
										<p className="text-xs text-slate-200 break-all flex-1">
											{topUp.payment.addressIn}
										</p>
										<Button
											size="sm"
											variant="outline"
											className=""
											onClick={() =>
												void navigator.clipboard.writeText(
													topUp.payment!.addressIn,
												)
											}
											aria-label="Copy address">
											<IoCopyOutline className="text-base" />
										</Button>
									</div>
									{String(topUp.payment.status).toLowerCase() ===
									"confirmed" ? (
										<div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
											<p className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
												<IoCheckmarkCircleOutline className="text-base" />
												Payment confirmed
											</p>
											<p className="mt-1 text-xs text-emerald-200/90">
												Your balance has been updated successfully.
											</p>
										</div>
									) : (
										<p className="mt-2 text-xs text-slate-600">
											Status:{" "}
											<span className="text-amber-300 font-semibold uppercase tracking-wide">
												{topUp.payment.status ?? "pending"}
											</span>{" "}
											· Waiting for confirmation. This updates automatically.
										</p>
									)}
								</>
							) : (
								<div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2">
									<p className="text-xs font-semibold text-slate-400">
										No active payment
									</p>
									<p className="mt-1 text-xs text-slate-600 leading-relaxed">
										Choose a method and amount, then create a payment. Your
										deposit address, QR code, and live status will appear here.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</Section>
	);
}
