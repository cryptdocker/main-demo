export type DemoMockAssistantReply = {
	/** Short title for the mock “done” event (conversation list). */
	title: string;
	/** Markdown body: one product feature per reply. */
	body: string;
};

function hashPick(seed: string, modulo: number): number {
	let h = 0;
	for (let i = 0; i < seed.length; i++) {
		h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
	}
	const n = Math.abs(h) % modulo;
	return Number.isFinite(n) ? n : 0;
}

/**
 * Rotating demo replies (18). Each item highlights a single CryptDocker, TradeGPT, or MentalShield capability.
 * Selection is deterministic from `conversationId` + user message so repeat sends feel stable.
 */
export const DEMO_MOCK_ASSISTANT_REPLIES: readonly DemoMockAssistantReply[] = [
	{
		title: "CryptDocker — Workspaces",
		body:
			"## CryptDocker: Workspaces\n\n" +
			"Workspaces let you group exchanges, dashboards, and research tools into separate contexts—**Work**, **Personal**, or anything you name—so tabs and notifications stay organized instead of one flat list.\n\n" +
			"When you add a site to a workspace, you can move it later without losing credentials stored for that profile.",
	},
	{
		title: "CryptDocker — Per-site profiles",
		body:
			"## CryptDocker: Per-site profiles\n\n" +
			"Each **site user** entry can carry its own session: cookies and storage are isolated per site instance, which helps when you run multiple accounts or separate risk profiles on the same exchange.\n\n" +
			"You can tune **notifications** and **sound** per site so only high-signal apps interrupt you.",
	},
	{
		title: "CryptDocker — Secure container",
		body:
			"## CryptDocker: Secure container\n\n" +
			"CryptDocker wraps web apps in a hardened desktop shell so crypto workflows stay off a plain system browser with dozens of unrelated extensions.\n\n" +
			"That separation reduces accidental clipboard leaks and makes it easier to spot which window is “live trading” versus casual browsing.",
	},
	{
		title: "CryptDocker — Device & sign-in",
		body:
			"## CryptDocker: Devices & sign-in history\n\n" +
			"The dashboard lists **activated devices** and recent **sign-in history** (approximate location, IP, client type) so you can revoke access or investigate unfamiliar logins quickly.\n\n" +
			"Use it as a routine security check alongside your exchange’s own device list.",
	},
	{
		title: "CryptDocker — Pro & billing",
		body:
			"## CryptDocker: Pro & billing\n\n" +
			"**Pro** unlocks higher limits and premium workflows; billing shows your next renewal and supports cancellation at period end without losing access until the paid window closes.\n\n" +
			"**Top up** balance when your account uses prepaid credits for add-on products.",
	},
	{
		title: "CryptDocker — News keywords",
		body:
			"## CryptDocker: News keywords\n\n" +
			"Your profile can store **news keywords** (comma-separated tickers or topics) so digest and alert surfaces can prioritize what you actually trade—BTC, ETH, macro, or a niche sector.\n\n" +
			"Refine the list as your book changes so noise stays low.",
	},
	{
		title: "CryptDocker — Catalog & custom sites",
		body:
			"## CryptDocker: Site catalog\n\n" +
			"The built-in **catalog** lists curated native integrations; you can also add **custom URLs** for internal dashboards or niche venues.\n\n" +
			"Search filters help you find an exchange or data site without memorizing exact titles.",
	},
	{
		title: "TradeGPT — Modes",
		body:
			"## TradeGPT: Analysis modes\n\n" +
			"TradeGPT routes your question through a **mode** (for example **Market analysis**, **News sentiment**, or **CryptDocker** help) so the assistant frames answers with the right vocabulary and constraints.\n\n" +
			"Switch the mode in the header when your question changes from charts to platform how-tos.",
	},
	{
		title: "TradeGPT — Streaming chat",
		body:
			"## TradeGPT: Streaming replies\n\n" +
			"Answers **stream token-by-token** so you can start reading partial reasoning immediately instead of waiting for a full completion.\n\n" +
			"While a reply is in flight the composer locks—when the stream finishes, history syncs to the server-backed thread.",
	},
	{
		title: "TradeGPT — Edit & rollback",
		body:
			"## TradeGPT: Edit & rollback\n\n" +
			"You can **edit a previous user message** from the transcript; sending replaces that message and **removes all assistant replies after it**, like rewinding a branch in git.\n\n" +
			"Use it to fix typos or try a sharper prompt without starting a brand-new chat.",
	},
	{
		title: "TradeGPT — Export history",
		body:
			"## TradeGPT: Export chat history\n\n" +
			"From the sidebar you can **export** conversations as plain text: titles, timestamps, modes, and each user/assistant turn in order.\n\n" +
			"It is useful for compliance notes, journaling, or pasting highlights into a research doc.",
	},
	{
		title: "TradeGPT — Subscription",
		body:
			"## TradeGPT: Subscription & balance\n\n" +
			"TradeGPT **Pro** is billed alongside your CryptDocker account; the sidebar shows plan state and next billing when applicable.\n\n" +
			"Upgrade/downgrade flows are integrated so you are not juggling a separate vendor portal for this product.",
	},
	{
		title: "TradeGPT — Sidebar & threads",
		body:
			"## TradeGPT: Conversation list\n\n" +
			"The **sidebar** keeps every thread with its title and active mode; you can delete one chat or wipe all history from the demo menu.\n\n" +
			"Collapsing the rail preserves horizontal space on smaller screens.",
	},
	{
		title: "MentalShield — Extension",
		body:
			"## MentalShield: Browser extension\n\n" +
			"MentalShield ships as a **Chrome extension** (with other browsers planned) that layers guardrails on top of the sites you already use—especially high-impulse trading pages.\n\n" +
			"Install it once, then configure rules that match your risk tolerance.",
	},
	{
		title: "MentalShield — Impulse guard",
		body:
			"## MentalShield: Impulse guard\n\n" +
			"The extension can insert **cool-down prompts** or confirmations before certain actions—so a fat-finger order or revenge trade faces one extra friction step.\n\n" +
			"Friction is configurable: strict days vs lighter nudges.",
	},
	{
		title: "MentalShield — Exchange awareness",
		body:
			"## MentalShield: Context on exchanges\n\n" +
			"When you visit supported trading domains, MentalShield can surface **short mindset reminders** (session goals, max loss, or “why am I here?”) tied to your own presets.\n\n" +
			"It complements TradeGPT education mode: one is conversational coaching, the other is in-the-moment UI.",
	},
	{
		title: "MentalShield — Privacy posture",
		body:
			"## MentalShield: Privacy posture\n\n" +
			"Sensitive guardrail state should stay **local to your browser profile** rather than broadcast to every tab; MentalShield is designed around minimal telemetry and explicit opt-in where analytics exist.\n\n" +
			"Review the extension permissions list before enabling aggressive blocking rules.",
	},
	{
		title: "CryptDocker — Favorites sync",
		body:
			"## CryptDocker: Favorites sync\n\n" +
			"Starred or **favorite** sites can sync across sessions so a rebuilt machine or fresh install recovers your shortlist quickly.\n\n" +
			"Pair favorites with workspace assignment to keep “daily drivers” one click away.",
	},
];

export function pickDemoMockAssistantReply(conversationId: string, userText: string): DemoMockAssistantReply {
	const seed = `${conversationId}\n${userText.trim()}`;
	const idx = hashPick(seed, DEMO_MOCK_ASSISTANT_REPLIES.length);
	return DEMO_MOCK_ASSISTANT_REPLIES[idx]!;
}
