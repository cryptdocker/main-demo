import { apiFetch } from "./api";

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

export type SignInHistory = {
	uuid: string;
	type: "App" | "Web";
	createdAt: string;
	ipAddress?: string | null;
	country?: string | null;
	location?: string | null;
};

export type PaginatedSignInHistory = {
	items: SignInHistory[];
	total: number;
	page: number;
	limit: number;
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
	signInHistory?: SignInHistory[];
};

function authHeaders(token: string): HeadersInit {
	return { Authorization: `Bearer ${token}` };
}

export const userService = {
	getMe: (token: string) => apiFetch<MeResponse>("/user", { headers: authHeaders(token) }),
	getSignInHistory: (
		token: string,
		params: { type: "App" | "Web"; page?: number; limit?: number },
	) => {
		const qs = new URLSearchParams({
			type: params.type,
			page: String(params.page ?? 1),
			limit: String(params.limit ?? 10),
		});
		return apiFetch<PaginatedSignInHistory>(`/user/signin-history?${qs.toString()}`, {
			headers: authHeaders(token),
		});
	},
	updateMe: (token: string, body: Partial<MeResponse> & { uuid: string }) =>
		apiFetch<{ message?: string }>("/user", {
			method: "PUT",
			headers: { ...authHeaders(token) },
			body: JSON.stringify(body),
		}),
	uploadAvatar: async (token: string, body: { uuid: string; file: File }) => {
		const fd = new FormData();
		fd.append("uuid", body.uuid);
		fd.append("avatar", body.file);
		return apiFetch<{ message?: string; avatar?: string }>("/user/avatar", {
			method: "POST",
			headers: authHeaders(token),
			body: fd,
		});
	},
	getFavorites: (token: string) =>
		apiFetch<{ siteIds: string[] }>("/user/favorites", { headers: authHeaders(token) }),
	syncFavorites: (token: string) =>
		apiFetch<unknown>("/user/favorites/sync", { method: "POST", headers: authHeaders(token) }),
	upgradeToPro: (token: string) =>
		apiFetch<{ message?: string; user?: MeResponse }>("/user/upgrade-pro", {
			method: "POST",
			headers: authHeaders(token),
		}),
	cancelProAtPeriodEnd: (token: string) =>
		apiFetch<{ message?: string; user?: MeResponse }>("/user/cancel-pro", {
			method: "POST",
			headers: authHeaders(token),
		}),
};

export const workspaceService = {
	list: (token: string, userUuid: string) =>
		apiFetch<UserWorkspace[]>(`/workspace?userUuid=${encodeURIComponent(userUuid)}`, {
			headers: authHeaders(token),
		}),
	create: (token: string, body: { userUuid: string; name: string }) =>
		apiFetch<UserWorkspace>("/workspace", {
			method: "POST",
			headers: { ...authHeaders(token) },
			body: JSON.stringify(body),
		}),
	delete: (token: string, params: { userUuid: string; uuid: string; deleteSites?: boolean }) => {
		const qs = new URLSearchParams({ userUuid: params.userUuid });
		if (params.deleteSites) qs.set("deleteSites", "true");
		return apiFetch<{ success: boolean }>(`/workspace/${params.uuid}?${qs.toString()}`, {
			method: "DELETE",
			headers: authHeaders(token),
		});
	},
};

export const siteUserService = {
	create: (
		token: string,
		body: { siteUuid: string; userUuid: string; workspaceUuid?: string; endpoint?: string | null },
	) =>
		apiFetch<UserSiteUser>("/site-user", {
			method: "POST",
			headers: { ...authHeaders(token) },
			body: JSON.stringify(body),
		}),
	update: (
		token: string,
		uuid: string,
		body: Partial<Pick<UserSiteUser, "workspaceUuid" | "sortKey" | "title" | "icon" | "notificationEnabled" | "soundEnabled" | "hibernation" | "endpoint">>,
	) =>
		apiFetch<UserSiteUser>(`/site-user/${uuid}`, {
			method: "PATCH",
			headers: { ...authHeaders(token) },
			body: JSON.stringify(body),
		}),
	delete: (token: string, uuid: string) =>
		apiFetch<{ success?: boolean }>(`/site-user/${uuid}`, {
			method: "DELETE",
			headers: authHeaders(token),
		}),
};

