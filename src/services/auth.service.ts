import {
	demoDelay,
	applyEmailSignIn,
	applyGoogleSignIn,
	DEMO_SESSION_TOKEN,
	snapshotMe,
} from "../demo/mockBackend";

export type MainUser = {
	uuid: string;
	email: string;
	fullName?: string;
	avatar?: string;
};

async function finalizeSession(): Promise<{ user: MainUser; token: string }> {
	await demoDelay(240);
	const u = snapshotMe();
	return {
		user: {
			uuid: u.uuid,
			email: u.email,
			fullName: u.fullName,
			avatar: u.avatar,
		},
		token: DEMO_SESSION_TOKEN,
	};
}

export async function loginWithEmail(params: {
	email: string;
	password: string;
}): Promise<{ user: MainUser; token: string }> {
	await demoDelay();
	void params.password;
	applyEmailSignIn(params.email);
	return finalizeSession();
}

export async function registerWithEmail(params: {
	email: string;
	password: string;
	fullName?: string;
}): Promise<{ user: MainUser; requiresVerification: true } | { user: MainUser; token: string }> {
	await demoDelay();
	void params.password;
	applyEmailSignIn(params.email, params.fullName);
	return finalizeSession();
}

export async function loginWithGoogleIdToken(params: {
	idToken: string;
}): Promise<{ user: MainUser; token: string }> {
	await demoDelay();
	void params.idToken;
	applyGoogleSignIn();
	return finalizeSession();
}

export async function loginWithGoogleCode(params: {
	code: string;
}): Promise<{ user: MainUser; token: string }> {
	await demoDelay();
	void params.code;
	applyGoogleSignIn();
	return finalizeSession();
}
