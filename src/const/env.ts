/** Demo bundle — integrations live in `src/demo/mockBackend.ts`. */

export const Env = {
	IS_DEMO: true as const,
	GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined,
};
