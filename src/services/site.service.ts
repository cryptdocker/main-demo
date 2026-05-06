import { apiFetch } from "./api";

export type Site = {
	uuid: string;
	type?: "native" | "custom" | string;
	title: string | null;
	url?: string | null;
	image?: string | null;
	description?: string | null;
	endpoint?: string | null;
	categories?: Array<{ uuid: string; name: string }>;
};

export const siteService = {
	getAll: (params?: { q?: string; type?: string }) => {
		const qs = new URLSearchParams();
		if (params?.q) qs.set("q", params.q);
		if (params?.type) qs.set("type", params.type);
		const suffix = qs.toString();
		return apiFetch<Site[]>(suffix ? `/site?${suffix}` : "/site");
	},
};

