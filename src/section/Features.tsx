import {
	IoGridOutline,
	IoFolderOutline,
	IoGlobeOutline,
	IoFlashOutline,
	IoExtensionPuzzleOutline,
	IoLockClosedOutline,
} from "react-icons/io5";
import { SectionHeading } from "../component/SectionHeading";
import { FeatureCard } from "../component/FeatureCard";

const features = [
	{
		icon: <IoGridOutline className="w-6 h-6" />,
		title: "App Management",
		description:
			"Add apps from our curated catalog or any custom URL. Organize, search, and launch everything from one unified dashboard.",
		tip: "Replace your 30-tab browser session with a single sidebar. Exchanges, DeFi dashboards, analytics - one click away.",
	},
	{
		icon: <IoFolderOutline className="w-6 h-6" />,
		title: "Workspaces",
		description:
			"Organize apps into color-coded workspaces. Drag and drop between folders, expand and collapse - keep everything tidy.",
		tip: "Separate trading, airdrop farming, and research into distinct workspaces so context-switching doesn't cost you a trade.",
	},
	{
		icon: <IoGlobeOutline className="w-6 h-6" />,
		title: "Per-Site Proxies",
		description:
			"Configure HTTP or SOCKS proxies on a per-app basis. Route each site through different connections for maximum privacy.",
		tip: "Avoid IP bans on restricted exchanges, geo-unlock region-gated dApps, and separate identities across accounts - all without a system-wide VPN.",
	},
	{
		icon: <IoFlashOutline className="w-6 h-6" />,
		title: "Smart Hibernation",
		description:
			"Automatically hibernate idle tabs to free up memory and CPU. Wake them instantly when you need them.",
		tip: "Heavy dApps like DEX aggregators and charting tools can eat 500 MB+ each. Hibernation keeps your machine fast while you run 20+ apps.",
	},
	{
		icon: <IoExtensionPuzzleOutline className="w-6 h-6" />,
		title: "Chrome Extensions",
		description:
			"Install and manage Chrome extensions directly inside CryptDocker. Pin your favorites and use them across workspaces.",
		tip: "Run MetaMask, Rabby, Phantom, and other wallet extensions natively - no browser required. Sign transactions without leaving your workspace.",
	},
	{
		icon: <IoLockClosedOutline className="w-6 h-6" />,
		title: "Session Isolation",
		description:
			"Each workspace runs in its own isolated session. Log into multiple accounts on the same service simultaneously.",
		tip: "Farm airdrops across multiple wallets or manage separate exchange accounts without cookie collisions leaking between sessions.",
	},
];

export const Features: React.FC = () => {
	return (
		<section id="features" className="section-scroll-target relative py-24">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 mesh-gradient opacity-50" />
			</div>
			<div className="relative z-10 max-w-8xl mx-auto px-6">
				<SectionHeading
					label="Features"
					title="Advanced Crypto Hub Features"
					description="CryptDocker brings all your crypto tools together in one secure, organized desktop experience."
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, i) => (
						<FeatureCard key={feature.title} index={i} {...feature} />
					))}
				</div>
			</div>
		</section>
	);
};
