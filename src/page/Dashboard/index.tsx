import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { ApiError } from "../../services/api";
import type { CreatePaymentResult } from "../../services/payment.service";
import { paymentService } from "../../services/payment.service";
import { siteService, type Site } from "../../services/site.service";
import {
	siteUserService,
	userService,
	type MeResponse,
	type UserSiteUser,
	workspaceService,
	type UserWorkspace,
} from "../../services/user.service";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { ErrorBanner } from "./components/ErrorBanner";
import {
	AccountSection,
	AppsSection,
	DevicesSection,
	PlanBillingSection,
	WorkspacesSection,
} from "./components/DashboardSections";

// ─── main component ───────────────────────────────────────────────────────────

export const Dashboard: React.FC = () => {
	const { user, token, signOut } = useAuth();
	const [me, setMe] = useState<MeResponse | null>(null);
	const [workspaces, setWorkspaces] = useState<UserWorkspace[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// profile
	const [savingProfile, setSavingProfile] = useState(false);
	const [profileFullName, setProfileFullName] = useState("");
	const [avatarUploading, setAvatarUploading] = useState(false);

	// apps pagination
	const [appsPage, setAppsPage] = useState(1);
	const PAGE_SIZE = 8;
	const [appsQuery, setAppsQuery] = useState("");

	// add app
	const [addAppOpen, setAddAppOpen] = useState(false);
	const [siteQuery, setSiteQuery] = useState("");
	const [siteCategoryUuid, setSiteCategoryUuid] = useState<string>("all");
	const [sites, setSites] = useState<Site[]>([]);
	const [sitesLoading, setSitesLoading] = useState(false);
	const [addingSiteUuid, setAddingSiteUuid] = useState<string | null>(null);

	// workspaces
	const [workspaceCreating, setWorkspaceCreating] = useState(false);
	const [newWorkspaceName, setNewWorkspaceName] = useState("");

	// apps
	const [rowBusy, setRowBusy] = useState<Record<string, boolean>>({});

	// billing/top-up
	const [topUpOpen, setTopUpOpen] = useState(false);
	const [topUpAmount, setTopUpAmount] = useState("");
	const [topUpMethod, setTopUpMethod] = useState("usdt-erc20");
	const [topUpBusy, setTopUpBusy] = useState(false);
	const [topUpPayment, setTopUpPayment] = useState<CreatePaymentResult | null>(null);

	const authed = useMemo(() => ({ token: token ?? "" }), [token]);

	// ── load ──────────────────────────────────────────────────────────────────

	const loadAll = async () => {
		if (!token) return;
		setLoading(true);
		setError(null);
		try {
			const meRes = await userService.getMe(token);

			setMe(meRes);
			setProfileFullName(meRes.fullName ?? "");

			const wsList = meRes.uuid
				? await workspaceService
						.list(token, meRes.uuid)
						.then((r) => (Array.isArray(r) ? r : []))
				: [];
			setWorkspaces(wsList);
		} catch (e) {
			if (e instanceof ApiError && e.status === 401) {
				signOut();
				return;
			}
			setError(e instanceof Error ? e.message : "Failed to load dashboard.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadAll(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [authed.token]);

	// ── plan helpers ──────────────────────────────────────────────────────────

	const plan = useMemo(() => {
		const isPro = me?.paymentMethod === "pro";
		const trialActive =
			!!me?.trialExpiresAt &&
			new Date(me.trialExpiresAt).getTime() > Date.now();
		const graceActive =
			!!me?.proGraceUntil && new Date(me.proGraceUntil).getTime() > Date.now();
		return { isPro, trialActive, graceActive };
	}, [me]);

	// ── handlers ──────────────────────────────────────────────────────────────

	const saveProfile = async () => {
		if (!token || !me?.uuid) return;
		setSavingProfile(true);
		setError(null);
		try {
			await userService.updateMe(token, {
				uuid: me.uuid,
				fullName: profileFullName.trim() || undefined,
			});
			setMe(await userService.getMe(token));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to update profile.");
		} finally {
			setSavingProfile(false);
		}
	};

	const uploadAvatar = async (file: File) => {
		if (!token || !me?.uuid) return;
		setAvatarUploading(true);
		setError(null);
		try {
			const res = await userService.uploadAvatar(token, {
				uuid: me.uuid,
				file,
			});
			setMe((p) => (p ? { ...p, avatar: res.avatar ?? p.avatar } : p));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to upload photo.");
		} finally {
			setAvatarUploading(false);
		}
	};

	const createWorkspace = async () => {
		if (!token || !me?.uuid) return;
		const name = newWorkspaceName.trim().slice(0, 32);
		if (!name) return;
		setWorkspaceCreating(true);
		setError(null);
		try {
			const ws = await workspaceService.create(token, {
				userUuid: me.uuid,
				name,
			});
			setWorkspaces((p) => [...p, ws]);
			setNewWorkspaceName("");
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to create workspace.");
		} finally {
			setWorkspaceCreating(false);
		}
	};

	const deleteWorkspace = async (uuid: string) => {
		if (!token || !me?.uuid) return;
		if (
			!confirm("Delete this workspace? Apps assigned to it will move to Root.")
		)
			return;
		setError(null);
		try {
			await workspaceService.delete(token, { userUuid: me.uuid, uuid });
			setWorkspaces((p) => p.filter((w) => w.uuid !== uuid));
			await loadAll();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to delete workspace.");
		}
	};

	const patchSiteUser = async (
		uuid: string,
		body: Parameters<typeof siteUserService.update>[2],
	) => {
		if (!token) return;
		setRowBusy((p) => ({ ...p, [uuid]: true }));
		setError(null);
		try {
			const updated = await siteUserService.update(token, uuid, body);
			setMe((p) => {
				if (!p) return p;
				return {
					...p,
					siteUsers: (p.siteUsers ?? []).map((su) =>
						su.uuid === uuid ? { ...su, ...updated } : su,
					),
				};
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to update app.");
		} finally {
			setRowBusy((p) => ({ ...p, [uuid]: false }));
		}
	};

	const removeSiteUser = async (uuid: string) => {
		if (!token) return;
		if (!confirm("Remove this app from your account?")) return;
		setRowBusy((p) => ({ ...p, [uuid]: true }));
		setError(null);
		try {
			await siteUserService.delete(token, uuid);
			setMe((p) =>
				p
					? {
							...p,
							siteUsers: (p.siteUsers ?? []).filter((su) => su.uuid !== uuid),
						}
					: p,
			);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to remove app.");
		} finally {
			setRowBusy((p) => ({ ...p, [uuid]: false }));
		}
	};

	const upgrade = async () => {
		if (!token) return;
		setError(null);
		try {
			const res = await userService.upgradeToPro(token);
			if (res.user) setMe(res.user);
			else await loadAll();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Upgrade failed.");
		}
	};

	const cancelPro = async () => {
		if (!token) return;
		if (!confirm("Cancel Pro at the end of this billing period?")) return;
		setError(null);
		try {
			const res = await userService.cancelProAtPeriodEnd(token);
			if (res.user) setMe(res.user);
			else await loadAll();
		} catch (e) {
			setError(
				e instanceof Error ? e.message : "Could not schedule cancellation.",
			);
		}
	};

	const startTopUp = async () => {
		if (!me?.uuid) return;
		const amt = Number(topUpAmount);
		if (!Number.isFinite(amt) || amt <= 0) {
			setError("Enter a valid top up amount.");
			return;
		}
		setError(null);
		setTopUpBusy(true);
		try {
			const p = await paymentService.createPayment({
				userUuid: me.uuid,
				amount: amt,
				ticker: topUpMethod,
			});
			setTopUpPayment(p);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to create payment.");
		} finally {
			setTopUpBusy(false);
		}
	};

	useEffect(() => {
		if (!topUpPayment?.uuid) return;
		let cancelled = false;
		const interval = setInterval(async () => {
			try {
				const s = await paymentService.getPaymentStatus(topUpPayment.uuid);
				if (cancelled) return;
				if (String(s.status).toLowerCase() === "confirmed") {
					clearInterval(interval);
					setTopUpPayment(null);
					setTopUpOpen(false);
					setTopUpAmount("");
					await loadAll();
				}
			} catch {
				// ignore transient poll failures
			}
		}, 5000);
		return () => {
			cancelled = true;
			clearInterval(interval);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [topUpPayment?.uuid]);

	// ── derived ───────────────────────────────────────────────────────────────

	const siteUsers = useMemo(() => {
		return (me?.siteUsers ?? [])
			.slice()
			.filter((su) => su.site !== null)
			.sort((a, b) => (a.sortKey ?? 0) - (b.sortKey ?? 0));
	}, [me]);

	const siteUsersFiltered = useMemo(() => {
		const q = appsQuery.trim().toLowerCase();
		if (!q) return siteUsers;
		return siteUsers.filter((su) => {
			const title = (su.title ?? su.site?.title ?? "").toLowerCase();
			const url = (su.site?.url ?? "").toLowerCase();
			return title.includes(q) || url.includes(q);
		});
	}, [appsQuery, siteUsers]);

	const appsTotal = siteUsersFiltered.length;
	const appsTotalPages = Math.max(1, Math.ceil(appsTotal / PAGE_SIZE));
	const appsPageClamped = Math.min(Math.max(1, appsPage), appsTotalPages);

	useEffect(() => {
		if (appsPage > appsTotalPages) setAppsPage(appsTotalPages);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appsTotalPages]);

	const appsSlice = useMemo(() => {
		const start = (appsPageClamped - 1) * PAGE_SIZE;
		return siteUsersFiltered.slice(start, start + PAGE_SIZE);
	}, [siteUsersFiltered, appsPageClamped]);

	const siteUsersByWorkspace = useMemo(() => {
		const map: Record<string, UserSiteUser[]> = { root: [] };
		workspaces.forEach((w) => {
			map[w.uuid] = [];
		});
		(me?.siteUsers ?? []).forEach((su) => {
			const key = su.workspaceUuid ?? "root";
			(map[key] ??= []).push(su);
		});
		Object.values(map).forEach((rows) =>
			rows.sort((a, b) => (a.sortKey ?? 0) - (b.sortKey ?? 0)),
		);
		return map;
	}, [me, workspaces]);

	useEffect(() => {
		if (!addAppOpen) return;
		setSiteCategoryUuid("all");
		let cancelled = false;
		setSitesLoading(true);
		siteService
			.getAll()
			.then((r) => {
				if (!cancelled) setSites(Array.isArray(r) ? r : []);
			})
			.catch(() => {
				if (!cancelled) setSites([]);
			})
			.finally(() => {
				if (!cancelled) setSitesLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [addAppOpen]);

	const addApp = async (args: {
		siteUuid: string;
		workspaceUuid?: string;
		endpoint?: string | null;
	}) => {
		if (!token || !me?.uuid) return;
		setError(null);
		setAddingSiteUuid(args.siteUuid);
		try {
			await siteUserService.create(token, {
				siteUuid: args.siteUuid,
				userUuid: me.uuid,
				workspaceUuid: args.workspaceUuid,
				endpoint: args.endpoint ?? "/",
			});
			await loadAll();
			setAddAppOpen(false);
			setSiteQuery("");
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to add app.");
		} finally {
			setAddingSiteUuid(null);
		}
	};

	if (!user) return null;

	// ── render ────────────────────────────────────────────────────────────────

	return (
		<div className="max-w-5xl mx-auto px-5 py-12">
			<DashboardHeader loading={loading} onRefresh={loadAll} />

			<ErrorBanner error={error} onDismiss={() => setError(null)} />

			{loading ? (
				<DashboardSkeleton />
			) : (
				<div className="space-y-5">
					{/* ── row 1: account + billing ── */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<AccountSection
							me={me}
							profileFullName={profileFullName}
							setProfileFullName={setProfileFullName}
							savingProfile={savingProfile}
							onSaveProfile={saveProfile}
							onResetProfile={() => setProfileFullName(me?.fullName ?? "")}
							onLogout={signOut}
							avatarUploading={avatarUploading}
							onUploadAvatar={uploadAvatar}
						/>

						<PlanBillingSection
							me={me}
							plan={plan}
							onUpgrade={upgrade}
							onCancelPro={cancelPro}
							topUp={{
								open: topUpOpen,
								onToggle: () => setTopUpOpen((p) => !p),
								amount: topUpAmount,
								onAmountChange: setTopUpAmount,
								method: topUpMethod,
								onMethodChange: setTopUpMethod,
								busy: topUpBusy,
								payment: topUpPayment,
								onPay: startTopUp,
								onReset: () => {
									setTopUpPayment(null);
									setTopUpAmount("");
								},
							}}
						/>
					</div>

					{/* ── apps ── */}
					<AppsSection
						appsTotal={appsTotal}
						appsSlice={appsSlice}
						workspaces={workspaces}
						rowBusy={rowBusy}
						onPatchSiteUser={patchSiteUser}
						onRemoveSiteUser={removeSiteUser}
						search={{
							value: appsQuery,
							onChange: setAppsQuery,
						}}
						addApp={{
							open: addAppOpen,
							onToggle: () => setAddAppOpen((p) => !p),
							query: siteQuery,
							onQueryChange: setSiteQuery,
							categoryUuid: siteCategoryUuid,
							onCategoryChange: setSiteCategoryUuid,
							sites,
							loading: sitesLoading,
							addingSiteUuid,
							onAdd: addApp,
							workspaces,
						}}
						pagination={{
							pageSize: PAGE_SIZE,
							page: appsPageClamped,
							totalPages: appsTotalPages,
							onPrev: () => setAppsPage((p) => p - 1),
							onNext: () => setAppsPage((p) => p + 1),
							showingStart: (appsPageClamped - 1) * PAGE_SIZE + 1,
							showingEnd: Math.min(appsPageClamped * PAGE_SIZE, appsTotal),
						}}
					/>

					{/* ── row 3: workspaces + devices ── */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<WorkspacesSection
							workspaces={workspaces}
							newWorkspaceName={newWorkspaceName}
							setNewWorkspaceName={setNewWorkspaceName}
							workspaceCreating={workspaceCreating}
							onCreateWorkspace={createWorkspace}
							onDeleteWorkspace={deleteWorkspace}
							siteUsersByWorkspace={siteUsersByWorkspace}
						/>

						<DevicesSection me={me} />
					</div>
				</div>
			)}
		</div>
	);
};
