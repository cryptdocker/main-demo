import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiMenu, FiPlus, FiTrash2, FiX, FiDownload } from "react-icons/fi";
import {
	backdropFadeTransition,
	drawerTransition,
	popoverExitTransition,
	popoverTransition,
	sidebarContentTransition,
	sidebarWidthTransition,
} from "../../config/motion";
import { useTradeGPTUser } from "../../context/TradeGPTUserContext";
import { Tooltip } from "react-tooltip";

type Conv = { id: string; title: string; mode: string };

const SIDEBAR_RAIL_PX = 56;
const SIDEBAR_EXPANDED_PX = 260;

/** Header / collapsed-rail icon buttons (same look in both states). */
const sidebarHeaderIconBtnClass =
	"flex rounded-full bg-transparent p-3 text-teal-700 transition-colors hover:bg-teal-300/20 dark:text-teal-300 dark:hover:bg-teal-500/20";

function formatShortDate(iso: string | null | undefined): string | null {
	if (!iso) return null;
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(d);
}

type Props = {
	conversations: Conv[];
	activeId: string | null;
	onNewChat: () => void;
	onSelect: (id: string) => void;
	onDelete: (id: string) => void;
	onExportData: () => void;
	onDeleteAllConversations: () => void;
	collapsed: boolean;
	onToggleCollapse: () => void;
	/** Narrow / mobile: drawer over the chat; does not consume horizontal flex space. */
	isMobileLayout?: boolean;
	mobileOpen?: boolean;
	onCloseMobile?: () => void;
};

export function ChatSidebar({
	conversations,
	activeId,
	onNewChat,
	onSelect,
	onDelete,
	onExportData,
	onDeleteAllConversations,
	collapsed,
	onToggleCollapse,
	isMobileLayout = false,
	mobileOpen = false,
	onCloseMobile,
}: Props) {
	const reduceMotion = useReducedMotion();
	const {
		user,
		subscription,
		loading: subscriptionLoading,
	} = useTradeGPTUser();
	const [confirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false);
	/** True while collapsed-rail account menu exit animation runs (keeps z-index/overflow until done). */
	const prevDesktopCollapsedRef = useRef(collapsed);

	const widthSpring = sidebarWidthTransition(reduceMotion);
	const contentCrossfade = sidebarContentTransition(reduceMotion);
	const drawerSpring = drawerTransition(reduceMotion);

	const planInfo = (() => {
		if (!user) return null;
		if (!subscription) {
			return {
				planLabel: subscriptionLoading ? "Loading…" : "Free",
				dateLabel: null as string | null,
				dateValue: null as string | null,
				title: null as string | null,
			};
		}

		if (subscription.plan === "pro") {
			const nextBilling = formatShortDate(subscription.nextBillingDate);
			return {
				planLabel: "Pro",
				dateLabel: nextBilling ? "Next billing" : null,
				dateValue: nextBilling,
				title: nextBilling ? `Pro • Next billing ${nextBilling}` : "Pro",
			};
		}

		if (subscription.trialActive) {
			const expires = formatShortDate(subscription.trialEndsAt);
			return {
				planLabel: "Trial",
				dateLabel: expires ? "Expires" : null,
				dateValue: expires,
				title: expires ? `Trial • Expires ${expires}` : "Trial",
			};
		}

		return {
			planLabel: "Free",
			dateLabel: null,
			dateValue: null,
			title: "Free",
		};
	})();

	useEffect(() => {
		if (isMobileLayout) return;
		if (prevDesktopCollapsedRef.current !== collapsed) {
			setConfirmDeleteAllOpen(false);
			prevDesktopCollapsedRef.current = collapsed;
		}
	}, [collapsed, isMobileLayout]);

	useLayoutEffect(() => {
		if (isMobileLayout || !collapsed) return;
		// If we just collapsed, close any destructive confirm state.
		setConfirmDeleteAllOpen(false);
	}, [collapsed, isMobileLayout]);

	const closeOrToggle = () => {
		if (isMobileLayout && onCloseMobile) onCloseMobile();
		else onToggleCollapse();
	};

	const expandedBody = (
		<>
			<div className="flex items-center justify-between gap-1 p-2">
				<button
					type="button"
					onClick={closeOrToggle}
					className={sidebarHeaderIconBtnClass}
					title={isMobileLayout ? "Close menu" : "Close sidebar"}
					aria-label={isMobileLayout ? "Close menu" : "Close sidebar"}>
					{isMobileLayout ? (
						<FiX aria-hidden className="h-5 w-5" />
					) : (
						<FiMenu aria-hidden className="h-5 w-5" />
					)}
				</button>
				<button
					type="button"
					onClick={onNewChat}
					title="New chat"
					aria-label="New chat"
					className={sidebarHeaderIconBtnClass}>
					<FiPlus aria-hidden className="h-4 w-4" />
				</button>
			</div>

			<nav className="min-h-0 flex-1 overflow-y-auto p-2">
				<ul className="space-y-0.5">
					{conversations.map((c) => (
						<li key={c.id} className="group relative">
							<button
								type="button"
								onClick={() => onSelect(c.id)}
								className={`w-full truncate rounded-lg px-3 py-2.5 pr-11 text-left text-sm transition-colors ${
									c.id === activeId
										? "bg-teal-500/15 text-th-text shadow-sm ring-1 ring-teal-500/30 dark:bg-teal-400/15 dark:ring-teal-400/25"
										: "text-th-text/90 hover:bg-th-input"
								}`}>
								{c.title || "New chat"}
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onDelete(c.id);
								}}
								className="absolute right-1 top-1/2 z-10 flex -translate-y-1/2 rounded-md p-2 text-th-text-muted opacity-100 hover:bg-th-input hover:text-red-500 md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100"
								title="Delete chat"
								aria-label="Delete chat">
								<FiTrash2 aria-hidden className="h-4 w-4" />
							</button>
						</li>
					))}
				</ul>
			</nav>

			<div className="border-t border-th-border p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
				<div className="flex items-center justify-between gap-2">
					{planInfo && (
						<div
							className="flex min-w-0 items-center justify-end gap-2 rounded-xl bg-th-surface/40"
							title={planInfo.title ?? undefined}
							aria-label="Plan details">
							<span className="shrink-0 rounded-full border border-th-border/70 bg-th-input/60 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-th-text/80">
								{planInfo.planLabel.toUpperCase()}
							</span>
							{planInfo.dateValue && (
								<span className="truncate text-xs text-th-text-muted">
									{planInfo.dateValue}
								</span>
							)}
						</div>
					)}

					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={onExportData}
							aria-label="Export data"
							data-tooltip-id="tradegpt-sidebar-tooltips"
							data-tooltip-content="Export data"
							data-tooltip-place="top"
							className="inline-flex items-center justify-center rounded-lg p-2 text-th-text-muted transition-colors hover:bg-th-input hover:text-th-text">
							<FiDownload aria-hidden className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => setConfirmDeleteAllOpen(true)}
							aria-label="Delete all conversations"
							data-tooltip-id="tradegpt-sidebar-tooltips"
							data-tooltip-content="Delete all conversations"
							data-tooltip-place="top-end"
							className="inline-flex items-center justify-center rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500/10">
							<FiTrash2 aria-hidden className="h-4 w-4" />
						</button>
						<Tooltip
							id="tradegpt-sidebar-tooltips"
							place="top"
							className="rounded-lg! border border-th-border/80 bg-th-surface! p-0! th-text shadow-xl"
						/>
					</div>
				</div>
			</div>
		</>
	);

	if (!isMobileLayout) {
		return (
			<>
				<motion.aside
					initial={false}
					animate={{
						width: collapsed ? SIDEBAR_RAIL_PX : SIDEBAR_EXPANDED_PX,
					}}
					transition={widthSpring}
					className={`relative flex min-h-0 shrink-0 self-stretch flex-col border-r border-th-border/90 bg-th-sidebar/95 backdrop-blur-sm will-change-[width] motion-reduce:will-change-auto ${
						confirmDeleteAllOpen ? "overflow-visible" : "overflow-hidden"
					} ${collapsed && confirmDeleteAllOpen ? "z-70" : "z-0"}`}>
					<div className="relative h-full min-h-0 w-full">
						<motion.div
							aria-hidden={!collapsed}
							className="absolute inset-0 flex min-h-0 flex-col items-center p-2"
							initial={false}
							animate={{
								opacity: collapsed ? 1 : 0,
								scale: collapsed ? 1 : 0.93,
								x: collapsed ? 0 : -6,
							}}
							transition={contentCrossfade}
							style={{ pointerEvents: collapsed ? "auto" : "none" }}>
							<div className="flex flex-col items-center gap-2">
								<button
									type="button"
									onClick={onToggleCollapse}
									className={sidebarHeaderIconBtnClass}
									title="Open sidebar"
									aria-label="Open sidebar">
									<FiMenu aria-hidden className="h-5 w-5" />
								</button>
								<button
									type="button"
									onClick={onNewChat}
									className={sidebarHeaderIconBtnClass}
									title="New chat"
									aria-label="New chat">
									<FiPlus aria-hidden className="h-4 w-4" />
								</button>
							</div>
							<div className="mt-auto flex w-full flex-col items-center pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-2">
								<div className="flex w-full flex-col items-center gap-2">
									{planInfo && (
										<div
											className="w-full px-1"
											title={planInfo.title ?? undefined}
											aria-label="Plan details">
											<div className="w-full rounded-lg border border-th-border/60 bg-th-surface/40 py-1 text-center text-[10px] font-semibold tracking-wide text-th-text/80">
												{planInfo.planLabel.toUpperCase()}
											</div>
										</div>
									)}
									<button
										type="button"
										onClick={onExportData}
										title="Export data"
										aria-label="Export data"
										className={sidebarHeaderIconBtnClass}>
										<FiDownload aria-hidden className="h-4 w-4" />
									</button>
									<button
										type="button"
										onClick={() => setConfirmDeleteAllOpen(true)}
										title="Delete all conversations"
										aria-label="Delete all conversations"
										className="flex rounded-full bg-transparent p-3 text-red-500 transition-colors hover:bg-red-500/10">
										<FiTrash2 aria-hidden className="h-4 w-4" />
									</button>
								</div>
							</div>
						</motion.div>

						<motion.div
							className="absolute inset-0 flex min-h-0 w-[260px] flex-col"
							initial={false}
							animate={{
								opacity: collapsed ? 0 : 1,
								scale: collapsed ? 0.96 : 1,
								x: collapsed ? -10 : 0,
							}}
							transition={contentCrossfade}
							style={{ pointerEvents: collapsed ? "none" : "auto" }}
							aria-hidden={collapsed}>
							{expandedBody}
						</motion.div>
					</div>
				</motion.aside>

				<ConfirmDeleteAllDialog
					open={confirmDeleteAllOpen}
					onClose={() => setConfirmDeleteAllOpen(false)}
					onConfirm={() => {
						setConfirmDeleteAllOpen(false);
						onDeleteAllConversations();
					}}
				/>
			</>
		);
	}

	return (
		<>
			<AnimatePresence>
				{mobileOpen && onCloseMobile && (
					<motion.button
						key="drawer-backdrop"
						type="button"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={backdropFadeTransition(reduceMotion)}
						className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[1px] motion-reduce:backdrop-blur-none"
						aria-label="Close menu"
						onClick={onCloseMobile}
					/>
				)}
			</AnimatePresence>

			<motion.aside
				initial={false}
				animate={{ x: mobileOpen ? 0 : "-100%" }}
				transition={drawerSpring}
				style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
				aria-hidden={!mobileOpen}
				className="fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(288px,88vw)] flex-col border-r border-th-border/90 bg-th-sidebar/95 pl-[env(safe-area-inset-left)] shadow-2xl backdrop-blur-md will-change-transform motion-reduce:will-change-auto">
				{expandedBody}
			</motion.aside>

			<ConfirmDeleteAllDialog
				open={confirmDeleteAllOpen}
				onClose={() => setConfirmDeleteAllOpen(false)}
				onConfirm={() => {
					setConfirmDeleteAllOpen(false);
					onDeleteAllConversations();
				}}
			/>
		</>
	);
}

function ConfirmDeleteAllDialog({
	open,
	onClose,
	onConfirm,
}: {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
}) {
	const reduceMotion = useReducedMotion();
	const instant = Boolean(reduceMotion);

	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.button
						key="delete-all-backdrop"
						type="button"
						className="fixed inset-0 z-60 bg-slate-950/55 backdrop-blur-[2px] motion-reduce:backdrop-blur-none"
						aria-label="Close"
						onClick={onClose}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={backdropFadeTransition(reduceMotion)}
					/>
					<div className="fixed inset-0 z-70 flex items-center justify-center p-4">
						<motion.div
							key="delete-all-panel"
							role="dialog"
							aria-modal="true"
							aria-labelledby="delete-all-title"
							className="w-full max-w-md overflow-hidden rounded-2xl border border-red-500/40 bg-th-surface shadow-2xl"
							initial={instant ? false : { opacity: 0, y: 10, scale: 0.96 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={
								instant
									? { opacity: 0, transition: popoverExitTransition(true) }
									: {
											opacity: 0,
											y: 6,
											scale: 0.98,
											transition: popoverExitTransition(false),
										}
							}
							transition={popoverTransition(reduceMotion)}>
							<div className="p-5">
								<h3
									id="delete-all-title"
									className="text-base font-semibold text-th-text">
									Delete all conversations?
								</h3>
								<p className="mt-2 text-sm text-th-text-muted">
									This action is permanent and cannot be undone.
								</p>
								<div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
									<button
										type="button"
										onClick={onClose}
										className="inline-flex items-center justify-center gap-2 rounded-lg border border-th-border px-4 py-2 text-sm font-medium text-th-text hover:bg-th-input">
										<FiX aria-hidden className="h-4 w-4" />
										Cancel
									</button>
									<button
										type="button"
										onClick={onConfirm}
										className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-300">
										<FiTrash2 aria-hidden className="h-4 w-4" />
										Delete all
									</button>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}
