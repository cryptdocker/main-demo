export type ClientOS = "Windows" | "macOS" | "Linux";

export function detectOS(): ClientOS {
	const ua = navigator.userAgent;
	if (/Mac/i.test(ua)) return "macOS";
	if (/Linux/i.test(ua)) return "Linux";
	return "Windows";
}