import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoMailOutline } from "react-icons/io5";
import { PageHeader } from "../layout/PageHeader";
import { PATH } from "../const";
import { SEO } from "../component/SEO";

const perks = [
	{ title: "Fully Remote", description: "Work from anywhere in the world." },
	{ title: "Competitive Pay", description: "Salary benchmarked to top markets, paid in fiat or crypto." },
	{ title: "Equity", description: "Share in our success with meaningful stock options." },
	{ title: "Flexible Hours", description: "We care about output, not hours logged." },
	{ title: "Learning Budget", description: "$2,000/year for conferences, courses, and books." },
	{ title: "Latest Hardware", description: "Choose your own setup - laptop, monitor, peripherals." },
];

export const Careers: React.FC = () => {
	return (
		<>
			<SEO
				title="Careers"
				description="Join the CryptDocker team. We're a remote-first company looking for passionate builders to create the best crypto workspace in the world."
				path="/careers"
			/>
			<PageHeader
				label="Careers"
				title="Build the Future With Us"
				description="Join a remote-first team of passionate builders creating the best crypto workspace in the world."
			/>

			<section className="py-20">
				<div className="max-w-4xl mx-auto px-6">
					<h2 className="text-2xl font-bold text-white mb-3">
						Why CryptDocker?
					</h2>
					<p className="text-slate-400 leading-relaxed mb-10 max-w-2xl">
						We're a small, senior team that ships fast and cares deeply about
						craft. No bureaucracy, no useless meetings - just focused work on
						products people love.
					</p>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{perks.map((perk, i) => (
							<motion.div
								key={perk.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.08 }}
								className="p-5 rounded-xl glass hover:bg-white/5 transition-all duration-300"
							>
								<h3 className="font-semibold text-white mb-1">
									{perk.title}
								</h3>
								<p className="text-sm text-slate-400">{perk.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<section className="py-20">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<h2 className="text-2xl font-bold text-white mb-4">
						Open Positions
					</h2>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="max-w-lg mx-auto rounded-2xl glass p-10"
					>
						<div className="w-14 h-14 rounded-full bg-white/6 flex items-center justify-center mx-auto mb-5">
							<IoMailOutline className="w-7 h-7 text-slate-500" />
						</div>
						<h3 className="text-lg font-semibold text-white mb-2">
							No open positions right now
						</h3>
						<p className="text-slate-400 text-[15px] leading-relaxed mb-6">
							We don't have any openings at the moment, but we're always
							interested in hearing from talented people. Send us your resume
							and we'll reach out when something fits.
						</p>
						<a
							href="mailto:contact@cryptdocker.com"
							className="inline-flex items-center px-6 py-3 bg-linear-to-r from-teal-600 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
						>
							Send Your Resume
						</a>
						<p className="text-xs text-slate-500 mt-4">
							contact@cryptdocker.com
						</p>
					</motion.div>
				</div>
			</section>

			<section className="py-16">
				<div className="max-w-3xl mx-auto px-6 text-center">
					<p className="text-slate-400">
						Have questions about working at CryptDocker?{" "}
						<Link
							to={PATH.CONTACT}
							className="text-teal-400 font-medium hover:underline"
						>
							Get in touch
						</Link>
					</p>
				</div>
			</section>
		</>
	);
};
