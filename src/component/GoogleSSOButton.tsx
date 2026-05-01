import { useCallback, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./Button";
import { Env } from "../const";
import { loadGoogleIdentityScript } from "../auth/googleScript";
type Props = {
	label: string;
	disabled?: boolean;
	onCode: (code: string) => Promise<void> | void;
	onError?: (message: string) => void;
};
export const GoogleSSOButton: React.FC<Props> = ({
	label,
	disabled,
	onCode,
	onError,
}) => {
	const [loading, setLoading] = useState(false);

	const handleClick = useCallback(async () => {
		if (disabled || loading) return;

		if (Env.IS_DEMO) {
			setLoading(true);
			try {
				// Simulate Google popup latency; backend auth is mocked in auth.service (code ignored).
				await new Promise<void>((resolve) => setTimeout(resolve, 420));
				await onCode("demo-google-oauth-code");
			} catch (e) {
				onError?.(e instanceof Error ? e.message : "Google sign-in failed.");
			} finally {
				setLoading(false);
			}
			return;
		}

		if (!Env.GOOGLE_CLIENT_ID) {
			onError?.("Google Client ID is not configured.");
			return;
		}
		setLoading(true);
		try {
			await loadGoogleIdentityScript();
			const oauth2 = window.google?.accounts?.oauth2;
			if (!oauth2?.initCodeClient)
				throw new Error("Google OAuth is not available.");
			const client = oauth2.initCodeClient({
				client_id: Env.GOOGLE_CLIENT_ID,
				scope: "openid email profile",
				ux_mode: "popup",
				callback: async (resp) => {
					try {
						if (!resp.code)
							throw new Error(resp.error || "Google did not return a code.");
						await onCode(resp.code);
					} catch (e) {
						onError?.(
							e instanceof Error ? e.message : "Google sign-in failed.",
						);
					} finally {
						setLoading(false);
					}
				},
				error_callback: () => {
					onError?.("Google sign-in failed.");
					setLoading(false);
				},
			});

			client.requestCode();
		} catch (e) {
			onError?.(e instanceof Error ? e.message : "Google sign-in failed.");
			setLoading(false);
		}
	}, [disabled, loading, onCode, onError]);
	return (
		<Button
			type="button"
			variant="outline"
			size="md"
			className="w-full justify-center gap-2"
			disabled={disabled || loading}
			onClick={handleClick}>
			<FcGoogle className="w-5 h-5" aria-hidden />
			<span>
				{loading
					? Env.IS_DEMO
						? "Signing in…"
						: "Opening Google..."
					: label}
			</span>
		</Button>
	);
};
