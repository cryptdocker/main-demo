import { useMemo } from "react";
import { Button } from "../../../component/Button";
import type { MeResponse } from "../../../services/user.service";
import {
	IoCameraOutline,
	IoFolderOutline,
	IoGlobeOutline,
	IoGridOutline,
	IoMailOutline,
	IoPersonOutline,
	IoPricetagOutline,
	IoRefreshOutline,
	IoSaveOutline,
} from "react-icons/io5";
import { cx, INPUT } from "./shared";
import { Badge, Section, Stat } from "./ui";

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
			title="Account"
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
			<div className="flex flex-col items-center justify-start gap-6 w-full h-full pt-16">
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

				<div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
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
									"w-54 h-54 rounded-2xl bg-white/6 border border-white/10 overflow-hidden flex items-center justify-center",
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

					<div className="flex-1 w-full min-w-0 space-y-3">
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
		</Section>
	);
}
