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
		authProvider: "password",
		emailVerified: true,
		walletAddress: "0xDEMO000000000000000000000000000000000000",
		newsKeywords: "bitcoin, ethereum, solana",
		balance: 42.5,
		paymentMethod: "pro" as const,
		billingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
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
	tradeGpt: {
		subscription: {
			plan: "pro" as const,
			label: "Pro",
			trialActive: false,
			trialDaysLeft: 0,
			trialEndsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
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

export async function mockBackendRequest(req: MockRequest): Promise<MockReply> {
	const method = req.method;
	const { path, query } = normalizePath(req.url);
	const headers = req.headers ?? {};
	const body = safeJsonParse(req.body);

	// ── Main app endpoints (no /trade-gpt prefix) ────────────────────────────────
	if (path === "/auth/login" && method === "POST") {
		const b = (body ?? {}) as { email?: string };
		const email = String(b.email ?? store.user.email).trim() || store.user.email;
		store.user = { ...store.user, email };
		return json(true, 200, {
			token: "demo-token",
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				authProvider: "password",
				onboarded: true,
			},
		});
	}

	if (path === "/auth/register" && method === "POST") {
		const b = (body ?? {}) as { email?: string; fullName?: string };
		const email = String(b.email ?? store.user.email).trim() || store.user.email;
		store.user = { ...store.user, email, fullName: String(b.fullName ?? store.user.fullName) || store.user.fullName };
		return json(true, 200, {
			requiresVerification: false,
			token: "demo-token",
			user: {
				uuid: store.user.uuid,
				email: store.user.email,
				fullName: store.user.fullName,
				avatar: store.user.avatar,
				authProvider: "password",
				onboarded: true,
			},
		});
	}

	if (path === "/auth/google" && method === "POST") {
		return json(true, 200, {
			token: "demo-token",
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
		return json(true, 200, {
			token: "demo-token",
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
		store.tradeGpt.subscription = { ...store.tradeGpt.subscription, plan: "pro", label: "Pro" };
		return json(true, 200, { subscription: store.tradeGpt.subscription, message: "Upgraded (mock)." });
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

