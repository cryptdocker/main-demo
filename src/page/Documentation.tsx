import { useMemo } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoDownloadOutline, IoArrowForward } from "react-icons/io5";
import { PageHeader } from "../layout/PageHeader";
import { SEO } from "../component/SEO";
import { PATH } from "../const";
import { detectOS } from "../utils/detectOS";

const DOWNLOAD_URL_WINDOWS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.exe";
const DOWNLOAD_URL_MACOS =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker.dmg";
const DOWNLOAD_URL_LINUX =
	"https://cryptdocker.s3.eu-north-1.amazonaws.com/setup/CryptDocker-1.0.0.AppImage";

const DOC_MD = `
## 1. What is CryptDocker?

### 1.1 Definition
CryptDocker is a desktop app hub built for crypto users. It helps you run many crypto apps (exchanges, wallets, DeFi tools, dashboards) in a single organized workspace—without juggling dozens of browser tabs. Under the hood it uses Electron + Chromium webviews, so your favorite web apps behave like a native desktop experience.

### 1.2 Why was CryptDocker developed?
Crypto workflows usually require multiple accounts, multiple wallets, and multiple tools running at the same time. In a regular browser, sessions can clash, tabs can eat RAM, and privacy controls are coarse. CryptDocker was developed to provide:

- **Clean organization**: apps grouped into workspaces with fast switching
- **Isolation**: separated sessions so you can log into multiple accounts safely
- **Performance**: hibernate idle apps to reduce memory/CPU pressure
- **Privacy controls**: per-site proxy routing when you need it
- **Extension support**: Chrome extensions inside your desktop environment
- **Built-in AI Tools**: instantly analyze risks, summarize news, and ask questions right from your workspace

---

## 2. Who uses CryptDocker?

### 2.1 What does CryptDocker solve?
- **Too many tabs**: replaces your "crypto tab jungle" with a sidebar of apps and workspaces.
- **Multiple accounts**: isolates sessions so accounts don't collide (cookies/localStorage/cache separated by partition).
- **Heavy dApps**: reduces resource usage by hibernating idle apps and restoring them on demand.
- **Network separation**: routes specific apps through specific proxies (HTTP/SOCKS5) without affecting everything else.
- **Scams & Information Overload**: integrated AI analyzes risks and news for every dApp you visit.

### 2.2 Who are CryptDocker's potential customers?
- **Traders & investors** managing multiple exchanges, analytics, and alerts
- **Airdrop & DeFi users** running multiple wallets/accounts with strong session separation
- **Web3 builders & QA** needing repeatable environments for testing and multi-account flows
- **Privacy/OPSEC-focused users** who want per-app network routing and less cross-site leakage

---

## 3. What are the alternatives to CryptDocker?

CryptDocker overlaps with "app browsers" and "workspace browsers," but it's optimized for crypto workflows: multi-account isolation, extensions, per-site networking controls, and AI risk analysis.

### 3.1 Rambox vs. CryptDocker
- **Rambox**: general-purpose messaging/productivity app aggregator.
- **CryptDocker**: crypto-first desktop hub with stronger emphasis on session isolation, extensions (wallets), and per-site proxy routing for dApps.

### 3.2 Shift vs. CryptDocker
- **Shift**: centered around email/account switching and productivity web apps.
- **CryptDocker**: designed for running many crypto web apps concurrently, with isolation + hibernation + proxy controls for heavy dApps.

### 3.3 Wavebox vs. CryptDocker
- **Wavebox**: powerful Chromium workspace browser often used for SaaS.
- **CryptDocker**: focuses on crypto-native workflows (wallet extensions, session separation for multiple accounts, app/workspace organization tuned for crypto use).

---

## 4. Features of CryptDocker

### 4.1 App management
Add apps from a catalog or any custom URL, then launch them from a single sidebar.

### 4.2 Workspaces
Group apps into color-coded workspaces, expand/collapse them, and drag & drop apps between groups.

### 4.3 Session isolation
Each workspace (and some per-site cases) runs in an isolated Chromium partition—helpful for logging into multiple accounts on the same service at the same time.

### 4.4 Per-site proxies (HTTP/SOCKS5)
Route specific apps through specific proxy settings. This is useful for privacy, regional routing, or separation between identities.

### 4.5 Smart hibernation
Automatically hibernate idle apps to save memory and CPU, then wake them when needed.

### 4.6 Chrome extensions inside the app
Install and use Chrome extensions within CryptDocker. This enables wallet and utility extensions in your desktop workflow.

### 4.7 Unified notifications & badges
Surface notification counts and badge indicators so you can keep track of activity across apps.

### 4.8 Built-in AI Tools
CryptDocker integrates AI directly into your workflow to help you make smarter decisions and stay safe:
- **AI ChatBot**: Get instant answers powered by GPT-5 and web search. Ask about any crypto topic directly from your workspace.
- **Real-Time Contract Auditing**: Audit token and dApp contracts in real time with defensive AI checks, risk scoring, and clear annotations before you connect your wallet.
- **Market Sentiment Engine**: Convert headlines into signals with sentiment, key takeaways, and keyword alerts — so you can protect capital and move faster.

---

## 5. How to use CryptDocker

### 5.1 Install
1. Download CryptDocker for your OS (Windows/macOS/Linux).
2. Install and launch the app.

### 5.2 Create a workspace
Create a workspace that matches your workflow (for example: "Trading", "DeFi", "Wallets", "Research").

### 5.3 Add apps
Add apps from the built-in catalog or paste a custom URL, then drag them into the right workspace.

### 5.4 Use multiple accounts safely
If you need multiple accounts for the same service, put them in separate isolated environments (workspaces/partitions). This prevents cookie and localStorage collisions.

### 5.5 Configure a per-site proxy (optional)
1. Open the app's settings.
2. Select **Proxy**.
3. Choose a connection type (HTTP/SOCKS5), set host/port, and add credentials if required.
4. The selected site will route through that proxy session.

### 5.6 Enable hibernation (optional)
Set a hibernation timer for apps you keep open all day. CryptDocker will hibernate them when idle and restore them when you return.

### 5.7 Use AI Tools
While browsing any app, you can open the built-in AI panel to audit contract risk, check market sentiment, or ask the AI ChatBot any specific questions.
`;

export const Documentation: React.FC = () => {
	const clientOS = useMemo(() => detectOS(), []);
	const isWindows = clientOS === "Windows";
	const isMacOS = clientOS === "macOS";
	const isLinux = clientOS === "Linux";
	const canDownload = isWindows || isMacOS || isLinux;

	const downloadNow = () => {
		if (isWindows) window.open(DOWNLOAD_URL_WINDOWS, "_blank", "noopener,noreferrer");
		else if (isMacOS) window.open(DOWNLOAD_URL_MACOS, "_blank", "noopener,noreferrer");
		else if (isLinux) window.open(DOWNLOAD_URL_LINUX, "_blank", "noopener,noreferrer");
	};

	return (
		<div className="w-full">
			<SEO
				title="Documentation"
				description="Complete guide to CryptDocker: setup, features, workspace isolation, per-site proxies, Chrome extensions, and AI tools. Everything you need to get started."
				path="/documentation"
			/>
			<PageHeader
				label="Resources"
				title="Documentation"
				description="A practical overview of what CryptDocker is, who it's for, how it compares, and how to get started."
			/>
			<section className="py-14">
				<div className="max-w-4xl mx-auto px-6">
					<article className="prose prose-dark max-w-none prose-headings:scroll-mt-24 prose-a:no-underline hover:prose-a:underline">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{DOC_MD}</ReactMarkdown>
					</article>
				</div>
			</section>

			<section className="pb-20">
				<div className="max-w-4xl mx-auto px-6">
					<div className="rounded-2xl bg-linear-to-br from-teal-600/15 via-teal-500/8 to-transparent border border-teal-500/20 p-10 text-center">
						<h3 className="text-2xl font-bold text-white mb-3">
							Ready to get started?
						</h3>
						<p className="text-slate-400 mb-8 max-w-lg mx-auto">
							Download CryptDocker and set up your secure crypto workspace in under a minute.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<button
								onClick={downloadNow}
								disabled={!canDownload}
								className={`inline-flex items-center gap-2 px-7 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
									canDownload
										? "bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 cursor-pointer"
										: "bg-white/6 text-slate-500 cursor-not-allowed"
								}`}
							>
								<IoDownloadOutline className="w-5 h-5" />
								Download Now
							</button>
							<Link
								to={PATH.SUPPORT}
								className="inline-flex items-center gap-1.5 px-6 py-3 text-sm font-medium text-slate-300 border border-white/12 rounded-xl hover:border-teal-500/50 hover:text-teal-300 transition-all duration-300"
							>
								Need help?
								<IoArrowForward className="w-4 h-4" />
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};
