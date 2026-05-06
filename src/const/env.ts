export const Env = {
	API_URL:
		(import.meta.env.VITE_API_URL as string | undefined) ||
		"https://api.cryptdocker.com/api",
	GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined,
	DASHBOARD_URL:
		(import.meta.env.VITE_DASHBOARD_URL as string | undefined) ||
		"https://app.cryptdocker.com",
};
