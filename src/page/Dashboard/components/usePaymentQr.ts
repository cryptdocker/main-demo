import { useEffect, useMemo, useRef, useState } from "react";
import type { CreatePaymentResult } from "../../../services/payment.service";

export function usePaymentQr(payment: CreatePaymentResult | null): string | null {
	const [qrImageSrc, setQrImageSrc] = useState<string | null>(null);
	const qrObjectUrlRef = useRef<string | null>(null);

	const qrFetchUrl = useMemo(() => {
		if (!payment?.addressIn || !payment?.ticker) return null;
		const params = new URLSearchParams({
			address: payment.addressIn,
			size: "256",
		});
		return `https://api.cryptapi.io/${payment.ticker}/qrcode/?${params.toString()}`;
	}, [payment?.addressIn, payment?.ticker]);

	useEffect(() => {
		if (!qrFetchUrl) {
			setQrImageSrc(null);
			return;
		}
		let cancelled = false;
		fetch(qrFetchUrl)
			.then((res) =>
				res.ok ? res.blob() : Promise.reject(new Error("QR fetch failed")),
			)
			.then((blob) => blob.text())
			.then((data) => {
				if (cancelled) return;
				const json = JSON.parse(data) as { qr_code?: string };
				if (!json.qr_code) {
					setQrImageSrc(null);
					return;
				}
				setQrImageSrc(`data:image/png;base64,${json.qr_code}`);
			})
			.catch(() => {
				if (!cancelled) setQrImageSrc(null);
			});
		return () => {
			cancelled = true;
			if (qrObjectUrlRef.current) {
				URL.revokeObjectURL(qrObjectUrlRef.current);
				qrObjectUrlRef.current = null;
			}
			setQrImageSrc(null);
		};
	}, [qrFetchUrl]);

	return qrImageSrc;
}

