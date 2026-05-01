import type {
	MeResponse,
	UserDevice,
	UserSite,
	UserSiteUser,
	UserWorkspace,
} from "../services/user.service";
import type { Site } from "../services/site.service";
import type {
	CreatePaymentInput,
	CreatePaymentResult,
	PaymentStatusResult,
} from "../services/payment.service";

/** Fixed session string used by mocked auth (`auth.service`). */
export const DEMO_SESSION_TOKEN = "demo-session";

export function demoDelay(ms = 380): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function clone<T>(data: T): T {
	return structuredClone(data);
}

function newId(prefix: string): string {
	return `${prefix}-${crypto.randomUUID?.() ?? String(Date.now())}`;
}

export const MOCK_CATALOG_SITES: Site[] = [
	{
		uuid: "site-binance",
		type: "native",
		title: "Binance",
		url: "https://binance.com",
		image: null,
		categories: [{ uuid: "cat-cex", name: "Trading#CEX" }],
	},
	{
		uuid: "site-uniswap",
		type: "native",
		title: "Uniswap",
		url: "https://app.uniswap.org",
		image: null,
		categories: [{ uuid: "cat-dex", name: "Trading#DEX" }],
	},
	{
		uuid: "site-debank",
		type: "native",
		title: "DeBank",
		url: "https://debank.com",
		image: null,
		categories: [{ uuid: "cat-portfolio", name: "Portfolio" }],
	},
	{
		uuid: "site-dydx",
		type: "native",
		title: "dYdX",
		url: "https://dydx.exchange",
		image: null,
		categories: [{ uuid: "cat-derivatives", name: "Derivatives#Perps" }],
	},
	{
		uuid: "site-metamask",
		type: "native",
		title: "MetaMask Portfolio",
		url: "https://portfolio.metamask.io",
		image: null,
		categories: [{ uuid: "cat-wallet", name: "Wallets" }],
	},
	{
		uuid: "site-custom-blank",
		type: "custom",
		title: "Custom URL",
		url: null,
		image: null,
		categories: [{ uuid: "cat-custom", name: "Other#Custom" }],
	},
];

const DEMO_SITE_BINANCE = MOCK_CATALOG_SITES.find((s) => s.uuid === "site-binance")!;

function seedDevices(): UserDevice[] {
	const devUuid = "dev-mac-demo";
	return [
		{
			userUuid: "",
			deviceUuid: "link-1",
			activate: true,
			device: {
				uuid: devUuid,
				deviceId: "demo-device-mac",
				ipAddress: "127.0.0.1",
				country: "US",
				location: "Local (demo)",
			},
		},
	];
}

function seedSiteUsers(): UserSiteUser[] {
	const binanceSite = DEMO_SITE_BINANCE;
	return [
		{
			uuid: "su-1",
			siteUuid: binanceSite.uuid,
			sortKey: 1,
			workspaceUuid: null,
			title: "Binance",
			icon: "https://binance.com/favicon.ico",
			notificationEnabled: true,
			soundEnabled: false,
			hibernation: 0,
			endpoint: "/",
			site: { ...binanceSite },
			workspace: null,
		},
	];
}

let workspaces: UserWorkspace[] = [
	{
		uuid: "ws-trading",
		name: "Trading",
		color: "#14b8a6",
		placeholderSortKey: 0,
	},
];

let me: MeResponse = (() => {
	const uuid = "00000000-0000-4000-a000-000000000001";
	const devices = seedDevices();
	devices[0]!.userUuid = uuid;
	return {
		uuid,
		email: "demo@cryptdocker.local",
		fullName: "Demo User",
		avatar: undefined,
		role: "user",
		authProvider: "email",
		emailVerified: true,
		walletAddress: undefined,
		newsKeywords: "Bitcoin,Ethereum,DeFi",
		balance: "125.50",
		paymentMethod: "free",
		billingDate: null,
		trialExpiresAt: undefined,
		proGraceUntil: undefined,
		proCancelAtPeriodEnd: false,
		siteUsers: seedSiteUsers(),
		userDevices: devices,
	};
})();

const payments: Record<
	string,
	{
		userUuid: string;
		amount: number;
		ticker: string;
		addressIn: string;
		polls: number;
	}
> = {};

export function snapshotMe(): MeResponse {
	const m = clone(me);
	m.userDevices = m.userDevices?.map((d) => ({
		...d,
		userUuid: m.uuid,
	}));
	return m;
}

export function snapshotWorkspaces(): UserWorkspace[] {
	return clone(workspaces);
}

export function assertDemoToken(token: string | undefined | null): void {
	if (!token || token.trim() === "") throw new Error("Not authenticated.");
}

export function applyEmailSignIn(email: string, fullName?: string): void {
	me.email = email.trim();
	me.authProvider = "email";
	me.emailVerified = true;
	if (fullName?.trim()) me.fullName = fullName.trim();
}

export function applyGoogleSignIn(emailHint?: string): void {
	me.email = (emailHint?.trim() || "google-demo@cryptdocker.local").trim();
	me.fullName = me.fullName || "Google Demo User";
	me.authProvider = "google";
	me.emailVerified = true;
}

export function updateProfileFullName(fullName: string | undefined): void {
	me.fullName = fullName;
}

export async function mockUploadAvatar(file: File): Promise<string> {
	await demoDelay(200);
	return URL.createObjectURL(file);
}

export function setDemoAvatar(url: string | undefined): void {
	me.avatar = url;
}

export function updateWorkspaceList(next: UserWorkspace[]): void {
	workspaces = next;
}

export function patchWorkspaceMeSiteUser(siteUserUuid: string, patch: Partial<UserSiteUser>): UserSiteUser {
	const idx = (me.siteUsers ?? []).findIndex((s) => s.uuid === siteUserUuid);
	if (idx < 0) throw new Error("App not found.");
	const row = me.siteUsers![idx]!;
	const merged = { ...row, ...patch, site: row.site ?? null };
	me.siteUsers![idx] = merged;
	return clone(merged);
}

export function removeSiteUser(siteUserUuid: string): void {
	me.siteUsers = (me.siteUsers ?? []).filter((s) => s.uuid !== siteUserUuid);
}

export function upgradeDemoToPro(): void {
	me.paymentMethod = "pro";
	me.trialExpiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
}

export function cancelProDemo(): void {
	me.proCancelAtPeriodEnd = true;
}

export function listCatalogSites(params?: { q?: string; type?: string }): Site[] {
	let list = clone(MOCK_CATALOG_SITES);
	if (params?.type && params.type !== "all") {
		list = list.filter((s) => (s.type ?? "") === params.type);
	}
	if (params?.q?.trim()) {
		const q = params.q.trim().toLowerCase();
		list = list.filter(
			(s) =>
				(s.title ?? "").toLowerCase().includes(q) ||
				(s.url ?? "").toLowerCase().includes(q),
		);
	}
	return list;
}

export async function mockCreateWorkspace(name: string, userUuid: string): Promise<UserWorkspace> {
	await demoDelay();
	if (me.uuid !== userUuid) throw new Error("Invalid user.");
	const ws: UserWorkspace = {
		uuid: newId("ws"),
		name,
		color: "#6366f1",
		placeholderSortKey: workspaces.length,
	};
	workspaces = [...workspaces, ws];
	return clone(ws);
}

export async function mockDeleteWorkspace(workspaceUuid: string): Promise<void> {
	await demoDelay();
	workspaces = workspaces.filter((w) => w.uuid !== workspaceUuid);
	me.siteUsers = (me.siteUsers ?? []).map((su) =>
		su.workspaceUuid === workspaceUuid ? { ...su, workspaceUuid: null } : su,
	);
}

export async function mockSiteUserCreate(input: {
	siteUuid: string;
	userUuid: string;
	workspaceUuid?: string;
	endpoint?: string | null;
}): Promise<UserSiteUser> {
	await demoDelay();
	if (input.userUuid !== me.uuid) throw new Error("Invalid user.");
	const catalog = MOCK_CATALOG_SITES.find((s) => s.uuid === input.siteUuid);
	if (!catalog) throw new Error("Unknown app.");

	const ws =
		input.workspaceUuid != null
			? workspaces.find((w) => w.uuid === input.workspaceUuid) ?? null
			: null;

	const existing = me.siteUsers ?? [];
	const sortKey =
		Math.max(0, ...existing.map((s) => s.sortKey ?? 0)) + 1;

	const siteClone: UserSite = {
		uuid: catalog.uuid,
		title: catalog.title,
		url: catalog.url ?? null,
		image: catalog.image ?? null,
	};

	let icon: string | null = null;
	if (catalog.url) {
		try {
			icon = `${new URL(catalog.url).origin}/favicon.ico`;
		} catch {
			icon = null;
		}
	}

	const row: UserSiteUser = {
		uuid: newId("su"),
		siteUuid: catalog.uuid,
		sortKey,
		workspaceUuid: input.workspaceUuid ?? null,
		title: catalog.title,
		icon,
		notificationEnabled: true,
		soundEnabled: false,
		hibernation: 0,
		endpoint: input.endpoint ?? "/",
		site: siteClone,
		workspace: ws ? { uuid: ws.uuid, name: ws.name } : null,
	};

	me.siteUsers = [...existing, row];
	return clone(row);
}

export async function mockCreatePayment(
	body: CreatePaymentInput,
): Promise<CreatePaymentResult> {
	await demoDelay();
	const uuid = newId("pay");
	const addressIn = "0xDemo" + uuid.replace(/\W/g, "").slice(0, 34).padEnd(34, "0");
	payments[uuid] = {
		userUuid: body.userUuid,
		amount: body.amount,
		ticker: body.ticker,
		addressIn,
		polls: 0,
	};
	return {
		uuid,
		addressIn,
		amount: body.amount,
		ticker: body.ticker,
		minimumTransactionCoin: 0.0001,
		status: "waiting",
	};
}

export async function mockGetPaymentStatus(
	paymentUuid: string,
): Promise<PaymentStatusResult> {
	await demoDelay(120);
	const p = payments[paymentUuid];
	if (!p) throw new Error("Payment not found.");
	p.polls += 1;
	if (p.polls >= 2) {
		const bal = Number.parseFloat(String(me.balance ?? "0")) || 0;
		me.balance = String(Number((bal + p.amount).toFixed(8)));
		return {
			uuid: paymentUuid,
			status: "confirmed",
			addressIn: p.addressIn,
			amount: p.amount,
			ticker: p.ticker,
			minimumTransactionCoin: 0.0001,
		};
	}
	return {
		uuid: paymentUuid,
		status: "waiting",
		addressIn: p.addressIn,
		amount: p.amount,
		ticker: p.ticker,
		minimumTransactionCoin: 0.0001,
	};
}

function hashSeed(s: string): number {
	let h = 0;
	for (let i = 0; i < s.length; i++) {
		h = Math.imul(31, h) + s.charCodeAt(i)!;
		h |= 0;
	}
	return Math.abs(h);
}

export async function mockAnalyzeWallet(trimmedAddress: string) {
	await demoDelay(500);
	const score = hashSeed(trimmedAddress.toLowerCase()) % 100;
	const risk_level =
		score >= 72 ? "high" : score >= 38 ? "medium" : score >= 15 ? "low" : "minimal";
	const data = {
		address: trimmedAddress,
		score,
		risk_level,
		confidence: 0.55 + (hashSeed(trimmedAddress + "c") % 45) / 100,
		flags: {
			sanctioned: score % 17 === 0,
			blacklisted: score % 23 === 0,
			threat_actor: score % 31 === 0,
			smart_money: score % 11 === 0,
		},
		entity: {
			type: trimmedAddress.startsWith("0x") ? "wallet" : "unknown",
			name: score % 7 === 0 ? "Tagged entity (demo)" : "Unknown (demo)",
			id: "demo-" + hashSeed(trimmedAddress).toString(16),
		},
		signals: [
			{
				signal: "demo_behavior",
				contribution: 0.35,
				source: "frontend-mock",
				matched_value: "Deterministic demo signal from pasted input.",
			},
		],
		labels:
			score >= 60 ? ["elevated_demo_risk"] : score >= 30 ? ["typical_demo"] : ["demo_clean"],
		recommendation: {
			action: score >= 75 ? ("BLOCK" as const) : ("ALLOW" as const),
			summary: "Demo-only wallet read. Numbers and flags are deterministic from your input.",
			details:
				"The production CryptDocker backend is not contacted in this build.",
		},
	};
	return {
		success: true,
		data,
	} as const;
}

export async function mockAnalyzeSite(urlInput: string) {
	await demoDelay(550);
	let domain = "demo.local";
	try {
		const raw = /^https?:\/\//i.test(urlInput.trim())
			? urlInput.trim()
			: `https://${urlInput.trim()}`;
		domain = new URL(raw).hostname.replace(/^www\./i, "").toLowerCase();
	} catch {
		domain = urlInput.trim() || domain;
	}
	const seed = hashSeed(domain);
	const sentiment =
		seed % 3 === 0 ? "bullish" : seed % 3 === 1 ? "bearish" : "neutral";
	const items =
		sentiment === "bullish"
			? [
					{
						title: `"${domain}" activity picks up — demo headline A`,
						link: `https://news.example/demo-a?q=${encodeURIComponent(domain)}`,
						snippet: "Synthetic story for offline demo builds.",
						date: new Date().toISOString().slice(0, 10),
						source: "Demo News",
						thumbnail: undefined,
					},
					{
						title: `"${domain}" integrations expand — demo headline B`,
						link: `https://news.example/demo-b?q=${encodeURIComponent(domain)}`,
						snippet: "No live news API is queried in this preview.",
						date: new Date().toISOString().slice(0, 10),
						source: "Demo Wire",
					},
				]
			: [
					{
						title: `Regulators mention sector tied to "${domain}" (demo)`,
						link: `https://news.example/demo-c?q=${encodeURIComponent(domain)}`,
						source: "Demo Desk",
						date: new Date().toISOString().slice(0, 10),
					},
				];
	return {
		success: true,
		domain,
		summary: `Demo sentiment blur for ${domain}. Theme: ${sentiment}. These lines are placeholders — no remote site crawler runs here.`,
		sentiment,
		takeaway:
			sentiment === "bullish"
				? "Illustrative ‘risk-on’ read for prototype screens."
				: sentiment === "bearish"
					? "Illustrative ‘risk-off’ read for prototype screens."
					: "Neutral placeholder until a real analyzer is wired in.",
		items,
	} as const;
}

export async function mockAnalyzeNews(keywords: string[]) {
	await demoDelay(600);
	const k = keywords.length ? keywords.slice(0, 8).join(", ") : "crypto, markets";
	const seed = hashSeed(k.toLowerCase());
	const sentiment =
		seed % 3 === 0 ? "bullish" : seed % 3 === 1 ? "bearish" : "neutral";
	const items = [
		{
			title: `${k.split(",")[0]?.trim() || "Crypto"} — demo macro headline`,
			link: "https://news.example/demo-news-1",
			snippet: "Static content for demos and stakeholder walkthroughs.",
			date: new Date().toISOString().slice(0, 10),
			source: "Demo Ledger",
		},
		{
			title: "Stablecoin liquidity — demo subplot",
			link: "https://news.example/demo-news-2",
			snippet: `Topics you entered appear in copy only: ${k}.`,
			date: new Date().toISOString().slice(0, 10),
			source: "Demo Terminal",
		},
	];
	return {
		success: true,
		summary:
			sentiment === "bullish"
				? `Demo read: bullish tone on themes around “${k}”.`
				: sentiment === "bearish"
					? `Demo read: cautious tone around “${k}”.`
					: `Demo read: balanced coverage for “${k}”.`,
		sentiment,
		takeaway: "Treat this block as UX filler; connect the real aggregator for production.",
		items,
	} as const;
}
