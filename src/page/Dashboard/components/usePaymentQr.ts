import { useMemo } from "react";
import type { CreatePaymentResult } from "../../../services/payment.service";

/** Placeholder QR (no external QR API) for the demo build. */
export function usePaymentQr(payment: CreatePaymentResult | null): string | null {
	return useMemo(() => {
		if (!payment?.addressIn) return null;
		const line = `${payment.amount} ${payment.ticker}`.replace(/</g, "");
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect fill="#0f172a" width="256" height="256" rx="14"/><rect fill="#0d9488" x="28" y="28" width="84" height="84" rx="6"/><rect fill="#0d9488" x="144" y="28" width="84" height="84" rx="6"/><rect fill="#0d9488" x="28" y="144" width="84" height="84" rx="6"/><rect fill="#14b8a6" x="148" y="148" width="24" height="24"/><rect fill="#14b8a6" x="184" y="148" width="24" height="24"/><rect fill="#14b8a6" x="148" y="184" width="76" height="44" rx="4"/><text x="128" y="122" text-anchor="middle" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="11">Demo payment QR</text><text x="128" y="136" text-anchor="middle" fill="#e2e8f0" font-family="ui-monospace,monospace" font-size="11">${line}</text></svg>`;
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	}, [payment?.addressIn, payment?.amount, payment?.ticker, payment?.uuid]);
}
