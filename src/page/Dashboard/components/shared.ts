import type React from "react";

export function fmt(s?: string | null) {
	if (!s) return "—";
	try {
		return new Date(s).toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	} catch {
		return s;
	}
}

export function cx(...c: Array<string | false | null | undefined>) {
	return c.filter(Boolean).join(" ");
}

export const INPUT =
	"w-full rounded-xl bg-dark-card/60 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-teal-500/60 focus:outline-none";

export type PropsWithChildren = { children: React.ReactNode };
