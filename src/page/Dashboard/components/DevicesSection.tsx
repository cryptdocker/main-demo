import { useEffect, useState } from "react";
import {
	userService,
	type SignInHistory,
} from "../../../services/user.service";
import { useAuth } from "../../../auth/useAuth";
import { Badge, Section } from "./ui";
import {
	IoChevronBackOutline,
	IoChevronDownOutline,
	IoChevronForwardOutline,
	IoDesktopOutline,
	IoGlobeOutline,
} from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

function fmtTime(s: string) {
	try {
		return new Date(s).toLocaleString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return s;
	}
}

function HistoryTable({
	title,
	icon,
	items,
	loading,
	page,
	limit,
	total,
	expanded,
	onToggle,
	onPrev,
	onNext,
}: {
	title: string;
	icon: React.ReactNode;
	items: SignInHistory[];
	loading: boolean;
	page: number;
	limit: number;
	total: number;
	expanded: boolean;
	onToggle: () => void;
	onPrev: () => void;
	onNext: () => void;
}) {
	const maxPage = Math.max(1, Math.ceil(total / Math.max(1, limit)));

	const body = loading ? (
		<p className="flex-1 min-h-0 px-4 py-3 text-sm text-slate-500 overflow-auto">
			Loading…
		</p>
	) : items.length === 0 ? (
		<p className="flex-1 min-h-0 px-4 py-3 text-sm text-slate-500 overflow-auto">
			No history.
		</p>
	) : (
		<div className="flex-1 min-h-0 overflow-auto">
			<table className="w-full text-left text-sm">
				<thead className="text-xs uppercase tracking-wide text-slate-500 bg-black/10">
					<tr>
						<th className="px-4 py-2.5 font-semibold">TimeStamp</th>
						<th className="px-4 py-2.5 font-semibold">IP</th>
						<th className="px-4 py-2.5 font-semibold">Location</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-white/8">
					{items.map((h) => (
						<tr key={h.uuid} className="text-slate-200">
							<td className="px-4 py-2.5 whitespace-nowrap">
								{fmtTime(h.createdAt)}
							</td>
							<td className="px-4 py-2.5 whitespace-nowrap text-slate-300">
								{h.ipAddress || "—"}
							</td>
							<td className="px-4 py-2.5 min-w-0">
								<span className="text-slate-300">
									{[h.country, h.location].filter(Boolean).join(" · ") ||
										"Unknown"}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);

	return (
		<div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
			<div className="w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-white/8">
				<button
					type="button"
					onClick={onToggle}
					aria-expanded={expanded}
					className="flex-1 min-w-0 inline-flex items-center gap-2 text-sm font-semibold text-slate-200 text-left"
				>
					<span className="text-slate-400">{icon}</span>
					<span className="truncate">{title}</span>
					<IoChevronDownOutline
						className={`ml-auto shrink-0 text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
					/>
				</button>

				{expanded && (
					<div className="shrink-0 inline-flex items-center gap-2">
						<Badge>
							{total} total · Page {page}/{maxPage}
						</Badge>
						<button
							type="button"
							onClick={onPrev}
							disabled={loading || page <= 1}
							aria-label="Previous page"
							className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-dark-card/40 text-slate-200 disabled:opacity-50"
						>
							<IoChevronBackOutline />
						</button>
						<button
							type="button"
							onClick={onNext}
							disabled={loading || page >= maxPage}
							aria-label="Next page"
							className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-dark-card/40 text-slate-200 disabled:opacity-50"
						>
							<IoChevronForwardOutline />
						</button>
					</div>
				)}
			</div>

			<AnimatePresence initial={false}>
				{expanded && (
					<motion.div
						key="content"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.22, ease: "easeInOut" }}
						className="overflow-hidden"
					>
						<div className="h-[360px] min-h-0 flex flex-col">{body}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export function DevicesSection() {
	const { token } = useAuth();
	const [open, setOpen] = useState<"web" | "app">("web");

	const [webPage, setWebPage] = useState(1);
	const [appPage, setAppPage] = useState(1);
	const limit = 10;

	const [web, setWeb] = useState<{ items: SignInHistory[]; total: number }>({
		items: [],
		total: 0,
	});
	const [app, setApp] = useState<{ items: SignInHistory[]; total: number }>({
		items: [],
		total: 0,
	});
	const [loadingWeb, setLoadingWeb] = useState(false);
	const [loadingApp, setLoadingApp] = useState(false);

	useEffect(() => {
		if (!token) return;
		let cancelled = false;
		setLoadingWeb(true);
		userService
			.getSignInHistory(token, { type: "Web", page: webPage, limit })
			.then((r) => {
				if (cancelled) return;
				setWeb({ items: r.items ?? [], total: r.total ?? 0 });
			})
			.catch(() => {
				if (cancelled) return;
				setWeb({ items: [], total: 0 });
			})
			.finally(() => {
				if (cancelled) return;
				setLoadingWeb(false);
			});
		return () => {
			cancelled = true;
		};
	}, [token, webPage]);

	useEffect(() => {
		if (!token) return;
		let cancelled = false;
		setLoadingApp(true);
		userService
			.getSignInHistory(token, { type: "App", page: appPage, limit })
			.then((r) => {
				if (cancelled) return;
				setApp({ items: r.items ?? [], total: r.total ?? 0 });
			})
			.catch(() => {
				if (cancelled) return;
				setApp({ items: [], total: 0 });
			})
			.finally(() => {
				if (cancelled) return;
				setLoadingApp(false);
			});
		return () => {
			cancelled = true;
		};
	}, [token, appPage]);

	return (
		<Section
			title="Sign In History"
			icon={<IoGlobeOutline className="text-lg" />}
			subtitle="Web and App sign-ins, with server-side pagination.">
			<div className="h-full min-h-0 flex flex-col gap-4">
				<HistoryTable
					title="Web History"
					icon={<IoGlobeOutline />}
					items={web.items}
					loading={loadingWeb}
					page={webPage}
					limit={limit}
					total={web.total}
					expanded={open === "web"}
					onToggle={() => setOpen((p) => (p === "web" ? "app" : "web"))}
					onPrev={() => setWebPage((p) => Math.max(1, p - 1))}
					onNext={() => setWebPage((p) => p + 1)}
				/>
				<HistoryTable
					title="App History"
					icon={<IoDesktopOutline />}
					items={app.items}
					loading={loadingApp}
					page={appPage}
					limit={limit}
					total={app.total}
					expanded={open === "app"}
					onToggle={() => setOpen((p) => (p === "app" ? "web" : "app"))}
					onPrev={() => setAppPage((p) => Math.max(1, p - 1))}
					onNext={() => setAppPage((p) => p + 1)}
				/>
			</div>
		</Section>
	);
}
