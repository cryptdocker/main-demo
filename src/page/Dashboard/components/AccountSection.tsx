import { useCallback, useMemo, useState } from "react";
import { Button } from "../../../component/Button";
import type { MeResponse } from "../../../services/user.service";
import {
	IoCameraOutline,
	IoFolderOutline,
	IoGlobeOutline,
	IoGridOutline,
	IoKeyOutline,
	IoMailOutline,
	IoPersonOutline,
	IoPricetagOutline,
	IoRefreshOutline,
	IoSaveOutline,
} from "react-icons/io5";
import { cx, INPUT } from "./shared";
import { Badge, Section, Stat } from "./ui";
import { Modal } from "./Modal";
import { useAuth } from "../../../auth/useAuth";
import { authService } from "../../../services";

export function AccountSection({
	me,
	profileFullName,
	setProfileFullName,
	savingProfile,
	onSaveProfile,
	onResetProfile,
	avatarUploading,
	onUploadAvatar,
	catalogSiteCount,
	catalogCategoryCount,
}: {
	me: MeResponse | null;
	profileFullName: string;
	setProfileFullName: (v: string) => void;
	savingProfile: boolean;
	onSaveProfile: () => void;
	onResetProfile: () => void;
	avatarUploading: boolean;
	onUploadAvatar: (file: File) => void;
	catalogSiteCount: number | null;
	catalogCategoryCount: number | null;
}) {
	const { token } = useAuth();
	const isEmailUser = String(me?.authProvider ?? "").toLowerCase() === "email";

	const [pwOpen, setPwOpen] = useState(false);
	const [pwBusy, setPwBusy] = useState(false);
	const [pwError, setPwError] = useState<string | null>(null);
	const [pwSuccess, setPwSuccess] = useState<string | null>(null);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const resetPwForm = useCallback(() => {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setPwError(null);
	}, []);

	const openPw = useCallback(() => {
		setPwSuccess(null);
		resetPwForm();
		setPwOpen(true);
	}, [resetPwForm]);

	const closePw = useCallback(() => {
		if (pwBusy) return;
		setPwOpen(false);
		resetPwForm();
	}, [pwBusy, resetPwForm]);

	const canSubmitPw =
		!!token &&
		currentPassword.length > 0 &&
		newPassword.length > 0 &&
		confirmPassword.length > 0 &&
		newPassword === confirmPassword;

	const submitPw = useCallback(async () => {
		if (!token || !canSubmitPw) return;
		setPwError(null);
		setPwBusy(true);
		try {
			const res = await authService.changePassword({
				token,
				currentPassword,
				newPassword,
				confirmPassword,
			});
			setPwSuccess(res.message || "Password changed successfully.");
			setPwOpen(false);
			resetPwForm();
		} catch (e) {
			setPwError(e instanceof Error ? e.message : "Failed to change password.");
		} finally {
			setPwBusy(false);
		}
	}, [token, canSubmitPw, currentPassword, newPassword, confirmPassword, resetPwForm]);

	const stats = useMemo(() => {
		const siteUsers = me?.siteUsers ?? [];
		const totalApps = siteUsers.filter(
			(su) => su.siteUuid != null && su.site != null,
		).length;
		const workspaceCount = new Set(
			siteUsers
				.map((su) => su.workspaceUuid ?? su.workspace?.uuid ?? null)
				.filter(Boolean),
		).size;
		return { totalApps, workspaceCount };
	}, [me?.siteUsers]);

	return (
		<Section
			title="Credential"
			icon={<IoPersonOutline className="text-lg" />}
			badge={
				<div className="flex items-center gap-1.5">
					{me?.authProvider?.toLowerCase() === "email" &&
						(me?.emailVerified ? (
							<Badge variant="good">Verified</Badge>
						) : (
							<Badge variant="warn">Unverified</Badge>
						))}
					<Badge>
						{me?.authProvider?.toLowerCase() === "google"
							? "Google"
							: (me?.authProvider ?? "—").toUpperCase()}
					</Badge>
				</div>
			}>
			<div className="flex flex-col items-center justify-start gap-6 w-full h-full">
				{pwSuccess && (
					<div className="w-full max-w-5xl rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
						{pwSuccess}
					</div>
				)}
				<div className="flex flex-col items-center text-center w-full">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-5xl">
						<Stat
							icon={<IoGridOutline className="text-sm" />}
							label="Entire Apps"
							value={catalogSiteCount ?? "—"}
						/>
						<Stat
							icon={<IoPricetagOutline className="text-sm" />}
							label="Categories"
							value={catalogCategoryCount ?? "—"}
						/>
						<Stat
							icon={<IoGlobeOutline className="text-sm" />}
							label="My Apps"
							value={stats.totalApps}
						/>
						<Stat
							icon={<IoFolderOutline className="text-sm" />}
							label="My Workspaces"
							value={stats.workspaceCount}
						/>
					</div>
				</div>

				<div className="w-full h-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
					<div className="shrink-0 flex flex-col items-center gap-3">
						<label className="group relative block">
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={(e) => {
									const f = e.target.files?.[0];
									if (f) onUploadAvatar(f);
									e.currentTarget.value = "";
								}}
								disabled={avatarUploading}
							/>
							<div
								className={cx(
									"w-40 h-40 rounded-2xl bg-white/6 border border-white/10 overflow-hidden flex items-center justify-center",
									!avatarUploading && "cursor-pointer",
									avatarUploading && "opacity-70 cursor-not-allowed",
								)}>
								{me?.avatar ? (
									<img
										src={me.avatar}
										alt=""
										className="w-full h-full object-cover"
									/>
								) : (
									<span className="text-2xl font-bold text-slate-200">
										{(me?.fullName || me?.email || "U")
											.trim()
											.slice(0, 1)
											.toUpperCase()}
									</span>
								)}
							</div>
							<div
								className={cx(
									"pointer-events-none absolute inset-0 rounded-2xl bg-black/55 opacity-0 transition-opacity",
									!avatarUploading && "group-hover:opacity-100",
								)}
							/>
							<div
								className={cx(
									"pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity",
									!avatarUploading && "group-hover:opacity-100",
								)}>
								<span className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xl font-semibold text-slate-100">
									<IoCameraOutline size={64} />
								</span>
							</div>
						</label>
					</div>

					<div className="w-full h-full flex flex-col justify-between gap-3">
						<div className="w-full flex flex-col gap-3">
							<div className="space-y-1">
								<label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
									<IoMailOutline className="text-sm" />
									Email
								</label>
								<input
									value={me?.email ?? ""}
									disabled
									className={cx(INPUT, "text-slate-500 cursor-not-allowed")}
								/>
							</div>

							<div className="space-y-1">
								<label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
									<IoPersonOutline className="text-sm" />
									Display name
								</label>
								<input
									value={profileFullName}
									onChange={(e) => setProfileFullName(e.target.value)}
									className={INPUT}
									placeholder="Your name"
								/>
							</div>

							{isEmailUser && (
								<div className="space-y-1">
									<label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
										<IoKeyOutline className="text-sm" />
										Password
									</label>
									<div className="flex items-center gap-2">
										<Button size="sm" variant="outline" onClick={openPw}>
											Change Password
										</Button>
									</div>
								</div>
							)}
						</div>

						<div className="flex items-center justify-end gap-2 pt-1">
							<Button
								size="sm"
								variant="outline"
								onClick={onResetProfile}
								disabled={savingProfile}>
								<span className="inline-flex items-center gap-1.5">
									<IoRefreshOutline className="text-base" />
									Reset
								</span>
							</Button>
							<Button
								size="sm"
								onClick={onSaveProfile}
								disabled={savingProfile || !me?.uuid}>
								<span className="inline-flex items-center gap-1.5">
									<IoSaveOutline className="text-base" />
									{savingProfile ? "Saving…" : "Save"}
								</span>
							</Button>
						</div>
					</div>
				</div>
			</div>

			<Modal open={pwOpen} title="Change password" onClose={closePw}>
				<div className="space-y-3">
					<div className="space-y-1.5">
						<label className="text-sm text-slate-300" htmlFor="dashboard-current-password">
							Current password
						</label>
						<input
							id="dashboard-current-password"
							type="password"
							autoComplete="current-password"
							className="w-full rounded-xl bg-dark-card/60 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/60 focus:ring-0"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							disabled={pwBusy}
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-sm text-slate-300" htmlFor="dashboard-new-password">
							New password
						</label>
						<input
							id="dashboard-new-password"
							type="password"
							autoComplete="new-password"
							className="w-full rounded-xl bg-dark-card/60 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/60 focus:ring-0"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							disabled={pwBusy}
						/>
					</div>
					<div className="space-y-1.5">
						<label className="text-sm text-slate-300" htmlFor="dashboard-confirm-password">
							Confirm new password
						</label>
						<input
							id="dashboard-confirm-password"
							type="password"
							autoComplete="new-password"
							className="w-full rounded-xl bg-dark-card/60 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/60 focus:ring-0"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							disabled={pwBusy}
						/>
						{confirmPassword.length > 0 && newPassword !== confirmPassword && (
							<p className="text-xs text-red-200">Passwords do not match.</p>
						)}
					</div>

					{pwError && (
						<div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
							{pwError}
						</div>
					)}

					<div className="flex items-center justify-end gap-2 pt-2">
						<Button variant="outline" onClick={closePw} disabled={pwBusy}>
							Cancel
						</Button>
						<Button onClick={() => void submitPw()} disabled={pwBusy || !canSubmitPw}>
							{pwBusy ? "Saving…" : "Update password"}
						</Button>
					</div>
				</div>
			</Modal>
		</Section>
	);
}
