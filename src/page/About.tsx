import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	IoRocketOutline,
	IoShieldCheckmarkOutline,
	IoPeopleOutline,
	IoSparkles,
} from "react-icons/io5";
import { PageHeader } from "../layout/PageHeader";
import { PATH } from "../const";
import { SEO } from "../component/SEO";

const values = [
	{
		icon: <IoShieldCheckmarkOutline className="w-6 h-6" />,
		title: "Security First",
		description:
			"Every decision we make starts with security. Your data, your keys, your privacy — always protected.",
	},
	{
		icon: <IoPeopleOutline className="w-6 h-6" />,
		title: "User-Centric",
		description:
			"We build for real users. Every feature is tested, refined, and shipped based on genuine community feedback.",
	},
	{
		icon: <IoRocketOutline className="w-6 h-6" />,
		title: "Innovation",
		description:
			"We integrate cutting-edge AI and modern tooling to keep you ahead in the fast-moving crypto ecosystem.",
	},
	{
		icon: <IoSparkles className="w-6 h-6" />,
		title: "Simplicity",
		description:
			"Powerful tools don't have to be complicated. We distill complexity into elegant, intuitive interfaces.",
	},
];

const milestones = [
	{ year: "2025 Q3", event: "CryptDocker founded - prototyped the unified crypto workspace concept" },
	{ year: "2025 Q4", event: "Launched v1.0 with workspace management, per-site proxy, and Chrome extension support" },
	{ year: "2026 Q1", event: "Introduced AI-powered risk analysis, news insights, and expanded to 1,000+ users across 8 countries" },
];

export const About: React.FC = () => {
	return (
		<>
			<SEO
				title="About Us"
				description="CryptDocker is a security-first crypto workspace. Learn about our mission, values, and the team building the future of crypto tooling."
				path="/about"
			/>
			<PageHeader
				label="About Us"
				title="Building the Future of Crypto Tooling"
				description="CryptDocker was born from a simple idea - managing dozens of crypto apps shouldn't be painful."
			/>

			<section className="py-20">
				<div className="max-w-4xl mx-auto px-6">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							<h2 className="text-3xl font-bold text-white mb-4">
								Our Mission
							</h2>
							<p className="text-slate-400 leading-relaxed mb-4">
								We believe crypto professionals and enthusiasts deserve a
								workspace as powerful as the technology they use. CryptDocker
								brings every exchange, DeFi protocol, and blockchain tool into
								one secure desktop environment.
							</p>
							<p className="text-slate-400 leading-relaxed">
								With built-in AI analysis, per-site proxy support, isolated
								sessions, and Chrome extensions - we're not just another
								browser. We're your crypto command center.
							</p>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="rounded-2xl glass p-8"
						>
							<div className="grid grid-cols-1 gap-6 text-center">
								<div>
									<div className="text-3xl font-bold text-gradient">1K+</div>
									<div className="text-sm text-slate-500 mt-1">Active Users</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-gradient">8+</div>
									<div className="text-sm text-slate-500 mt-1">Countries</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-gradient">450+</div>
									<div className="text-sm text-slate-500 mt-1">Supported Apps</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			<section className="py-20">
				<div className="max-w-4xl mx-auto px-6">
					<h2 className="text-3xl font-bold text-white text-center mb-12">
						Our Values
					</h2>
					<div className="grid sm:grid-cols-2 gap-8">
						{values.map((v, i) => (
							<motion.div
								key={v.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: i * 0.1 }}
								className="glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
							>
								<div className="w-12 h-12 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-4">
									{v.icon}
								</div>
								<h3 className="text-lg font-semibold text-white mb-2">
									{v.title}
								</h3>
								<p className="text-slate-400 text-[15px] leading-relaxed">
									{v.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<section className="py-20">
				<div className="max-w-2xl mx-auto px-6">
					<h2 className="text-3xl font-bold text-white text-center mb-12">
						Our Journey
					</h2>
					<div className="relative">
						<div className="absolute left-4 top-0 bottom-0 w-px bg-linear-to-b from-teal-500/50 to-transparent" />
						<div className="space-y-10">
							{milestones.map((m, i) => (
								<motion.div
									key={m.year}
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: i * 0.15 }}
									className="relative pl-12"
								>
									<div className="absolute left-0 w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-[10px] font-bold border-2 border-dark-base">
										{m.year.split(" ")[1]}
									</div>
									<div>
										<span className="text-sm font-semibold text-teal-400">
											{m.year}
										</span>
										<p className="text-slate-400 mt-1">{m.event}</p>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="py-16">
				<div className="max-w-3xl mx-auto px-6 text-center">
					<h2 className="text-2xl font-bold text-white mb-3">
						Want to join our team?
					</h2>
					<p className="text-slate-400 mb-6">
						We're always looking for passionate people who love crypto and great
						software.
					</p>
					<Link
						to={PATH.CAREERS}
						className="inline-flex items-center px-6 py-3 bg-linear-to-r from-teal-600 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
					>
						View Open Positions
					</Link>
				</div>
			</section>
		</>
	);
};
