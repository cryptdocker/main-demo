import { motion } from "framer-motion";
import {
	IoLockClosedOutline,
	IoShieldCheckmarkOutline,
	IoCloudOfflineOutline,
	IoEyeOffOutline,
} from "react-icons/io5";
import { SectionHeading } from "../component/SectionHeading";

const points = [
	{
		title: "Local-only storage",
		description:
			"Everything stays on your machine. Sessions, workspaces, app data - none of it touches our servers. We can't see inside your workspace because we never have access to it.",
		icon: <IoCloudOfflineOutline className="w-6 h-6" />,
	},
	{
		title: "AES-256 encrypted at rest",
		description:
			"Sensitive local data is encrypted with AES-256 - the same standard used by banks and government agencies. Your setup is protected even if your device is compromised.",
		icon: <IoLockClosedOutline className="w-6 h-6" />,
	},
	{
		title: "Zero access to keys & secrets",
		description:
			"We never ask for seed phrases. We don't collect private keys, exchange API secrets, or wallet signing data. Your credentials never leave your device.",
		icon: <IoShieldCheckmarkOutline className="w-6 h-6" />,
	},
	{
		title: "No telemetry, no API logs",
		description:
			"We don't log the dApps you visit, the contracts you interact with, or the tokens you hold. Your trading activity is your business - not ours.",
		icon: <IoEyeOffOutline className="w-6 h-6" />,
	},
];

export const SecurityPrivacy: React.FC = () => {
	return (
		<section className="relative py-24 overflow-hidden">
			<div className="absolute top-20 left-[10%] w-64 h-64 bg-cyan-500/4 rounded-full blur-3xl" />
			<div className="relative z-10 max-w-8xl mx-auto px-6">
				<SectionHeading
					label="Secure & Private"
					title="You shouldn't have to trust us. You don't."
					description="Running an .exe that touches your crypto workflow demands proof, not promises. Here's exactly how CryptDocker earns that trust."
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{points.map((p, i) => (
						<motion.div
							key={p.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ duration: 0.5, delay: i * 0.12 }}
							whileHover={{ y: -4, transition: { duration: 0.2 } }}
							className="rounded-2xl glass p-8 hover:bg-white/5 transition-all duration-500"
						>
							<div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5">
								{p.icon}
							</div>
							<h3 className="text-lg font-bold text-white mb-2">
								{p.title}
							</h3>
							<p className="text-slate-400 leading-relaxed text-sm">{p.description}</p>
						</motion.div>
					))}
				</div>

				<div className="mt-10 text-center">
					<p className="text-sm text-slate-500 max-w-3xl mx-auto">
						CryptDocker is not a wallet and does not custody funds. Always verify
						dApps and contracts independently and use hardware wallets when
						possible.
					</p>
				</div>
			</div>
		</section>
	);
};
