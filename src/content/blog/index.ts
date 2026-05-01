import introducingAiRiskAnalysis from "./introducing-ai-risk-analysis.md?raw";
import workspaceIsolationExplained from "./workspace-isolation-explained.md?raw";
import chromeExtensionsInCryptdocker from "./chrome-extensions-in-cryptdocker.md?raw";
import perSiteProxyGuide from "./per-site-proxy-guide.md?raw";
import cryptdockerProLaunch from "./cryptdocker-pro-launch.md?raw";
import yearInReview2025 from "./2025-year-in-review.md?raw";

export interface BlogPostMeta {
	slug: string;
	title: string;
	excerpt: string;
	category: string;
	date: string;
	readTime: string;
	content: string;
}

export const blogPosts: BlogPostMeta[] = [
	{
		slug: "introducing-ai-risk-analysis",
		title: "Introducing AI-Powered Risk Analysis",
		excerpt:
			"Evaluate any DeFi platform or exchange before connecting. Our new AI tool gives you safety scores, threat summaries, and actionable insights.",
		category: "Product",
		date: "Feb 28, 2026",
		readTime: "4 min read",
		content: introducingAiRiskAnalysis,
	},
	{
		slug: "workspace-isolation-explained",
		title: "How Session Isolation Keeps You Safe",
		excerpt:
			"Learn how CryptDocker's workspace-level session isolation lets you manage multiple accounts securely and privately.",
		category: "Security",
		date: "Feb 15, 2026",
		readTime: "5 min read",
		content: workspaceIsolationExplained,
	},
	{
		slug: "chrome-extensions-in-cryptdocker",
		title: "Your Favorite Chrome Extensions, Inside CryptDocker",
		excerpt:
			"We now support installing and managing Chrome extensions directly. Here's how to set them up and get the most out of them.",
		category: "Tutorial",
		date: "Jan 30, 2026",
		readTime: "3 min read",
		content: chromeExtensionsInCryptdocker,
	},
	{
		slug: "per-site-proxy-guide",
		title: "The Complete Guide to Per-Site Proxies",
		excerpt:
			"Route each crypto app through its own proxy connection. This guide covers HTTP, SOCKS5, and per-workspace configuration.",
		category: "Tutorial",
		date: "Jan 12, 2026",
		readTime: "6 min read",
		content: perSiteProxyGuide,
	},
	{
		slug: "cryptdocker-pro-launch",
		title: "CryptDocker Pro: Unlimited Apps, AI Tools & More",
		excerpt:
			"Today we're launching CryptDocker Pro with unlimited workspaces, GPT-5 chatbot, risk analysis, and premium support.",
		category: "Announcement",
		date: "Dec 20, 2025",
		readTime: "3 min read",
		content: cryptdockerProLaunch,
	},
	{
		slug: "2025-year-in-review",
		title: "2025 Year in Review: What We Built",
		excerpt:
			"A look back at everything we shipped in 2025 — from AI integration to Chrome extension support and crypto payments.",
		category: "Company",
		date: "Dec 1, 2025",
		readTime: "7 min read",
		content: yearInReview2025,
	},
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
	return blogPosts.find((p) => p.slug === slug);
}
