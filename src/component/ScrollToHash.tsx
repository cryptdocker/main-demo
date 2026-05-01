import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const ScrollToHash: React.FC = () => {
	const { pathname, hash } = useLocation();

	useEffect(() => {
		const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";

		if (hash) {
			const raw = hash.slice(1);
			const id = raw ? decodeURIComponent(raw) : "";
			if (!id) return;

			let attempts = 0;
			const maxAttempts = 48;
			const tick = () => {
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView({ behavior, block: "start" });
					return true;
				}
				return false;
			};

			if (tick()) return;

			const interval = window.setInterval(() => {
				attempts += 1;
				if (tick() || attempts >= maxAttempts) {
					window.clearInterval(interval);
				}
			}, 50);

			return () => window.clearInterval(interval);
		}

		window.scrollTo({ top: 0, left: 0, behavior });
	}, [pathname, hash]);

	return null;
};
