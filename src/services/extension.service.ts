import { demoDelay } from "../demo/mockBackend";

export type Extension = {
	uuid: string;
	label: string;
	id: string;
	category: string;
	downloadUrl?: string | null;
};

const DEMO_EXTENSIONS: Extension[] = [
	{
		uuid: "ext-1",
		label: "Ad blocker (demo)",
		id: "demo-adblock",
		category: "Privacy",
		downloadUrl: null,
	},
	{
		uuid: "ext-2",
		label: "Password helper (demo)",
		id: "demo-pass",
		category: "Security",
		downloadUrl: null,
	},
];

export const extensionService = {
	getAll: async (_token?: string | null) => {
		await demoDelay();
		return [...DEMO_EXTENSIONS];
	},

	getInstalled: async (params: { userUuid: string; workspaceUuid: string | null; token?: string | null }) => {
		await demoDelay();
		void params;
		return [] as Extension[];
	},

	install: async (params: { userUuid: string; extensionUuid: string; workspaceUuid: string | null; token?: string | null }) => {
		await demoDelay();
		void params;
		return { success: true };
	},

	uninstall: async (params: { userUuid: string; extensionUuid: string; workspaceUuid: string | null; token?: string | null }) => {
		await demoDelay();
		void params;
		return { success: true as const };
	},
};
