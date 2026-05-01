let loadPromise: Promise<void> | null = null;
export function loadGoogleIdentityScript(): Promise<void> {
	if (typeof window === "undefined") return Promise.resolve();
	if (window.google?.accounts?.oauth2) return Promise.resolve();
	if (loadPromise) return loadPromise;
	loadPromise = new Promise<void>((resolve, reject) => {
		const existing = document.querySelector<HTMLScriptElement>(
			'script[src="https://accounts.google.com/gsi/client"]',
		);
		if (existing) {
			existing.addEventListener("load", () => resolve(), { once: true });
			existing.addEventListener(
				"error",
				() => reject(new Error("Failed to load Google script")),
				{
					once: true,
				},
			);
			return;
		}
		const s = document.createElement("script");
		s.src = "https://accounts.google.com/gsi/client";
		s.async = true;
		s.defer = true;
		s.onload = () => resolve();
		s.onerror = () => reject(new Error("Failed to load Google script"));
		document.head.appendChild(s);
	});
	return loadPromise;
}
