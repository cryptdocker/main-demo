import { PATH } from "../const";

export type AuthLocationState = { from?: string };

/** Returns a safe in-app path from router location state, or `fallback`. */
export function resolvePostAuthRedirect(state: unknown, fallback: string = PATH.HOME): string {
	if (!state || typeof state !== "object") return fallback;
	const from = (state as AuthLocationState).from;
	if (typeof from !== "string" || !from.startsWith("/") || from.startsWith("//")) return fallback;
	return from;
}
