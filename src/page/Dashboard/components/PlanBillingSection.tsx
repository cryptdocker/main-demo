import { Button } from "../../../component/Button";
import type { MeResponse } from "../../../services/user.service";
import {
	IoCashOutline,
	IoCheckmarkCircleOutline,
	IoCopyOutline,
	IoHourglassOutline,
	IoPricetagOutline,
} from "react-icons/io5";
import { cx, fmt } from "./shared";
import { Badge, Section, Select, Stat } from "./ui";
import type { CreatePaymentResult } from "../../../services/payment.service";
import { usePaymentQr } from "./usePaymentQr";

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

	return (
		<Section
			title="Plan & billing"
			icon={<IoCashOutline className="text-lg" />}>
			<div className="flex flex-col items-center justify-center w-full h-full gap-4">
				<div className="flex w-full items-center gap-4 max-w-3xl">
					<div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
						<div className="flex items-center gap-2 min-w-0">
							<p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
								<span className="text-slate-500/90">
									<IoCashOutline className="text-sm" />
								</span>
								Balance
							</p>
							<p className="text-base font-semibold text-white leading-snug">
								$ {me?.balance ?? "—"}
							</p>
						</div>
					</div>

					<div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 h-12 flex items-center gap-2">
						<p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
							<span className="text-slate-500/90">
								<IoPricetagOutline className="text-sm" />
							</span>
							Current plan
						</p>
						<div className="flex flex-wrap items-center gap-2">
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
						</div>
					</div>
					{plan.trialActive && (
						<Stat
							label="Trial ends"
							icon={<IoHourglassOutline className="text-sm" />}
							value={fmt(me?.trialExpiresAt)}
						/>
					)}
					{plan.graceActive && (
						<Stat
							label="Grace period"
							icon={<IoHourglassOutline className="text-sm" />}
							value={fmt(me?.proGraceUntil)}
						/>
					)}
				</div>

				<div className="rounded-2xl border border-white/10 bg-dark-card/40 p-4 w-full max-w-3xl">
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
