import { Link, useNavigate } from "react-router-dom";
import { Button } from "../component/Button";
import { GoogleSSOButton } from "../component/GoogleSSOButton";
import { PATH } from "../const";
import { authService } from "../services";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";

export const SignUp: React.FC = () => {
	const { signIn } = useAuth();
	const navigate = useNavigate();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const res = await authService.registerWithEmail({ email, password, fullName });
			if (!("token" in res)) {
				setError("Check your email for a verification code, then sign in.");
				return;
			}
			signIn(res);
			navigate(PATH.HOME);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create account.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-xl mx-auto px-6 py-20">
			<div className="glass-strong rounded-2xl p-8">
				<h1 className="text-2xl font-bold text-white">Create account</h1>
				<p className="text-slate-400 mt-2">
					Already have an account?{" "}
					<Link className="text-teal-300 hover:text-teal-200 underline" to={PATH.SIGN_IN}>
						Sign in
					</Link>
				</p>

				{error && (
					<div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					<div className="space-y-1.5">
						<label className="text-sm text-slate-300" htmlFor="fullName">
							Full name (optional)
						</label>
						<input
							id="fullName"
							type="text"
							autoComplete="name"
							className="w-full rounded-xl bg-dark-card/60 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/60 focus:ring-0"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							disabled={loading}
							placeholder="Satoshi Nakamoto"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-sm text-slate-300" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							className="w-full rounded-xl bg-dark-card/60 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/60 focus:ring-0"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
							placeholder="you@example.com"
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-sm text-slate-300" htmlFor="password">
							Password
						</label>
						<input
							id="password"
							type="password"
							autoComplete="new-password"
							className="w-full rounded-xl bg-dark-card/60 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/60 focus:ring-0"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
							placeholder="••••••••"
						/>
					</div>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Creating..." : "Create account"}
					</Button>
				</form>

				<div className="my-6 flex items-center gap-3">
					<div className="h-px flex-1 bg-white/8" />
					<span className="text-xs text-slate-500">or</span>
					<div className="h-px flex-1 bg-white/8" />
				</div>

				<div className="flex justify-center">
					<div className="w-full">
						<GoogleSSOButton
							label="Sign up with Google"
							disabled={loading}
							onError={(m) => setError(m)}
							onCode={async (code) => {
								setError(null);
								setLoading(true);
								const res = await authService.loginWithGoogleCode({ code });
								signIn(res);
								navigate(PATH.HOME);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

