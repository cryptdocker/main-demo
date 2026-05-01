import { demoDelay, listCatalogSites } from "../demo/mockBackend";

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
	getAll: async (params?: { q?: string; type?: string }) => {
		await demoDelay();
		return listCatalogSites(params);
	},
};
