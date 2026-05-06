import { apiFetch } from "./api";

export type MainUser = {
	uuid: string;
	email: string;
	fullName?: string;
	avatar?: string;
};

type UserResponse = MainUser & { onboarded?: string | boolean };

function normalizeUser(u: UserResponse): MainUser {
	return {
		uuid: u.uuid,
		email: u.email,
		fullName: u.fullName,
		avatar: u.avatar,
	};
}

export async function loginWithEmail(params: {
	email: string;
	password: string;
}): Promise<{ user: MainUser; token: string }> {
	const res = await apiFetch<{ user: UserResponse; token: string }>("/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email: params.email.trim(),
			password: params.password,
		}),
	});
	return { user: normalizeUser(res.user), token: res.token };
}

export async function registerWithEmail(params: {
	email: string;
	password: string;
	fullName?: string;
}): Promise<{ user: MainUser; requiresVerification: true } | { user: MainUser; token: string }> {
	const res = await apiFetch<{
		user: UserResponse;
		token?: string;
		requiresVerification?: boolean;
	}>("/auth/register", {
		method: "POST",
		body: JSON.stringify({
			email: params.email.trim(),
			password: params.password,
			fullName: params.fullName?.trim() || undefined,
		}),
	});
	if (res.requiresVerification) {
		return { user: normalizeUser(res.user), requiresVerification: true };
	}
	if (!res.token) throw new Error("Failed to create account.");
	return { user: normalizeUser(res.user), token: res.token };
}

export async function loginWithGoogleIdToken(params: {
	idToken: string;
}): Promise<{ user: MainUser; token: string }> {
	const res = await apiFetch<{ user: UserResponse; token: string }>("/auth/google", {
		method: "POST",
		body: JSON.stringify({ idToken: params.idToken }),
	});
	return { user: normalizeUser(res.user), token: res.token };
}

export async function loginWithGoogleCode(params: {
	code: string;
}): Promise<{ user: MainUser; token: string }> {
	const res = await apiFetch<{ user: UserResponse; token: string }>("/auth/google/code", {
		method: "POST",
		body: JSON.stringify({ code: params.code }),
	});
	return { user: normalizeUser(res.user), token: res.token };
}

