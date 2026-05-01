import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoLockClosedOutline, IoLogInOutline, IoPersonAddOutline, IoArrowBackOutline } from "react-icons/io5";
import { PATH } from "../const";
import { Button } from "./Button";
import { Modal } from "./Modal";

export function SignInCtaModal({
	open,
	onClose,
	title = "Sign in required",
	message = "Sign in to use Analysis Tools and unlock full results.",
}: {
	open: boolean;
	onClose: () => void;
	title?: string;
	message?: string;
}) {
	const location = useLocation();
	const navigate = useNavigate();

	// If the user is already on sign-in/up routes, don't trap them.
	useEffect(() => {
		if (!open) return;
		if (location.pathname === PATH.SIGN_IN || location.pathname === PATH.SIGN_UP) {
			onClose();
		}
	}, [open, location.pathname, onClose]);

	const goSignIn = () => {
		onClose();
		navigate(PATH.SIGN_IN, {
			state: { from: location.pathname, backgroundLocation: location },
		});
	};

	const goSignUp = () => {
		onClose();
		navigate(PATH.SIGN_UP, {
			state: { from: location.pathname, backgroundLocation: location },
		});
	};

	const notNow = () => {
		onClose();
		navigate("/");
	};

	return (
		<Modal open={open} title={title} onClose={onClose} closeOnOverlayClick={false} closeButton={false}>
			<div className="flex items-start gap-3">
				<div className="shrink-0 w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
					<IoLockClosedOutline className="w-5 h-5 text-teal-300" />
				</div>
				<div className="min-w-0">
					<p className="text-sm text-slate-300 leading-relaxed">{message}</p>
					<p className="mt-2 text-xs text-slate-500">
						We’ll bring you back to this page after signing in.
					</p>
				</div>
			</div>

			<div className="mt-5 flex flex-col-reverse sm:flex-row gap-2 sm:items-center">
				<Button variant="ghost" type="button" size="sm" onClick={notNow} className="sm:mr-auto">
					<IoArrowBackOutline className="w-4 h-4" />
					Not Now
				</Button>
				<Button variant="outline" type="button" onClick={goSignUp}>
					<IoPersonAddOutline className="w-4 h-4" />
					Sign Up for Free
				</Button>
				<Button type="button" onClick={goSignIn}>
					<IoLogInOutline className="w-4 h-4" />
					Sign in
				</Button>
			</div>
		</Modal>
	);
}

