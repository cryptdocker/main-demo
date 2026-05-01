import { Button } from "../../../component/Button";
import type { siteUserService } from "../../../services/user.service";
import type {
	MeResponse,
	UserSiteUser,
	UserWorkspace,
} from "../../../services/user.service";
import {
	IoAddOutline,
	IoBriefcaseOutline,
	IoCameraOutline,
	IoCalendarOutline,
	IoCashOutline,
	IoCloseCircleOutline,
	IoCopyOutline,
	IoSearchOutline,
	IoHourglassOutline,
	IoLogOutOutline,
	IoMailOutline,
	IoPersonOutline,
	IoRefreshOutline,
	IoSaveOutline,
	IoSparklesOutline,
	IoTrashOutline,
	IoWalletOutline,
} from "react-icons/io5";
import { AppRow } from "./AppRow";
import { AddAppModal } from "./AddAppModal";
import { cx, fmt, INPUT } from "./shared";
import { Badge, Section, Select, Stat } from "./ui";
import type { CreatePaymentResult } from "../../../services/payment.service";
import { usePaymentQr } from "./usePaymentQr";

export function AccountSection({
	me,
	profileFullName,
	setProfileFullName,
	savingProfile,
	onSaveProfile,
	onResetProfile,
	onLogout,
	avatarUploading,
	onUploadAvatar,
}: {
	me: MeResponse | null;
	profileFullName: string;
	setProfileFullName: (v: string) => void;
	savingProfile: boolean;
	onSaveProfile: () => void;
	onResetProfile: () => void;
	onLogout: () => void;
	avatarUploading: boolean;
	onUploadAvatar: (file: File) => void;
}) {
	return (
		<Section
			title="Account"
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
			<div className="flex gap-5">
				<div className="shrink-0 flex flex-col items-center gap-2">
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
								"w-16 h-16 rounded-2xl bg-white/6 border border-white/10 overflow-hidden flex items-center justify-center",
								!avatarUploading && "cursor-pointer",
								avatarUploading && "opacity-70 cursor-not-allowed",
							)}
						>
							{me?.avatar ? (
								<img
									src={me.avatar}
									alt=""
									className="w-full h-full object-cover"
								/>
							) : (
								<span className="text-lg font-bold text-slate-200">
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
							)}
						>
							<span className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-100">
								<IoCameraOutline className="text-sm" />
							</span>
						</div>
					</label>
				</div>

				<div className="flex-1 min-w-0 space-y-3">
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
					<div className="flex items-center gap-2 pt-1">
						<Button
							size="sm"
							onClick={onSaveProfile}
							disabled={savingProfile || !me?.uuid}>
							<span className="inline-flex items-center gap-1.5">
								<IoSaveOutline className="text-base" />
								{savingProfile ? "Saving…" : "Save"}
							</span>
						</Button>
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
						<Button size="sm" variant="ghost" onClick={onLogout}>
							<span className="inline-flex items-center gap-1.5">
								<IoLogOutOutline className="text-base" />
								Log out
							</span>
						</Button>
					</div>
				</div>
			</div>
		</Section>
	);
}

export function PlanBillingSection({
	me,
	plan,
	onUpgrade,
	onCancelPro,
	topUp,
}: {
	me: MeResponse | null;
	plan: { isPro: boolean; trialActive: boolean; graceActive: boolean };
	onUpgrade: () => void;
	onCancelPro: () => void;
	topUp: {
		open: boolean;
		onToggle: () => void;
		amount: string;
		onAmountChange: (v: string) => void;
		method: string;
		onMethodChange: (v: string) => void;
		busy: boolean;
		payment: CreatePaymentResult | null;
		onPay: () => void;
		onReset: () => void;
	};
}) {
	const qrImageSrc = usePaymentQr(topUp.payment);

	return (
		<Section
			title="Plan & billing"
			badge={
				plan.isPro ? (
					<Badge variant="good">Pro</Badge>
				) : plan.trialActive ? (
					<Badge variant="warn">Trial</Badge>
				) : (
					<Badge>Free</Badge>
				)
			}>
			<div className="grid grid-cols-2 gap-3 mb-4">
				<Stat
					label="Balance"
					icon={<IoCashOutline className="text-sm" />}
					value={me?.balance ?? "—"}
				/>
				{plan.isPro && (
					<Stat
						label="Next billing"
						icon={<IoCalendarOutline className="text-sm" />}
						value={fmt(me?.billingDate)}
					/>
				)}
				{plan.trialActive && (
					<Stat
						label="Trial ends"
						icon={<IoHourglassOutline className="text-sm" />}
						value={fmt(me?.trialExpiresAt)}
					/>
				)}
				{plan.graceActive && (
					<Stat
						label="Grace period"
						icon={<IoHourglassOutline className="text-sm" />}
						value={fmt(me?.proGraceUntil)}
					/>
				)}
			</div>

			<div className="flex flex-wrap gap-2">
				<Button size="sm" variant="outline" onClick={topUp.onToggle}>
					<span className="inline-flex items-center gap-1.5">
						<IoWalletOutline className="text-base" />
						Top up
					</span>
				</Button>
				{plan.isPro ? (
					me?.proCancelAtPeriodEnd ? (
						<Badge variant="warn">
							<span className="inline-flex items-center gap-1.5">
								<IoHourglassOutline className="text-sm" />
								Cancellation scheduled
							</span>
						</Badge>
					) : (
						<Button size="sm" variant="outline" onClick={onCancelPro}>
							<span className="inline-flex items-center gap-1.5">
								<IoCloseCircleOutline className="text-base" />
								Cancel at period end
							</span>
						</Button>
					)
				) : (
					<Button size="sm" onClick={onUpgrade}>
						<span className="inline-flex items-center gap-1.5">
							<IoSparklesOutline className="text-base" />
							Upgrade to Pro
						</span>
					</Button>
				)}
			</div>

			{topUp.open && (
				<div className="mt-4 rounded-2xl border border-white/10 bg-dark-card/40 p-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<label className="space-y-1">
							<span className="text-xs font-semibold text-slate-500">
								Payment method
							</span>
							<div className={cx(INPUT, "flex items-center gap-2 pr-3")}>
								<Select
									value={topUp.method}
									onChange={topUp.onMethodChange}
									disabled={topUp.busy || !!topUp.payment}
								>
									<option value="usdt-erc20">USDT (ERC-20)</option>
									<option value="usdt-trc20">USDT (TRC-20)</option>
									<option value="usdt-bep20">USDT (BEP-20)</option>
									<option value="usdc-erc20">USDC (ERC-20)</option>
									<option value="usdc-bep20">USDC (BEP-20)</option>
								</Select>
							</div>
						</label>

						<label className="space-y-1">
							<span className="text-xs font-semibold text-slate-500">
								Amount (USD)
							</span>
							<input
								min={0}
								step={0.01}
								value={topUp.amount}
								onChange={(e) => topUp.onAmountChange(e.target.value)}
								disabled={topUp.busy || !!topUp.payment}
								className={INPUT}
								placeholder="10"
							/>
						</label>
					</div>

					<div className="mt-3 flex flex-wrap items-center gap-2">
						<Button
							size="sm"
							onClick={topUp.onPay}
							disabled={topUp.busy || !!topUp.payment}
						>
							{topUp.busy ? "Creating…" : "Create payment"}
						</Button>
						{topUp.payment && (
							<Button size="sm" variant="outline" onClick={topUp.onReset}>
								New payment
							</Button>
						)}
					</div>

					{topUp.payment && (
						<div className="mt-4 rounded-xl border border-white/10 bg-white/3 px-4 py-3">
							{qrImageSrc && (
								<div className="mb-3 flex justify-center">
									<div className="rounded-xl border border-white/10 bg-dark-card/40 p-3">
										<img
											src={qrImageSrc}
											alt="Payment QR code"
											className="w-44 h-44"
										/>
									</div>
								</div>
							)}
							<p className="text-xs font-semibold text-slate-500 mb-1">
								Send {topUp.payment.amount}{" "}
								{topUp.payment.ticker.toLowerCase().includes("usdc")
									? "USDC"
									: "USDT"}{" "}
								to
							</p>
							<div className="flex items-center gap-2">
								<p className="text-xs text-slate-200 break-all flex-1">
									{topUp.payment.addressIn}
								</p>
								<Button
									size="sm"
									variant="outline"
									className=""
									onClick={() =>
										void navigator.clipboard.writeText(topUp.payment!.addressIn)
									}
									aria-label="Copy address"
								>
									<IoCopyOutline className="text-base" />
								</Button>
							</div>
							<p className="mt-2 text-xs text-slate-600">
								Status:{" "}
								<span className="text-slate-300 font-medium">
									{topUp.payment.status ?? "pending"}
								</span>{" "}
								· This will auto-refresh when confirmed.
							</p>
						</div>
					)}
				</div>
			)}
		</Section>
	);
}

export function AppsSection({
	appsTotal,
	appsSlice,
	workspaces,
	rowBusy,
	onPatchSiteUser,
	onRemoveSiteUser,
	search,
	addApp,
	pagination,
}: {
	appsTotal: number;
	appsSlice: UserSiteUser[];
	workspaces: UserWorkspace[];
	rowBusy: Record<string, boolean>;
	onPatchSiteUser: (uuid: string, body: Parameters<typeof siteUserService.update>[2]) => void;
	onRemoveSiteUser: (uuid: string) => void;
	search: { value: string; onChange: (v: string) => void };
	addApp: {
		open: boolean;
		onToggle: () => void;
		query: string;
		onQueryChange: (v: string) => void;
		categoryUuid: string;
		onCategoryChange: (v: string) => void;
		sites: Array<{
			uuid: string;
			title: string | null;
			url?: string | null;
			image?: string | null;
			categories?: Array<{ uuid: string; name: string }>;
			description?: string | null;
			endpoint?: string | null;
		}>;
		loading: boolean;
		addingSiteUuid: string | null;
		workspaces: UserWorkspace[];
		onAdd: (args: { siteUuid: string; workspaceUuid?: string; endpoint?: string | null }) => void;
	};
	pagination: {
		pageSize: number;
		page: number;
		totalPages: number;
		onPrev: () => void;
		onNext: () => void;
		showingStart: number;
		showingEnd: number;
	};
}) {
	return (
		<Section
			title={`Apps${appsTotal > 0 ? ` (${appsTotal})` : ""}`}
			subtitle="Notifications, sound, sleep, and workspace for each app.">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
				<div className={cx(INPUT, "flex items-center gap-2 sm:max-w-sm")}>
					<IoSearchOutline className="text-slate-500" />
					<input
						value={search.value}
						onChange={(e) => search.onChange(e.target.value)}
						placeholder="Search apps…"
						className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
					/>
				</div>
				<Button size="sm" variant="outline" onClick={addApp.onToggle}>
					<span className="inline-flex items-center gap-1.5">
						<IoAddOutline className="text-base" />
						Add app
					</span>
				</Button>
			</div>

			<AddAppModal
				open={addApp.open}
				onClose={addApp.onToggle}
				sites={addApp.sites}
				loading={addApp.loading}
				workspaces={addApp.workspaces}
				addingSiteUuid={addApp.addingSiteUuid}
				onAdd={addApp.onAdd}
			/>

			{appsTotal === 0 ? (
				<p className="text-sm text-slate-500 py-2">
					No apps yet. Add apps in CryptDocker to see them here.
				</p>
			) : (
				<>
					<div className="space-y-3 mb-4">
						{appsSlice.map((su) => (
							<AppRow
								key={su.uuid}
								row={su}
								workspaces={workspaces}
								busy={!!rowBusy[su.uuid]}
								onPatch={(body) => onPatchSiteUser(su.uuid, body)}
								onRemove={() => onRemoveSiteUser(su.uuid)}
							/>
						))}
					</div>

					{pagination.totalPages > 1 && (
						<div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
							<p className="text-xs text-slate-500">
								Showing{" "}
								<span className="text-slate-300 font-medium">
									{pagination.showingStart}–{pagination.showingEnd}
								</span>{" "}
								of{" "}
								<span className="text-slate-300 font-medium">{appsTotal}</span>
								<span className="text-slate-600">
									{" "}
									· Page {pagination.page} / {pagination.totalPages}
								</span>
							</p>
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant="outline"
									disabled={pagination.page <= 1}
									onClick={pagination.onPrev}>
									Previous
								</Button>
								<Button
									size="sm"
									variant="outline"
									disabled={pagination.page >= pagination.totalPages}
									onClick={pagination.onNext}>
									Next
								</Button>
							</div>
						</div>
					)}
				</>
			)}
		</Section>
	);
}

export function WorkspacesSection({
	workspaces,
	newWorkspaceName,
	setNewWorkspaceName,
	workspaceCreating,
	onCreateWorkspace,
	onDeleteWorkspace,
	siteUsersByWorkspace,
}: {
	workspaces: UserWorkspace[];
	newWorkspaceName: string;
	setNewWorkspaceName: (v: string) => void;
	workspaceCreating: boolean;
	onCreateWorkspace: () => void;
	onDeleteWorkspace: (uuid: string) => void;
	siteUsersByWorkspace: Record<string, UserSiteUser[]>;
}) {
	return (
		<Section title="Workspaces" subtitle="Separate identities, strategies, or exchanges.">
			<div className="mb-4">
				<label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
					<IoBriefcaseOutline className="text-sm" />
					New workspace
				</label>
				<div className="flex gap-2">
					<input
						value={newWorkspaceName}
						onChange={(e) => setNewWorkspaceName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") onCreateWorkspace();
						}}
						maxLength={32}
						className={cx(INPUT, "flex-1")}
						placeholder="Workspace name"
					/>
					<Button
						size="sm"
						onClick={onCreateWorkspace}
						disabled={workspaceCreating || !newWorkspaceName.trim()}>
						<span className="inline-flex items-center gap-1.5">
							<IoAddOutline className="text-base" />
							{workspaceCreating ? "…" : "Create"}
						</span>
					</Button>
				</div>
			</div>
			<div className="space-y-2">
				{workspaces.length === 0 ? (
					<p className="text-sm text-slate-500">No workspaces yet.</p>
				) : (
					workspaces.map((w) => (
						<div
							key={w.uuid}
							className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-dark-card/40 px-4 py-3">
							<div className="min-w-0 flex items-start gap-2">
								<div className="mt-0.5 text-slate-500 shrink-0">
									<IoBriefcaseOutline className="text-base" />
								</div>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-slate-200 truncate">
										{w.name}
									</p>
								<p className="text-xs text-slate-600 truncate">
									{(siteUsersByWorkspace[w.uuid] ?? []).length} app
									{(siteUsersByWorkspace[w.uuid] ?? []).length !== 1 ? "s" : ""}
								</p>
								</div>
							</div>
							<Button
								size="sm"
								variant="outline"
								onClick={() => onDeleteWorkspace(w.uuid)}>
								<span className="inline-flex items-center gap-1.5">
									<IoTrashOutline className="text-base" />
									Delete
								</span>
							</Button>
						</div>
					))
				)}
			</div>
		</Section>
	);
}

export function DevicesSection({ me }: { me: MeResponse | null }) {
	return (
		<Section
			title="Devices"
			subtitle="Devices linked to your account for sign-in protection."
			badge={<Badge>{(me?.userDevices ?? []).length}</Badge>}>
			<div className="space-y-2">
				{(me?.userDevices ?? []).length === 0 ? (
					<p className="text-sm text-slate-500">No linked devices.</p>
				) : (
					(me?.userDevices ?? []).map((d) => (
						<div
							key={d.deviceUuid}
							className="rounded-xl border border-white/10 bg-dark-card/40 px-4 py-3">
							<div className="flex items-center justify-between gap-2 mb-0.5">
								<p className="text-sm font-semibold text-slate-200 truncate min-w-0">
									{d.device.deviceId}
								</p>
								{d.activate ? (
									<Badge variant="good">Active</Badge>
								) : (
									<Badge>Inactive</Badge>
								)}
							</div>
							<p className="text-xs text-slate-600 truncate">
								{[
									d.device.country,
									d.device.location,
									d.device.ipAddress,
								]
									.filter(Boolean)
									.join(" · ") || "Unknown location"}
							</p>
						</div>
					))
				)}
			</div>
		</Section>
	);
}

