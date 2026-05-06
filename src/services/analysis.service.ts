import { apiFetch } from "./api";

/* ---------------- Wallet Analysis (FailSafe Radar proxy) ---------------- */

export interface RadarFlags {
	sanctioned?: boolean;
	blacklisted?: boolean;
	threat_actor?: boolean;
	smart_money?: boolean;
}

export interface RadarEntity {
	name: string;
	type: string;
	id: string;
}

export interface RadarSignal {
	signal: string;
	contribution: number;
	source: string;
	matched_value: string;
}

export interface RadarRecommendation {
	action: string;
	summary: string;
	details: string;
}

export interface RadarRiskResponse {
	address: string;
	score: number;
	risk_level: string;
	confidence: number;
	flags: RadarFlags;
	entity?: RadarEntity;
	signals?: RadarSignal[];
	labels?: string[];
	recommendation?: RadarRecommendation;
	metadata?: Record<string, unknown>;
}

export interface WalletAnalysisResponse {
	success: boolean;
	data?: RadarRiskResponse;
	error?: string;
}

export const analyzeWallet = (
	address: string,
): Promise<WalletAnalysisResponse> =>
	apiFetch<WalletAnalysisResponse>(
		`/public/wallet-analysis/${encodeURIComponent(address.trim())}`,
	);

/* ---------------- Site Analysis (trust score) ---------------- */

export interface SiteAnalysisResponse {
	success: boolean;
	domain?: string;
	summary?: string;
	sentiment?: string;
	takeaway?: string;
	items?: NewsAnalysisItem[];
	error?: string;
}

export const analyzeSite = (url: string): Promise<SiteAnalysisResponse> =>
	apiFetch<SiteAnalysisResponse>(`/public/site-analysis`, {
		method: "POST",
		body: JSON.stringify({ url: url.trim() }),
	});

/* ---------------- News Analysis ---------------- */

export interface NewsAnalysisItem {
	title: string;
	link: string;
	snippet?: string;
	date?: string;
	published_at?: string;
	favicon?: string;
	source?: string;
	thumbnail?: string;
}

export interface NewsAnalysisResponse {
	success: boolean;
	summary?: string;
	sentiment?: string;
	takeaway?: string;
	items?: NewsAnalysisItem[];
	error?: string;
}

export const analyzeNews = (
	keywords: string[],
): Promise<NewsAnalysisResponse> =>
	apiFetch<NewsAnalysisResponse>(`/public/news-analysis`, {
		method: "POST",
		body: JSON.stringify({ keywords }),
	});
