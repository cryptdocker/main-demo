import { createContext } from "react";

export type AuthUser = {
	uuid: string;
	email: string;
	fullName?: string;
	avatar?: string;
};

/** Fields mirrored in session storage / navbar; keep in sync after profile or avatar API updates. */
export type AuthUserPatch = Partial<Pick<AuthUser, "fullName" | "avatar">>;

type AuthState = {
	user: AuthUser | null;
	token: string | null;
	signIn: (payload: { user: AuthUser; token: string }) => void;
	signOut: () => void;
	updateUser: (patch: AuthUserPatch) => void;
};

export const AUTH_STORAGE_KEY = "cryptdocker_auth_v1";

export const AuthContext = createContext<AuthState | null>(null);
