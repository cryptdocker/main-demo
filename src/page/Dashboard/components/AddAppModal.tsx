import { useEffect, useMemo, useState } from "react";
import {
	IoChevronDownOutline,
	IoGlobeOutline,
	IoSearchOutline,
} from "react-icons/io5";
import { FaRegStar, FaStar } from "react-icons/fa";
import { Button } from "../../../component/Button";
import type { Site } from "../../../services/site.service";
import type { UserWorkspace } from "../../../services/user.service";
import { cx, INPUT } from "./shared";
import { Modal } from "./Modal";
import { Select } from "./ui";

type Category = { uuid: string; name: string };

type TreeNode = {
	id: string;
	label: string;
	isVirtual?: boolean;
	totalCount?: number;
	children: TreeNode[];
};

const FAVORITES_CATEGORY_ID = "__favorites__";

function buildCategoryTree(categories: Category[], countsByUuid: Record<string, number>): TreeNode[] {
	const root: TreeNode[] = [];
	const pathMap = new Map<string, TreeNode>();

	for (const category of categories) {
		const parts = category.name.split("#").map((p) => p.trim()).filter(Boolean);
		if (parts.length === 0) continue;

		let currentLevel = root;
		let currentPath = "";

		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i]!;
			currentPath = currentPath ? `${currentPath}#${part}` : part;
			let existing = pathMap.get(currentPath);
			if (!existing) {
				const virtualId = `virtual-${currentPath}`;
				existing = { id: virtualId, label: part, isVirtual: true, children: [] };
				pathMap.set(currentPath, existing);
				currentLevel.push(existing);
			}
			currentLevel = existing.children;
		}

		currentLevel.push({
			id: category.uuid,
			label: parts[parts.length - 1]!,
			children: [],
		});
	}

	const computeTotals = (node: TreeNode): number => {
		let total = countsByUuid[node.id] ?? 0;
		for (const c of node.children) total += computeTotals(c);
		node.totalCount = total;
		return total;
	};

	const sortTree = (nodes: TreeNode[]) => {
		nodes.sort((a, b) => a.label.localeCompare(b.label));
		nodes.forEach((n) => {
			if (n.children.length) {
				sortTree(n.children);
				computeTotals(n);
			}
		});
	};

	sortTree(root);
	return root;
}

function usePersistentSet(key: string) {
	const [set, setSet] = useState<Set<string>>(() => {
		try {
			const raw = localStorage.getItem(key);
			if (!raw) return new Set();
			const arr = JSON.parse(raw) as string[];
			return new Set(Array.isArray(arr) ? arr : []);
		} catch {
			return new Set();
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(Array.from(set)));
		} catch {
			// ignore
		}
	}, [key, set]);

	const toggle = (id: string) =>
		setSet((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	return { set, toggle };
}

function parseEndpointOptions(endpointStr?: string | null) {
	const raw = (endpointStr ?? "/").trim().split(/\s+/).filter(Boolean);
	const options: Array<{ value: string; label: string; isDynamic: boolean; pathPrefix?: string }> = [];
	const labels: Record<string, string> = {
		"/": "Open at base URL (static)",
		"/*": "Custom path",
		"/address/*": "Address",
		"/token/*": "Token",
		"/tx/*": "Transaction",
		"/block/*": "Block",
	};
	for (const token of raw) {
		const label = labels[token] ?? token;
		if (token === "/") options.push({ value: "/", label, isDynamic: false });
		else if (token.endsWith("/*")) {
			const pathPrefix = token.slice(1, -2);
			options.push({ value: token, label, isDynamic: true, pathPrefix });
		}
	}
	if (options.length === 0) options.push({ value: "/", label: "Open at base URL (static)", isDynamic: false });
	return options;
}

function resolveEndpoint(option: { isDynamic: boolean; pathPrefix?: string }, input: string) {
	if (!option.isDynamic) return "/";
	const trimmed = input.trim();
	const prefix = option.pathPrefix ?? "";
	const path = prefix ? `${prefix}/${trimmed}` : trimmed;
	return path.startsWith("/") ? path : `/${path}`;
}

function TreeView({
	nodes,
	selectedId,
	expanded,
	onToggle,
	onSelect,
	level = 0,
}: {
	nodes: TreeNode[];
	selectedId: string | null;
	expanded: Set<string>;
	onToggle: (id: string) => void;
	onSelect: (id: string) => void;
	level?: number;
}) {
	return (
		<div className={cx(level > 0 && "pl-3")}>
			{nodes.map((n) => {
				const isExpanded = expanded.has(n.id);
				const hasChildren = n.children.length > 0;
				const isSelected = selectedId === n.id;
				return (
					<div key={n.id}>
						<button
							type="button"
							onClick={() => {
								if (hasChildren) onToggle(n.id);
								if (!n.isVirtual) onSelect(n.id);
							}}
							className={cx(
								"w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between gap-2",
								isSelected ? "bg-teal-500/10 text-teal-300" : "text-slate-300 hover:bg-white/5",
								n.isVirtual && "text-slate-400",
							)}
						>
							<span className="min-w-0 flex items-center gap-2">
								{hasChildren && (
									<IoChevronDownOutline
										className="shrink-0 text-slate-500 transition-transform"
										style={{ rotate: isExpanded ? "0deg" : "-90deg" }}
									/>
								)}
								<span className="truncate">{n.label}</span>
							</span>
							<span className="text-xs text-slate-500 shrink-0">
								{n.totalCount ?? 0}
							</span>
						</button>
						{hasChildren && isExpanded && (
							<TreeView
								nodes={n.children}
								selectedId={selectedId}
								expanded={expanded}
								onToggle={onToggle}
								onSelect={onSelect}
								level={level + 1}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

export function AddAppModal({
	open,
	onClose,
	sites,
	loading,
	workspaces,
	addingSiteUuid,
	onAdd,
}: {
	open: boolean;
	onClose: () => void;
	sites: Site[];
	loading: boolean;
	workspaces: UserWorkspace[];
	addingSiteUuid: string | null;
	onAdd: (args: { siteUuid: string; workspaceUuid?: string; endpoint?: string | null }) => void;
}) {
	const [selectedCategoryUuid, setSelectedCategoryUuid] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	const { set: favoriteIds, toggle: toggleFavorite } = usePersistentSet("dashboard.favoriteSites");
	const [selectedSite, setSelectedSite] = useState<Site | null>(null);

	// configure step
	const [selectedWorkspaceUuid, setSelectedWorkspaceUuid] = useState<string>("");
	const [selectedEndpointValue, setSelectedEndpointValue] = useState<string>("/");
	const [endpointDynamicInput, setEndpointDynamicInput] = useState("");

	useEffect(() => {
		if (!open) return;
		setSelectedCategoryUuid(null);
		setSearchQuery("");
		setExpanded(new Set());
		setSelectedSite(null);
		setSelectedWorkspaceUuid("");
		setSelectedEndpointValue("/");
		setEndpointDynamicInput("");
	}, [open]);

	const allCategories = useMemo(() => {
		return Array.from(
			new Map(
				sites.flatMap((s) => s.categories ?? []).map((c) => [c.uuid, c] as const),
			).values(),
		).sort((a, b) => a.name.localeCompare(b.name));
	}, [sites]);

	const countsByCategory = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const s of sites) {
			for (const c of s.categories ?? []) {
				counts[c.uuid] = (counts[c.uuid] ?? 0) + 1;
			}
		}
		return counts;
	}, [sites]);

	const categoryTree = useMemo(() => buildCategoryTree(allCategories, countsByCategory), [allCategories, countsByCategory]);

	const filteredSites = useMemo(() => {
		let list = sites;
		if (selectedCategoryUuid === FAVORITES_CATEGORY_ID) {
			list = list.filter((s) => favoriteIds.has(s.uuid));
		} else if (selectedCategoryUuid) {
			list = list.filter((s) => (s.categories ?? []).some((c) => c.uuid === selectedCategoryUuid));
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			list = list.filter(
				(s) =>
					(s.title ?? "").toLowerCase().includes(q) ||
					(s.url ?? "").toLowerCase().includes(q) ||
					(s.description ?? "").toLowerCase().includes(q),
			);
		}
		return list;
	}, [sites, selectedCategoryUuid, searchQuery, favoriteIds]);

	const endpointOptions = useMemo(() => parseEndpointOptions(selectedSite?.endpoint), [selectedSite?.endpoint]);
	const selectedEndpointOption = useMemo(
		() => endpointOptions.find((o) => o.value === selectedEndpointValue) ?? endpointOptions[0],
		[endpointOptions, selectedEndpointValue],
	);

	return (
		<Modal open={open} title="Add App" onClose={onClose} size="6xl">
			<div className="w-full h-full min-h-[640px] max-h-[640px] flex relative">
				{!selectedSite ? (
					<>
						{/* sidebar */}
						<div className="w-full max-w-[360px] flex flex-col gap-4 border-r border-white/10 pr-4">
							<div className={cx(INPUT, "flex items-center gap-2")}>
								<IoSearchOutline className="text-slate-500" />
								<input
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search based on title, keyword and category"
									className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
								/>
							</div>

							<hr className="border-white/8" />

							<button
								type="button"
								onClick={() => setSelectedCategoryUuid(null)}
								className={cx(
									"w-full text-left px-3 py-2 rounded-lg transition-colors",
									selectedCategoryUuid === null
										? "bg-teal-500/10 text-teal-300 font-medium"
										: "text-slate-300 hover:bg-white/5",
								)}
							>
								<span className="flex items-center gap-2">
									<IoGlobeOutline size={16} />
									All Apps ({sites.length})
								</span>
							</button>

							<button
								type="button"
								onClick={() => setSelectedCategoryUuid(FAVORITES_CATEGORY_ID)}
								className={cx(
									"w-full text-left px-3 py-2 rounded-lg transition-colors",
									selectedCategoryUuid === FAVORITES_CATEGORY_ID
										? "bg-teal-500/10 text-teal-300 font-medium"
										: "text-slate-300 hover:bg-white/5",
								)}
							>
								<span className="flex items-center gap-2">
									<FaStar size={16} />
									Favorites ({favoriteIds.size})
								</span>
							</button>

							<p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
								Categories
							</p>

							<div className="flex flex-col gap-2 overflow-y-auto pr-1">
								{loading ? (
									<div className="text-sm text-slate-500 py-4 text-center">
										Loading...
									</div>
								) : categoryTree.length === 0 ? (
									<div className="text-sm text-slate-500 py-4 text-center">
										No categories yet
									</div>
								) : (
									<TreeView
										nodes={categoryTree}
										selectedId={selectedCategoryUuid}
										expanded={expanded}
										onToggle={(id) =>
											setExpanded((prev) => {
												const next = new Set(prev);
												if (next.has(id)) next.delete(id);
												else next.add(id);
												return next;
											})
										}
										onSelect={(id) => {
											setSelectedCategoryUuid(id);
											setSearchQuery("");
										}}
									/>
								)}
							</div>
						</div>

						{/* grid */}
						<div className="w-full flex flex-col pl-4">
							{loading ? (
								<div className="flex items-center justify-center h-full text-slate-500">
									Loading sites...
								</div>
							) : filteredSites.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-full text-slate-500">
									<p className="text-lg font-medium">
										{searchQuery.trim()
											? "No sites found matching your search"
											: selectedCategoryUuid === FAVORITES_CATEGORY_ID
												? "No favorite sites yet"
												: selectedCategoryUuid
													? "No sites in this category"
													: "No sites available"}
									</p>
									<p className="text-sm mt-2">
										{searchQuery.trim()
											? "Try a different search term"
											: selectedCategoryUuid === FAVORITES_CATEGORY_ID
												? "Star sites from All Apps or categories to see them here"
												: "Try another category"}
									</p>
								</div>
							) : (
								<div className="grid grid-cols-3 gap-4 overflow-y-auto pt-2 pr-2">
									{filteredSites.map((site) => {
										const title = site.title ?? "Untitled";
										const isFav = favoriteIds.has(site.uuid);
										return (
											<div
												key={site.uuid}
												className="relative flex flex-col justify-center items-center gap-2 p-4 rounded-lg border border-white/10 bg-white/3 hover:bg-white/5 transition-colors cursor-pointer"
												title="Add App"
												onClick={() => setSelectedSite(site)}
											>
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														toggleFavorite(site.uuid);
													}}
													className="cursor-pointer absolute top-4 right-4 text-yellow-400"
													aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
												>
													{isFav ? <FaStar size={18} /> : <FaRegStar size={18} />}
												</button>

												<div className="w-12 h-12 rounded bg-teal-500/10 flex items-center justify-center overflow-hidden">
													{site.image ? (
														<img
															src={site.image}
															alt=""
															className="w-full h-full object-cover"
														/>
													) : (
														<IoGlobeOutline size={24} className="text-teal-300" />
													)}
												</div>

												<div className="text-center">
													<div className="font-medium text-sm text-slate-100">
														{title}
													</div>
													{site.description && (
														<div className="text-xs text-slate-500 mt-1 line-clamp-2">
															{site.description}
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</>
				) : (
					<div className="w-full h-full flex flex-col gap-4">
						<button
							type="button"
							onClick={() => setSelectedSite(null)}
							className="text-sm text-slate-500 hover:text-slate-300 self-start"
						>
							← Back
						</button>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="md:col-span-1 rounded-2xl border border-white/10 bg-white/3 p-4 flex flex-col justify-center items-center gap-3">
								<div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
									{selectedSite.image ? (
										<img src={selectedSite.image} alt="" className="w-full h-full object-cover" />
									) : (
										<IoGlobeOutline size={34} className="text-teal-300" />
									)}
								</div>
								<div className="text-center">
									<p className="text-base font-semibold text-white">
										{selectedSite.title ?? "Untitled"}
									</p>
									<p className="text-xs text-slate-500 truncate max-w-[220px]">
										{selectedSite.url ?? ""}
									</p>
								</div>
							</div>

							<div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/3 p-4 space-y-3">
								<label className="space-y-1 block">
									<span className="text-xs font-semibold text-slate-500">Workspace</span>
									<div className={cx(INPUT, "flex items-center gap-2 pr-3")}>
										<Select
											value={selectedWorkspaceUuid}
											onChange={(v) => setSelectedWorkspaceUuid(v)}
											disabled={!!addingSiteUuid}
										>
											<option value="">No workspace (shared session)</option>
											{workspaces.map((w) => (
												<option key={w.uuid} value={w.uuid}>
													{w.name}
												</option>
											))}
										</Select>
									</div>
								</label>

								<label className="space-y-1 block">
									<span className="text-xs font-semibold text-slate-500">URL</span>
									<div className={cx(INPUT, "flex items-center gap-2 pr-3")}>
										<Select
											value={selectedEndpointValue}
											onChange={(v) => setSelectedEndpointValue(v)}
											disabled={!!addingSiteUuid}
										>
											{endpointOptions.map((o) => (
												<option key={o.value} value={o.value}>
													{o.label}
												</option>
											))}
										</Select>
									</div>
								</label>

								{selectedEndpointOption?.isDynamic && (
									<label className="space-y-1 block">
										<span className="text-xs font-semibold text-slate-500">
											Custom path value
										</span>
										<input
											value={endpointDynamicInput}
											onChange={(e) => setEndpointDynamicInput(e.target.value)}
											className={INPUT}
											placeholder="e.g. 0x123..."
											disabled={!!addingSiteUuid}
										/>
									</label>
								)}

								<div className="pt-2 flex justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setSelectedSite(null)}
										disabled={!!addingSiteUuid}
									>
										Cancel
									</Button>
									<Button
										size="sm"
										onClick={() =>
											onAdd({
												siteUuid: selectedSite.uuid,
												workspaceUuid: selectedWorkspaceUuid || undefined,
												endpoint: resolveEndpoint(selectedEndpointOption, endpointDynamicInput),
											})
										}
										disabled={!!addingSiteUuid || (selectedEndpointOption?.isDynamic && !endpointDynamicInput.trim())}
									>
										{addingSiteUuid ? "Adding..." : "Add App"}
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
}

