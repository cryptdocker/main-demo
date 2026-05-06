import { useCallback, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./Button";
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
		setLoading(true);
		try {
			// Demo site: Google auth is mocked (no external script/popup/network).
			await new Promise((r) => setTimeout(r, 350));
			await onCode("mock-google-oauth-code");
		} catch (e) {
			onError?.(e instanceof Error ? e.message : "Google sign-in failed.");
		} finally {
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
			<span>{loading ? "Signing in..." : label}</span>
		</Button>
	);
};
