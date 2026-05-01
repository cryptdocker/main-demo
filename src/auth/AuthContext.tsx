import { createContext } from "react";

export type AuthUser = {
	uuid: string;
	email: string;
	fullName?: string;
	avatar?: string;
};

type AuthState = {
	user: AuthUser | null;
	token: string | null;
	signIn: (payload: { user: AuthUser; token: string }) => void;
	signOut: () => void;
};

export const AUTH_STORAGE_KEY = "cryptdocker_auth_v1";

export const AuthContext = createContext<AuthState | null>(null);
