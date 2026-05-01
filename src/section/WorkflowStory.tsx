import { motion } from "framer-motion";
import {
	IoSpeedometerOutline,
	IoBrowsersOutline,
	IoTimeOutline,
	IoGlobeOutline,
	IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { SectionHeading } from "../component/SectionHeading";

const stats = [
	{
		label: "Tabs unified",
		value: "50+",
		icon: <IoBrowsersOutline className="w-5 h-5" />,
	},
	{
		label: "Time saved",
		value: "10+ hrs/week",
		icon: <IoTimeOutline className="w-5 h-5" />,
	},
	{
		label: "Faster workflow",
		value: "High-performance",
		icon: <IoSpeedometerOutline className="w-5 h-5" />,
	},
];

const callouts = [
	{
		title: "For the Airdrop Hunter",
		subtitle: "Operate across identities without the mess",
		icon: <IoGlobeOutline className="w-6 h-6" />,
		points: [
			"Per-site proxies to separate traffic and reduce cross-account leakage",
			"Multi-workspace setup for wallets, quests, and research — kept isolated",
		],
	},
	{
		title: "For the Day Trader",
		subtitle: "Defensive signal flow, built in",
		icon: <IoShieldCheckmarkOutline className="w-6 h-6" />,
		points: [
			"Market Sentiment Engine to turn headlines into actionable signals",
			"Real-Time Contract Auditing to evaluate risk before you connect",
		],
	},
];

export const WorkflowStory: React.FC = () => {
	return (
		<section className="relative py-24 overflow-hidden">
			<div className="absolute inset-0 mesh-gradient opacity-30" />
			<div className="relative z-10 max-w-8xl mx-auto px-6">
				<SectionHeading
					label="Workflow"
					title="End the browser tab chaos"
					description="CryptDocker unifies your daily crypto stack into one high-performance desktop environment — so you spend less time context-switching and more time executing."
				/>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					{stats.map((s, i) => (
						<motion.div
							key={s.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="rounded-2xl glass p-6"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-slate-400">
									<span className="w-9 h-9 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center text-teal-400">
										{s.icon}
									</span>
									<span className="text-sm font-medium">{s.label}</span>
								</div>
								<div className="text-xl font-extrabold text-white">
									{s.value}
								</div>
							</div>
						</motion.div>
					))}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{callouts.map((c, i) => (
						<motion.div
							key={c.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ duration: 0.5, delay: i * 0.15 }}
							whileHover={{ y: -4, transition: { duration: 0.2 } }}
							className="rounded-3xl glass p-8 hover:bg-white/5 transition-all duration-500"
						>
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
									{c.icon}
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-white">
										{c.title}
									</h3>
									<p className="text-slate-400 mt-1">{c.subtitle}</p>
								</div>
							</div>

							<ul className="mt-6 space-y-3 text-slate-300">
								{c.points.map((p) => (
									<li key={p} className="flex gap-3">
										<span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
										<span className="text-[15px] leading-relaxed">{p}</span>
									</li>
								))}
							</ul>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};
