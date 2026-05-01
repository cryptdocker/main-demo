import {
	assertDemoToken,
	demoDelay,
	mockCreateWorkspace,
	mockDeleteWorkspace,
	mockSiteUserCreate,
	mockUploadAvatar,
	setDemoAvatar,
	snapshotMe,
	snapshotWorkspaces,
	updateProfileFullName,
	patchWorkspaceMeSiteUser,
	removeSiteUser,
	upgradeDemoToPro,
	cancelProDemo,
} from "../demo/mockBackend";

export type UserSite = {
	uuid: string;
	title: string | null;
	url?: string | null;
	image?: string | null;
};

export type UserWorkspace = {
	uuid: string;
	name: string;
	color?: string | null;
	placeholderSortKey?: number | null;
};

export type UserSiteUser = {
	uuid: string;
	siteUuid: string | null;
	sortKey: number;
	workspaceUuid?: string | null;
	title: string | null;
	icon: string | null;
	notificationEnabled: boolean;
	soundEnabled: boolean;
	hibernation: number;
	endpoint: string | null;
	site?: UserSite | null;
	workspace?: Pick<UserWorkspace, "uuid" | "name"> | null;
};

export type UserDevice = {
	userUuid: string;
	deviceUuid: string;
	activate: boolean;
	device: {
		uuid: string;
		deviceId: string;
		ipAddress?: string | null;
		country?: string | null;
		location?: string | null;
	};
};

export type MeResponse = {
	uuid: string;
	email: string;
	fullName?: string;
	avatar?: string;
	role: string;
	authProvider: string;
	emailVerified: boolean;
	walletAddress?: string;
	newsKeywords?: string | null;
	balance?: number | string;
	paymentMethod?: "free" | "pro";
	billingDate?: string | null;
	trialExpiresAt?: string | null;
	proGraceUntil?: string | null;
	proCancelAtPeriodEnd?: boolean;
	siteUsers?: UserSiteUser[];
	userDevices?: UserDevice[];
};

export const userService = {
	getMe: async (token: string) => {
		await demoDelay();
		assertDemoToken(token);
		return snapshotMe();
	},
	updateMe: async (
		token: string,
		body: Partial<MeResponse> & { uuid: string },
	) => {
		await demoDelay();
		assertDemoToken(token);
		if (body.fullName !== undefined) updateProfileFullName(body.fullName);
		return { message: "Saved (demo)." };
	},
	uploadAvatar: async (token: string, body: { uuid: string; file: File }) => {
		assertDemoToken(token);
		void body.uuid;
		const url = await mockUploadAvatar(body.file);
		setDemoAvatar(url);
		return { message: "OK (demo).", avatar: url };
	},
	getFavorites: async (token: string) => {
		await demoDelay();
		assertDemoToken(token);
		return { siteIds: [] as string[] };
	},
	syncFavorites: async (token: string) => {
		await demoDelay();
		assertDemoToken(token);
		return {};
	},
	upgradeToPro: async (token: string) => {
		await demoDelay();
		assertDemoToken(token);
		upgradeDemoToPro();
		return { message: "Upgraded (demo).", user: snapshotMe() };
	},
	cancelProAtPeriodEnd: async (token: string) => {
		await demoDelay();
		assertDemoToken(token);
		cancelProDemo();
		return { message: "Cancellation scheduled (demo).", user: snapshotMe() };
	},
};

export const workspaceService = {
	list: async (token: string, userUuid: string) => {
		await demoDelay();
		assertDemoToken(token);
		void userUuid;
		return snapshotWorkspaces();
	},
	create: async (token: string, body: { userUuid: string; name: string }) => {
		assertDemoToken(token);
		return mockCreateWorkspace(body.name, body.userUuid);
	},
	delete: async (
		token: string,
		params: { userUuid: string; uuid: string; deleteSites?: boolean },
	) => {
		assertDemoToken(token);
		void params.userUuid;
		void params.deleteSites;
		await mockDeleteWorkspace(params.uuid);
		return { success: true };
	},
};

export const siteUserService = {
	create: async (
		token: string,
		body: { siteUuid: string; userUuid: string; workspaceUuid?: string; endpoint?: string | null },
	) => {
		assertDemoToken(token);
		return mockSiteUserCreate(body);
	},
	update: async (
		token: string,
		uuid: string,
		body: Partial<
			Pick<
				UserSiteUser,
				| "workspaceUuid"
				| "sortKey"
				| "title"
				| "icon"
				| "notificationEnabled"
				| "soundEnabled"
				| "hibernation"
				| "endpoint"
			>
		>,
	) => {
		await demoDelay();
		assertDemoToken(token);
		return patchWorkspaceMeSiteUser(uuid, body);
	},
	delete: async (token: string, uuid: string) => {
		await demoDelay();
		assertDemoToken(token);
		removeSiteUser(uuid);
		return { success: true };
	},
};
