import { useMemo } from "react";
import type { CreatePaymentResult } from "../../../services/payment.service";

export function usePaymentQr(payment: CreatePaymentResult | null): string | null {
	return useMemo(() => {
		if (!payment?.addressIn || !payment?.ticker) return null;
		const label = `${payment.ticker.toUpperCase()} checkout (demo)`;
		const address = payment.addressIn;

		// Demo QR: local SVG placeholder (no network requests).
		const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="24" fill="#0b1220"/>
  <rect x="20" y="20" width="216" height="216" rx="18" fill="#0f172a" stroke="#1f2937" stroke-width="2"/>
  <text x="128" y="92" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI" font-size="14" fill="#5eead4" text-anchor="middle">${label}</text>
  <text x="128" y="130" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas" font-size="12" fill="#cbd5e1" text-anchor="middle">${address.slice(0, 8)}…${address.slice(-6)}</text>
  <text x="128" y="166" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI" font-size="12" fill="#94a3b8" text-anchor="middle">Mock QR (no backend)</text>
  <g opacity="0.25">
    <rect x="52" y="188" width="18" height="18" fill="#22c55e"/>
    <rect x="76" y="188" width="18" height="18" fill="#22c55e"/>
    <rect x="100" y="188" width="18" height="18" fill="#22c55e"/>
    <rect x="136" y="188" width="18" height="18" fill="#22c55e"/>
    <rect x="160" y="188" width="18" height="18" fill="#22c55e"/>
    <rect x="184" y="188" width="18" height="18" fill="#22c55e"/>
  </g>
</svg>`;

		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	}, [payment?.addressIn, payment?.ticker]);
}

