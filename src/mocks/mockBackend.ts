import { DEMO_CHANGE_PASSWORD_CURRENT } from "../const/env";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type MockReply =
	| { ok: true; status: number; body: unknown; headers?: Record<string, string> }
	| { ok: false; status: number; body: unknown; headers?: Record<string, string> };

export type MockRequest = {
	url: string;
	method: HttpMethod;
	headers?: Record<string, string>;
	body?: unknown;
};

function toUrl(input: string): URL {
	// Allows passing relative paths like "/user".
	return new URL(input, "https://demo.local");
}

function json(ok: boolean, status: number, body: unknown): MockReply {
	return {
		ok,
		status,
		body,
		headers: { "content-type": "application/json" },
	} as MockReply;
}

function nowIso(): string {
	return new Date().toISOString();
}

function nextDemoToken(): string {
	// Must change between logins so React effects depending on token re-run in the demo.
	return `demo-token-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function recordTradeGptDemoExchange(params: {
	conversationId: string;
	userText: string;
	assistantText: string;
	tradeMode?: string;
}): { assistantMessageId: string } {
	const conv = store.tradeGpt.conversations.find((c) => c.id === params.conversationId);
	const ts = nowIso();
	const userId = `m-user-${Date.now()}`;
	const assistantId = `m-asst-${Date.now() + 1}`;

	if (!conv) {
		return { assistantMessageId: assistantId };
	}

	(conv.messages as any[]).push({
		id: userId,
		role: "user",
		content: params.userText,
		createdAt: ts,
		...(params.tradeMode ? { tradeMode: params.tradeMode } : {}),
	});
	(conv.messages as any[]).push({
		id: assistantId,
		role: "assistant",
		content: params.assistantText,
		createdAt: ts,
	});
	(conv as any).updatedAt = ts;
	(conv as any).messageCount = (conv.messages?.length ?? 0);

	return { assistantMessageId: assistantId };
}

function safeJsonParse(value: unknown): unknown {
	if (typeof value !== "string") return value;
	try {
		return JSON.parse(value) as unknown;
	} catch {
		return value;
	}
}

const store = {
	user: {
		uuid: "demo-user-uuid",
		email: "demo@cryptdocker.com",
		fullName: "Demo User",
		avatar: undefined as string | undefined,
		role: "user",
		authProvider: "email",
		emailVerified: true,
		walletAddress: "0xDEMO000000000000000000000000000000000000",
		newsKeywords: "bitcoin, ethereum, solana",
		balance: 42.5,
		/** Demo dashboard: CryptDocker row shows Free; trial / next billing use null dates. */
		paymentMethod: "free" as "free" | "pro",
		billingDate: null as string | null,
		trialExpiresAt: null as string | null,
		proGraceUntil: null as string | null,
		proCancelAtPeriodEnd: false,
	},
	workspaces: [
		{ uuid: "ws-1", name: "Work", color: "#14b8a6" },
		{ uuid: "ws-2", name: "Personal", color: "#60a5fa" },
	] as Array<{ uuid: string; name: string; color?: string | null }>,
	siteUsers: [
		{
			uuid: "su-1",
			siteUuid: "site-1",
			sortKey: 1,
			workspaceUuid: "ws-1",
			title: "Binance",
			icon: "binance",
			notificationEnabled: true,
			soundEnabled: true,
			hibernation: 0,
			endpoint: null,
			site: {
				uuid: "site-1",
				title: "Binance",
				url: "https://www.binance.com",
				image: null,
			},
			workspace: { uuid: "ws-1", name: "Work" },
		},
		{
			uuid: "su-2",
			siteUuid: "site-2",
			sortKey: 2,
			workspaceUuid: "ws-2",
			title: "CoinMarketCap",
			icon: "cmc",
			notificationEnabled: false,
			soundEnabled: false,
			hibernation: 30,
			endpoint: null,
			site: {
				uuid: "site-2",
				title: "CoinMarketCap",
				url: "https://coinmarketcap.com",
				image: null,
			},
			workspace: { uuid: "ws-2", name: "Personal" },
		},
	] as Array<{
		uuid: string;
		siteUuid: string | null;
		sortKey: number;
		workspaceUuid: string | null;
		title: string | null;
		icon: string | null;
		notificationEnabled: boolean;
		soundEnabled: boolean;
		hibernation: number;
		endpoint: string | null;
		site?: { uuid: string; title: string | null; url?: string | null; image?: string | null } | null;
		workspace?: { uuid: string; name: string } | null;
	}>,
	signInHistory: Array.from({ length: 40 }).map((_, i) => ({
		uuid: `hist-${i + 1}`,
		type: i % 2 === 0 ? ("Web" as const) : ("App" as const),
		createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 12).toISOString(),
		ipAddress: "203.0.113.10",
		country: "Japan",
		location: "Tokyo",
	})),
	/** Per-product row for MentalShield in Dashboard → Subscription (not CryptDocker / TradeGPT). */
	mentalShieldProjectSub: {
		project: "mentalshield" as const,
		paymentMethod: "free" as "free" | "pro",
		billingDate: null as string | null,
		trialExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString() as
			| string
			| null,
		proGraceUntil: null as string | null,
		proCancelAtPeriodEnd: false,
		trialActive: true,
		trialDaysLeft: 14,
		nextBillingDate: null as string | null,
	},
	tradeGpt: {
		subscription: {
			plan: "pro" as "free" | "pro",
			label: "Pro",
			trialActive: false,
			trialDaysLeft: 0,
			trialEndsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
			nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() as
				| string
				| null,
			proCancelAtPeriodEnd: false,
			accountCreatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
			balance: 42.5,
		},
		modes: [
			{
				id: "cryptdocker",
				label: "CryptDocker",
				shortLabel: "CryptDocker",
				description: "Crypto-native workflows, security hygiene, and wallet ops.",
			},
			{
				id: "market_analysis",
				label: "Market analysis",
				shortLabel: "Market",
				description: "Market structure, trends, and key levels.",
			},
			{
				id: "news_sentiment",
				label: "News sentiment",
				shortLabel: "News",
				description: "Summaries and sentiment based on current headlines.",
			},
		],
		conversations: [
			{
				id: "conv-1",
				title: "BTC weekly outlook",
				mode: "market_analysis",
				updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
				messageCount: 4,
				messages: [
					{
						id: "m-1",
						role: "user",
						content: "Give me a BTC weekly outlook.",
						createdAt: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
						tradeMode: "market_analysis",
					},
					{
						id: "m-2",
						role: "assistant",
						content:
							"Here’s a demo outlook: watch the prior weekly high/low, confirm trend via higher highs/lows, and size risk before entering.",
						createdAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
						suggestedQuestions: [
							"Key support/resistance levels?",
							"What invalidates the bullish thesis?",
							"How to manage risk on leverage?",
						],
					},
				],
			},
		],
	},
};

function normalizePath(url: string): { path: string; query: URLSearchParams } {
	const u = toUrl(url);
	const path = u.pathname.replace(/\/+$/, "") || "/";
	return { path, query: u.searchParams };
}

function requireAuth(headers?: Record<string, string>): boolean {
	const auth = headers?.Authorization ?? headers?.authorization ?? "";
	return auth.startsWith("Bearer ");
}

/** Same hostname normalization as the real public site-analysis route. */
function normalizePublicAnalysisDomain(input: string): string {
	const trimmed = input.trim();
	if (!trimmed) return "";
	const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
	try {
		const url = new URL(withScheme);
		return url.hostname.replace(/^www\./i, "").toLowerCase();
	} catch {
		return trimmed.replace(/^www\./i, "").toLowerCase();
	}
}

/** Known demo address for Wallet Analysis HIGH preset (must match main-demo quick-fill). */
const DEMO_WALLET_TRUST_DRAINER_LC = "0x463452c356322d463b84891ebda33daed274cb40";

function publicWalletAnalysisDemoData(address: string): Record<string, unknown> {
	const lower = address.trim().toLowerCase();
	if (lower === DEMO_WALLET_TRUST_DRAINER_LC) {
		return {
			address,
			score: 70,
			risk_level: "HIGH",
			confidence: 1,
			flags: {
				sanctioned: false,
				blacklisted: true,
				threat_actor: true,
				smart_money: false,
			},
			labels: [
				"CryptoGuard Engine",
				"OFAC US Treasury",
				"CryptoGuard ScamDB",
				"On-chain analysis",
			],
			entity: {
				name: "Trust Wallet drainer pattern (demo)",
				type: "drainer",
				id: "demo-trust-drainer",
			},
			signals: [
				{
					signal: "Risk Flag",
					contribution: 0,
					source: "CryptoGuard",
					matched_value: "[CryptoGuard] Address on security blacklist",
				},
				{
					signal: "Risk Flag",
					contribution: 0,
					source: "CryptoGuard",
					matched_value: "[CryptoGuard] Address associated with asset theft attacks",
				},
				{
					signal: "Risk Flag",
					contribution: 0,
					source: "CryptoGuard",
					matched_value: "Large single transaction relative to current balance",
				},
				{
					signal: "blacklist doubt",
					contribution: 0,
					source: "CryptoGuard",
					matched_value: "detected",
				},
				{
					signal: "stealing attack",
					contribution: 0,
					source: "CryptoGuard",
					matched_value: "detected",
				},
			],
			recommendation: {
				action: "BLOCK",
				summary: "HIGH risk wallet",
				details:
					"[CryptoGuard] Address on security blacklist; [CryptoGuard] Address associated with asset theft attacks; Large single transaction relative to current balance",
			},
			metadata: { demo: true },
		};
	}
	return {
		address,
		score: 40,
		risk_level: "MEDIUM",
		confidence: 1,
		flags: {
			sanctioned: false,
			blacklisted: false,
			threat_actor: true,
			smart_money: false,
		},
		labels: [
			"CryptoGuard Engine",
			"OFAC US Treasury",
			"CryptoGuard Scam DB",
			"On-chain analysis",
		],
		entity: {
			name: "Flagged counterparty (demo)",
			type: "threat_intelligence",
			id: "demo-medium",
		},
		signals: [
			{
				signal: "Risk Flag",
				contribution: 0,
				source: "CryptoGuard",
				matched_value: "[CryptoGuard] Address associated with asset theft attacks",
			},
			{
				signal: "Risk Flag",
				contribution: 0,
				source: "CryptoGuard",
				matched_value: "Large single transaction relative to current balance",
			},
			{
				signal: "stealing attack",
				contribution: 0,
				source: "CryptoGuard",
				matched_value: "detected",
			},
		],
		recommendation: {
			summary: "MEDIUM risk wallet",
			details:
				"[CryptoGuard] Address associated with asset theft attacks; Large single transaction relative to current balance",
		},
		metadata: { demo: true },
	};
}

function parsePublicNewsKeywords(body: unknown, query: URLSearchParams): string[] {
	const b = (body ?? {}) as { keywords?: unknown };
	if (Array.isArray(b.keywords)) {
		return b.keywords.map((k) => String(k ?? "").trim()).filter(Boolean).slice(0, 8);
	}
	if (typeof b.keywords === "string") {
		return b.keywords
			.split(/[,#]/)
			.map((k) => k.trim())
			.filter(Boolean)
			.slice(0, 8);
	}
	const q = query.get("keywords");
	if (typeof q === "string" && q.trim()) {
		return q
			.split(/[,#]/)
			.map((k) => k.trim())
			.filter(Boolean)
			.slice(0, 8);
	}
	return [];
}

export async function mockBackendRequest(req: MockRequest): Promise<MockReply> {
	const method = req.method;
	const { path, query } = normalizePath(req.url);
	const headers = req.headers ?? {};
	const body = safeJsonParse(req.body);

	// ── Main app endpoints (no /trade-gpt prefix) ────────────────────────────────
	if (path === "/auth/login" && method === "POST") {
		const b = (body ?? {}) as { email?: string };
		const email = String(b.email ?? store.user.email).trim() || store.user.email;
		store.user = { ...store.user, email, authProvider: "email" };
		const token = nextDemoToken();
		return json(true, 200, {
			token,
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				authProvider: "email",
				onboarded: true,
			},
		});
	}

	if (path === "/auth/register" && method === "POST") {
		const b = (body ?? {}) as { email?: string; fullName?: string };
		const email = String(b.email ?? store.user.email).trim() || store.user.email;
		store.user = {
			...store.user,
			email,
			fullName: String(b.fullName ?? store.user.fullName) || store.user.fullName,
			authProvider: "email",
		};
		const token = nextDemoToken();
		return json(true, 200, {
			requiresVerification: false,
			token,
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				authProvider: "email",
				onboarded: true,
			},
		});
	}

	if (path === "/auth/google" && method === "POST") {
		store.user = { ...store.user, authProvider: "google" };
		const token = nextDemoToken();
		return json(true, 200, {
			token,
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				authProvider: "google",
				onboarded: true,
			},
		});
	}

	if (path === "/auth/google/code" && method === "POST") {
		const token = nextDemoToken();
		store.user = { ...store.user, authProvider: "google" };
		return json(true, 200, {
			token,
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				authProvider: "google",
				onboarded: true,
			},
		});
	}

	if (path === "/auth/change-password" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const b = (body ?? {}) as {
			currentPassword?: string;
			newPassword?: string;
			confirmPassword?: string;
		};
		if (String(b.currentPassword ?? "") !== DEMO_CHANGE_PASSWORD_CURRENT) {
			return json(false, 400, { message: "Current password is incorrect." });
		}
		if (!b.newPassword || String(b.newPassword) !== String(b.confirmPassword ?? "")) {
			return json(false, 400, { message: "Passwords do not match." });
		}
		return json(true, 200, { message: "Password changed successfully (mock)." });
	}

	if (path === "/user" && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		return json(true, 200, {
			...store.user,
			siteUsers: store.siteUsers,
			userDevices: [
				{
					userUuid: store.user.uuid,
					deviceUuid: "dev-1",
					activate: true,
					device: {
						uuid: "dev-1",
						deviceId: "CRYPTDOCKER-DEMO-DEVICE",
						ipAddress: "203.0.113.10",
						country: "Japan",
						location: "Tokyo",
					},
				},
			],
			signInHistory: store.signInHistory.slice(0, 5),
		});
	}

	if (path === "/user" && method === "PUT") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		if (!body || typeof body !== "object") return json(false, 400, { message: "Invalid body" });
		const b = body as Record<string, unknown>;
		if (b.uuid && b.uuid !== store.user.uuid) {
			return json(false, 404, { message: "User not found" });
		}
		store.user = { ...store.user, ...(b as Partial<typeof store.user>) };
		return json(true, 200, { message: "Profile updated (mock)." });
	}

	if (path === "/user/avatar" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		store.user.avatar = "https://i.pravatar.cc/200?img=68";
		return json(true, 200, { message: "Avatar uploaded (mock).", avatar: store.user.avatar });
	}

	if (path.startsWith("/user/signin-history") && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const type = (query.get("type") ?? "Web") as "Web" | "App";
		const page = Math.max(1, Number(query.get("page") ?? 1));
		const limit = Math.max(1, Math.min(50, Number(query.get("limit") ?? 10)));
		const filtered = store.signInHistory.filter((x) => x.type === type);
		const start = (page - 1) * limit;
		const items = filtered.slice(start, start + limit);
		return json(true, 200, { items, total: filtered.length, page, limit });
	}

	if (path === "/user/favorites" && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		return json(true, 200, { siteIds: store.siteUsers.map((x) => x.siteUuid).filter(Boolean) });
	}

	if (path === "/user/favorites/sync" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		return json(true, 200, { ok: true });
	}

	if (path === "/user/upgrade-pro" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		store.user.paymentMethod = "pro";
		return json(true, 200, { message: "Upgraded to Pro (mock).", user: store.user });
	}

	if (path === "/user/cancel-pro" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		store.user.proCancelAtPeriodEnd = true;
		return json(true, 200, {
			message: "Pro will cancel at period end (mock).",
			user: store.user,
		});
	}

	if (path === "/constants/price" && method === "GET") {
		return json(true, 200, {
			price: {
				CryptDocker: 12,
				TradeGPT: 29,
				MentalShield: 15,
			},
		});
	}

	// ── Public marketing tools (/public/*) — used by Wallet / Site / News analysis pages ──
	if (path.startsWith("/public/wallet-analysis/") && method === "GET") {
		const encoded = path.slice("/public/wallet-analysis/".length);
		let address = encoded;
		try {
			address = decodeURIComponent(encoded);
		} catch {
			// keep raw segment
		}
		address = address.trim();
		if (!address) {
			return json(false, 400, { success: false, error: "address is required" });
		}
		return json(true, 200, {
			success: true,
			data: publicWalletAnalysisDemoData(address),
		});
	}

	if (path === "/public/wallet-analysis" && method === "POST") {
		const b = (body ?? {}) as { address?: string };
		const address = String(b.address ?? "").trim();
		if (!address) {
			return json(false, 400, { success: false, error: "address is required" });
		}
		return mockBackendRequest({
			...req,
			method: "GET",
			url: `/public/wallet-analysis/${encodeURIComponent(address)}`,
		});
	}

	if (path === "/public/site-analysis" && method === "POST") {
		const b = (body ?? {}) as { url?: string; domain?: string };
		const raw = String(b.url ?? b.domain ?? "").trim();
		const domain = normalizePublicAnalysisDomain(raw);
		if (!raw) {
			return json(false, 400, { success: false, error: "domain or url is required" });
		}
		if (!domain || !domain.includes(".")) {
			return json(false, 400, { success: false, error: "invalid domain" });
		}
		const label = domain.split(".")[0] || domain;
		return json(true, 200, {
			success: true,
			domain,
			summary: `Demo headlines for **${domain}**: product updates, regulation, and market chatter are summarized here without calling external SERP or OpenAI.`,
			sentiment: "neutral",
			takeaway: `Treat this as a UI preview only; connect to the live app for real news-driven sentiment.`,
			items: [
				{
					title: `${label} in focus: what traders watched this week (demo)`,
					link: `https://${domain}`,
					snippet: `Synthetic snippet for the CryptDocker demo build.`,
					date: new Date().toISOString().slice(0, 10),
					source: "Demo feed",
				},
				{
					title: `Industry roundup mentions ${domain} alongside majors (demo)`,
					link: `https://${domain}/news`,
					snippet: "Second mock article so the list layout renders realistically.",
					date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
					source: "Demo feed",
				},
			],
		});
	}

	if (path.startsWith("/public/site-analysis/") && method === "GET") {
		const encoded = path.slice("/public/site-analysis/".length);
		let domain = encoded;
		try {
			domain = decodeURIComponent(encoded);
		} catch {
			// keep raw
		}
		return mockBackendRequest({
			...req,
			method: "POST",
			url: "/public/site-analysis",
			body: JSON.stringify({ domain }),
		});
	}

	if (path === "/public/news-analysis" && method === "POST") {
		const keywords = parsePublicNewsKeywords(body, query);
		if (keywords.length === 0) {
			return json(true, 200, {
				success: true,
				summary: "Add at least one keyword for a richer demo story.",
				sentiment: "neutral",
				takeaway: "Try suggested tags like Bitcoin or DeFi.",
				items: [],
			});
		}
		const topic = keywords.join(", ");
		return json(true, 200, {
			success: true,
			summary: `Demo digest for **${topic}**: narratives are mixed; this text stands in for OpenAI + SERP on the production site.`,
			sentiment: "bullish",
			takeaway: "Mock data only — use the live CryptDocker build for real sentiment.",
			items: keywords.slice(0, 3).map((kw, i) => ({
				title: `${kw}: weekly flow and positioning (demo headline ${i + 1})`,
				link: "https://cryptdocker.com",
				snippet: `Illustrative snippet for keyword “${kw}”.`,
				date: new Date(Date.now() - i * 43200000).toISOString().slice(0, 10),
				source: "CryptDocker demo",
			})),
		});
	}

	if (path === "/public/news-analysis" && method === "GET") {
		return mockBackendRequest({
			...req,
			method: "POST",
			body: JSON.stringify({ keywords: parsePublicNewsKeywords(body, query) }),
		});
	}

	if (path === "/user/subscriptions" && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const s = store.mentalShieldProjectSub;
		const trialEnd = s.trialExpiresAt ? new Date(s.trialExpiresAt).getTime() : NaN;
		const trialStillActive =
			s.trialActive &&
			Number.isFinite(trialEnd) &&
			trialEnd > Date.now() &&
			s.paymentMethod !== "pro";
		const trialDaysLeft = trialStillActive
			? Math.max(0, Math.ceil((trialEnd - Date.now()) / (1000 * 60 * 60 * 24)))
			: s.trialDaysLeft;
		return json(true, 200, {
			subscriptions: [
				{
					...s,
					trialActive: trialStillActive,
					trialDaysLeft,
				},
			],
		});
	}

	const subProjectAction = path.match(/^\/user\/subscriptions\/([^/]+)\/(upgrade-pro|cancel-pro)$/);
	if (subProjectAction && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const project = String(subProjectAction[1] ?? "").toLowerCase();
		const action = subProjectAction[2];
		if (project !== "mentalshield") {
			return json(false, 404, { message: "Unknown project (mock)." });
		}
		if (action === "upgrade-pro") {
			const nextBill = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
			store.mentalShieldProjectSub = {
				...store.mentalShieldProjectSub,
				paymentMethod: "pro",
				trialActive: false,
				trialExpiresAt: null,
				trialDaysLeft: 0,
				billingDate: nextBill,
				nextBillingDate: nextBill,
				proCancelAtPeriodEnd: false,
			};
		} else {
			store.mentalShieldProjectSub = {
				...store.mentalShieldProjectSub,
				proCancelAtPeriodEnd: true,
			};
		}
		return json(true, 200, { message: "Subscription updated (mock).", user: store.user });
	}

	if (path === "/workspace" && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		return json(true, 200, store.workspaces);
	}

	if (path === "/workspace" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const b = (body ?? {}) as { name?: string };
		const name = String(b.name ?? "").trim() || "New workspace";
		const created = { uuid: `ws-${store.workspaces.length + 1}`, name };
		store.workspaces = [...store.workspaces, created];
		return json(true, 200, created);
	}

	if (path.startsWith("/workspace/") && method === "DELETE") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const uuid = path.split("/")[2] ?? "";
		store.workspaces = store.workspaces.filter((w) => w.uuid !== uuid);
		store.siteUsers = store.siteUsers.map((su) =>
			su.workspaceUuid === uuid ? { ...su, workspaceUuid: null, workspace: null } : su,
		);
		return json(true, 200, { success: true });
	}

	if (path === "/site" && method === "GET") {
		const sites = [
			{
				uuid: "site-1",
				type: "native",
				title: "Binance",
				url: "https://www.binance.com",
				image: null,
				description: "Crypto exchange (demo catalog entry).",
				endpoint: null,
				categories: [
					{ uuid: "cat-exchange", name: "Exchange" },
					{ uuid: "cat-trading", name: "Trading" },
				],
			},
			{
				uuid: "site-2",
				type: "native",
				title: "CoinMarketCap",
				url: "https://coinmarketcap.com",
				image: null,
				description: "Market data (demo catalog entry).",
				endpoint: null,
				categories: [
					{ uuid: "cat-market-data", name: "Market data" },
					{ uuid: "cat-research", name: "Research" },
				],
			},
			{
				uuid: "site-3",
				type: "custom",
				title: "My Custom Site",
				url: "https://example.com",
				image: null,
				description: "Custom site (demo catalog entry).",
				endpoint: null,
				categories: [{ uuid: "cat-custom", name: "Custom" }],
			},
		] as Array<{
			uuid: string;
			type?: string;
			title: string | null;
			url?: string | null;
			image?: string | null;
			description?: string | null;
			endpoint?: string | null;
			categories?: Array<{ uuid: string; name: string }>;
		}>;

		const q = String(query.get("q") ?? "").trim().toLowerCase();
		const type = String(query.get("type") ?? "").trim().toLowerCase();

		const filtered = sites.filter((s) => {
			if (type && String(s.type ?? "").toLowerCase() !== type) return false;
			if (!q) return true;
			const hay = `${s.title ?? ""} ${s.url ?? ""} ${s.description ?? ""}`.toLowerCase();
			return hay.includes(q);
		});

		return json(true, 200, filtered);
	}

	if (path === "/site-user" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const b = (body ?? {}) as Record<string, unknown>;
		const created = {
			uuid: `su-${store.siteUsers.length + 1}`,
			siteUuid: String(b.siteUuid ?? "site-new"),
			sortKey: store.siteUsers.length + 1,
			workspaceUuid: typeof b.workspaceUuid === "string" ? b.workspaceUuid : null,
			title: "New site",
			icon: null,
			notificationEnabled: true,
			soundEnabled: true,
			hibernation: 0,
			endpoint: typeof b.endpoint === "string" ? b.endpoint : null,
			site: { uuid: String(b.siteUuid ?? "site-new"), title: "New site", url: null, image: null },
			workspace:
				typeof b.workspaceUuid === "string"
					? store.workspaces.find((w) => w.uuid === b.workspaceUuid) ?? null
					: null,
		};
		store.siteUsers = [...store.siteUsers, created];
		return json(true, 200, created);
	}

	if (path.startsWith("/site-user/") && method === "PATCH") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const uuid = path.split("/")[2] ?? "";
		const idx = store.siteUsers.findIndex((x) => x.uuid === uuid);
		if (idx < 0) return json(false, 404, { message: "Not found" });
		const patch = (body ?? {}) as Record<string, unknown>;
		const updated = { ...store.siteUsers[idx], ...(patch as Record<string, unknown>) };
		// Update derived workspace object if workspaceUuid changed
		if (Object.prototype.hasOwnProperty.call(patch, "workspaceUuid")) {
			const wsId = patch.workspaceUuid;
			(updated as any).workspace =
				typeof wsId === "string" ? store.workspaces.find((w) => w.uuid === wsId) ?? null : null;
		}
		store.siteUsers = store.siteUsers.map((x, i) => (i === idx ? (updated as any) : x));
		return json(true, 200, updated);
	}

	if (path.startsWith("/site-user/") && method === "DELETE") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const uuid = path.split("/")[2] ?? "";
		store.siteUsers = store.siteUsers.filter((x) => x.uuid !== uuid);
		return json(true, 200, { success: true });
	}

	// ── TradeGPT endpoints (/trade-gpt/...) ─────────────────────────────────────
	if (path === "/trade-gpt/auth/register" && method === "POST") {
		const b = (body ?? {}) as { email?: string };
		return json(true, 200, { message: "Account created (mock).", email: b.email ?? store.user.email });
	}

	if (path === "/trade-gpt/auth/verify-email" && method === "POST") {
		return json(true, 200, {
			token: "demo-token",
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				balance: Number(store.user.balance ?? 0),
			},
			subscription: store.tradeGpt.subscription,
		});
	}

	if (path === "/trade-gpt/auth/resend-code" && method === "POST") {
		return json(true, 200, { message: "Verification code sent (mock)." });
	}

	if (path === "/trade-gpt/auth/login" && method === "POST") {
		return json(true, 200, {
			token: "demo-token",
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				balance: Number(store.user.balance ?? 0),
			},
			subscription: store.tradeGpt.subscription,
		});
	}

	if (path === "/trade-gpt/auth/google" && method === "POST") {
		return json(true, 200, {
			token: "demo-token",
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				balance: Number(store.user.balance ?? 0),
			},
			subscription: store.tradeGpt.subscription,
		});
	}

	if (path === "/trade-gpt/auth/google/code" && method === "POST") {
		return json(true, 200, {
			token: "demo-token",
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				balance: Number(store.user.balance ?? 0),
			},
			subscription: store.tradeGpt.subscription,
		});
	}

	if (path === "/trade-gpt/auth/me" && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Session expired." });
		return json(true, 200, {
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				balance: Number(store.user.balance ?? 0),
			},
			subscription: store.tradeGpt.subscription,
		});
	}

	if (path === "/trade-gpt/auth/change-password" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Session expired." });
		return json(true, 200, { message: "Password changed (mock)." });
	}

	if (path === "/trade-gpt/subscription/me" && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		return json(true, 200, { subscription: store.tradeGpt.subscription });
	}

	if (path === "/trade-gpt/subscription/upgrade" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		store.tradeGpt.subscription = {
			...store.tradeGpt.subscription,
			plan: "pro",
			label: "Pro",
			nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
			proCancelAtPeriodEnd: false,
		};
		return json(true, 200, { subscription: store.tradeGpt.subscription, message: "Upgraded (mock)." });
	}

	if (path === "/trade-gpt/subscription/downgrade" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		store.tradeGpt.subscription = {
			...store.tradeGpt.subscription,
			proCancelAtPeriodEnd: true,
			label: "Pro — Cancellation Scheduled",
		};
		return json(true, 200, {
			subscription: store.tradeGpt.subscription,
			message: "Downgraded (mock).",
		});
	}

	if (path === "/payment" && method === "POST") {
		const p = (body ?? {}) as { amount?: number; ticker?: string };
		return json(true, 200, {
			uuid: `pay-${Date.now()}`,
			addressIn: "0xDEMO_PAYMENT_ADDRESS",
			amount: Number(p.amount ?? 25),
			ticker: String(p.ticker ?? "usdt"),
			minimumTransactionCoin: 0.001,
			status: "pending",
		});
	}

	if (path.startsWith("/payment/") && path.endsWith("/status") && method === "GET") {
		const uuid = path.split("/")[2] ?? "pay-demo";
		return json(true, 200, {
			uuid,
			status: "pending",
			addressIn: "0xDEMO_PAYMENT_ADDRESS",
			amount: 25,
			ticker: "usdt",
			minimumTransactionCoin: 0.001,
		});
	}

	if (path === "/trade-gpt/payment/networks" && method === "GET") {
		return json(true, 200, {
			price: 25,
			networks: [
				{ id: "eth", label: "Ethereum", tokens: ["usdt", "usdc"] },
				{ id: "bsc", label: "BNB Chain", tokens: ["usdt", "usdc"] },
				{ id: "tron", label: "Tron", tokens: ["usdt"] },
				{ id: "sol", label: "Solana", tokens: ["usdc"] },
			],
		});
	}

	if (path === "/trade-gpt/payment/create-checkout" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		return json(true, 200, {
			paymentId: `chk-${Date.now()}`,
			addressIn: "0xDEMO_CHECKOUT_ADDRESS",
			amount: 25,
			network: "eth",
			token: "usdt",
			networkLabel: "Ethereum",
			qrCode: null,
			expiresAt: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
			status: "pending",
		});
	}

	if (path.startsWith("/trade-gpt/payment/status/") && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const paymentId = path.split("/").pop() ?? "chk-demo";
		return json(true, 200, {
			paymentId,
			status: "pending",
			amount: 25,
			network: "eth",
			token: "usdt",
			addressIn: "0xDEMO_CHECKOUT_ADDRESS",
			expiresAt: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
		});
	}

	if (path.startsWith("/trade-gpt/payment/cancel/") && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		return json(true, 200, { ok: true });
	}

	if (path.startsWith("/trade-gpt/payment/check-logs/") && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const paymentId = path.split("/").pop() ?? "chk-demo";
		return json(true, 200, {
			paymentId,
			status: "confirmed",
			amount: 25,
			network: "eth",
			token: "usdt",
			addressIn: "0xDEMO_CHECKOUT_ADDRESS",
			expiresAt: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
			subscription: { ...store.tradeGpt.subscription, plan: "pro", label: "Pro" },
		});
	}

	if (path === "/trade-gpt/user/notifications" && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		return json(true, 200, { notifications: { productUpdates: true, marketing: false } });
	}

	if (path === "/trade-gpt/user/notifications" && method === "PATCH") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const prefs = (body ?? {}) as Record<string, unknown>;
		return json(true, 200, {
			notifications: {
				productUpdates: Boolean(prefs.productUpdates ?? true),
				marketing: Boolean(prefs.marketing ?? false),
			},
		});
	}

	if (path === "/trade-gpt/chat/modes" && method === "GET") {
		return json(true, 200, { modes: store.tradeGpt.modes });
	}

	if (path === "/trade-gpt/chat/conversations" && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		return json(true, 200, {
			conversations: store.tradeGpt.conversations.map((c) => ({
				id: c.id,
				title: c.title,
				mode: c.mode,
				updatedAt: c.updatedAt,
				messageCount: c.messageCount,
			})),
		});
	}

	if (path === "/trade-gpt/chat/conversations" && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const b = (body ?? {}) as { mode?: string };
		const id = `conv-${Date.now()}`;
		const created = {
			id,
			title: "New chat",
			mode: (b.mode ?? "cryptdocker") as any,
			updatedAt: nowIso(),
			messageCount: 0,
			messages: [],
		};
		store.tradeGpt.conversations = [created as any, ...store.tradeGpt.conversations];
		return json(true, 200, { id: created.id, title: created.title, mode: created.mode });
	}

	if (path.startsWith("/trade-gpt/chat/conversations/") && method === "GET") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const id = path.split("/")[4] ?? "";
		const conv = store.tradeGpt.conversations.find((c) => c.id === id);
		if (!conv) return json(false, 404, { message: "Conversation not found." });
		return json(true, 200, {
			id: conv.id,
			title: conv.title,
			mode: conv.mode,
			messages: conv.messages,
		});
	}

	if (path.startsWith("/trade-gpt/chat/conversations/") && method === "PATCH") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const id = path.split("/")[4] ?? "";
		const idx = store.tradeGpt.conversations.findIndex((c) => c.id === id);
		if (idx < 0) return json(false, 404, { message: "Conversation not found." });
		const b = (body ?? {}) as { mode?: string };
		(store.tradeGpt.conversations[idx] as any).mode = (b.mode ?? "cryptdocker") as any;
		(store.tradeGpt.conversations[idx] as any).updatedAt = nowIso();
		return json(true, 200, { id, mode: (store.tradeGpt.conversations[idx] as any).mode });
	}

	if (path.startsWith("/trade-gpt/chat/conversations/") && method === "DELETE") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const parts = path.split("/");
		const id = parts[4] ?? "";
		// DELETE /trade-gpt/chat/conversations/:id
		if (parts.length === 5) {
			store.tradeGpt.conversations = store.tradeGpt.conversations.filter((c) => c.id !== id);
			return json(true, 200, { ok: true });
		}
		return json(false, 404, { message: "Not found" });
	}

	if (path === "/trade-gpt/chat/conversations" && method === "DELETE") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		const deletedConversations = store.tradeGpt.conversations.length;
		const deletedMessages = store.tradeGpt.conversations.reduce(
			(acc, c) => acc + (c.messages?.length ?? 0),
			0,
		);
		store.tradeGpt.conversations = [];
		return json(true, 200, { deletedConversations, deletedMessages });
	}

	if (path.endsWith("/rollback") && method === "POST") {
		if (!requireAuth(headers)) return json(false, 401, { message: "Unauthorized" });
		return json(true, 200, { ok: true, removed: 0 });
	}

	// In demo we don't use the real SSE endpoint; see `streamAssistantReply` mock.

	return json(false, 404, {
		message: `No mock implemented for ${method} ${path}`,
	});
}

