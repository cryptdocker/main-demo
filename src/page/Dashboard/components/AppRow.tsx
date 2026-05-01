import { useEffect, useState } from "react";
import {
	IoBriefcaseOutline,
	IoMoonOutline,
	IoNotificationsOutline,
	IoOpenOutline,
	IoTrashOutline,
	IoVolumeHighOutline,
} from "react-icons/io5";
import { Button } from "../../../component/Button";
import type { siteUserService } from "../../../services/user.service";
import type {
	UserSiteUser,
	UserWorkspace,
} from "../../../services/user.service";
import { cx } from "./shared";
import { Select, ToggleControl } from "./ui";

export function AppRow({
	row,
	workspaces,
	busy,
	onPatch,
	onRemove,
}: {
	row: UserSiteUser;
	workspaces: UserWorkspace[];
	busy: boolean;
	onPatch: (body: Parameters<typeof siteUserService.update>[2]) => void;
	onRemove: () => void;
}) {
	const displayTitle = row.title || row.site?.title || "Untitled app";
	const currentWorkspace = workspaces.find((w) => w.uuid === row.workspaceUuid);
	const [draftHibernation, setDraftHibernation] = useState<number>(
		row.hibernation ?? 0,
	);
	const [iconFailed, setIconFailed] = useState(false);

	useEffect(() => {
		setDraftHibernation(row.hibernation ?? 0);
	}, [row.hibernation]);

	useEffect(() => {
		setIconFailed(false);
	}, [row.icon, row.site?.image]);

	return (
		<div
			className={cx(
				"rounded-2xl border border-white/10 bg-white/3 p-4 transition-opacity",
				busy && "opacity-60",
			)}>
			<div className="flex items-center gap-3 mb-3">
				<div className="w-9 h-9 rounded-xl bg-dark-card/60 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
					{!iconFailed && row.icon ? (
						<img
							src={row.icon}
							alt=""
							className="w-full h-full object-cover"
							onError={() => setIconFailed(true)}
						/>
					) : !iconFailed && row.site?.image ? (
						<img
							src={row.site.image}
							alt=""
							className="w-full h-full object-cover"
							onError={() => setIconFailed(true)}
						/>
					) : (
						<span className="text-sm font-bold text-slate-300">
							{String(displayTitle).trim().slice(0, 1).toUpperCase()}
						</span>
					)}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-semibold text-white truncate">
						{displayTitle}
					</p>
					<p className="text-xs text-slate-500 truncate">
						{currentWorkspace ? currentWorkspace.name : "Root"}
						{row.site?.url ? ` · ${row.site.url}` : ""}
					</p>
				</div>
				<div className="flex items-center gap-2">
					{row.site?.url && (
						<a
							href={row.site.url}
							target="_blank"
							rel="noreferrer"
							aria-label="Open app URL"
						>
							<Button
								size="sm"
								variant="outline"
								disabled={busy}
								className="px-2 py-2"
							>
								<IoOpenOutline className="text-base" />
							</Button>
						</a>
					)}
					<Button
						size="sm"
						variant="outline"
						onClick={onRemove}
						disabled={busy}
						className="px-2 py-2"
						aria-label="Remove app"
					>
						<IoTrashOutline className="text-base" />
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
				<ToggleControl
					label="Notify"
					icon={<IoNotificationsOutline className="text-sm" />}
					checked={!!row.notificationEnabled}
					disabled={busy}
					onChange={(v) => onPatch({ notificationEnabled: v })}
				/>
				<ToggleControl
					label="Sound"
					icon={<IoVolumeHighOutline className="text-sm" />}
					checked={!!row.soundEnabled}
					disabled={busy}
					onChange={(v) => onPatch({ soundEnabled: v })}
				/>

				<label className="col-span-2 sm:col-span-2 flex items-center gap-2 rounded-xl border border-white/10 bg-dark-card/40 px-3 py-2">
					<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 shrink-0">
						<IoMoonOutline className="text-sm" />
						Sleep (min)
					</span>
					<input
						min={0}
						step={1}
						value={Number.isFinite(draftHibernation) ? draftHibernation : 0}
						onChange={(e) => {
							const raw = e.target.value;
							setDraftHibernation(raw === "" ? 0 : Number(raw));
						}}
						onBlur={() => {
							const next = Math.max(
								0,
								Number.isFinite(draftHibernation) ? draftHibernation : 0,
							);
							if (next !== (row.hibernation ?? 0))
								onPatch({ hibernation: next });
						}}
						disabled={busy}
						className="w-full bg-transparent text-xs text-slate-100 focus:outline-none"
					/>
				</label>
			</div>

			<label className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-dark-card/40 px-3 py-2">
				<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 shrink-0">
					<IoBriefcaseOutline className="text-sm" />
					Workspace
				</span>
				<Select
					value={row.workspaceUuid ?? ""}
					onChange={(v) => onPatch({ workspaceUuid: v || null })}
					disabled={busy}
				>
					<option value="">Root</option>
					{workspaces.map((w) => (
						<option key={w.uuid} value={w.uuid}>
							{w.name}
						</option>
					))}
				</Select>
			</label>
		</div>
	);
}

