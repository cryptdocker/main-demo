import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { PATH } from "../const";

export function RequireAuth({ children }: { children: ReactNode }) {
	const { user, token } = useAuth();
	const location = useLocation();
	if (!user || !token) {
		return (
			<Navigate
				to={PATH.SIGN_IN}
				state={{ from: location.pathname, backgroundLocation: location }}
			/>
		);
	}
	return <>{children}</>;
}

