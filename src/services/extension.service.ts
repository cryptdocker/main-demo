import { apiFetch } from "./api";

export type Extension = {
	uuid: string;
	label: string;
	id: string;
	category: string;
	downloadUrl?: string | null;
};

function authHeaders(token?: string | null): HeadersInit | undefined {
	if (!token) return undefined;
	return { Authorization: `Bearer ${token}` };
}

export const extensionService = {
	getAll: (token?: string | null) =>
		apiFetch<Extension[]>("/extension", { headers: authHeaders(token) }),

	getInstalled: (params: { userUuid: string; workspaceUuid: string | null; token?: string | null }) => {
		const qs = new URLSearchParams();
		qs.set("userUuid", params.userUuid);
		if (params.workspaceUuid) qs.set("workspaceUuid", params.workspaceUuid);
		return apiFetch<Extension[]>(`/extension/installed?${qs.toString()}`, {
			headers: authHeaders(params.token),
		});
	},

	install: (params: { userUuid: string; extensionUuid: string; workspaceUuid: string | null; token?: string | null }) =>
		apiFetch<{ success?: boolean } | unknown>("/extension/install", {
			method: "POST",
			headers: authHeaders(params.token),
			body: JSON.stringify({
				userUuid: params.userUuid,
				extensionUuid: params.extensionUuid,
				workspaceUuid: params.workspaceUuid,
			}),
		}),

	uninstall: (params: { userUuid: string; extensionUuid: string; workspaceUuid: string | null; token?: string | null }) =>
		apiFetch<{ success: true }>("/extension/uninstall", {
			method: "POST",
			headers: authHeaders(params.token),
			body: JSON.stringify({
				userUuid: params.userUuid,
				extensionUuid: params.extensionUuid,
				workspaceUuid: params.workspaceUuid,
			}),
		}),
};

