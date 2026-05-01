import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";

interface FeatureCardProps {
	icon: ReactNode;
	title: string;
	description: string;
	tip?: string;
	index?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
	icon,
	title,
	description,
	tip,
	index = 0,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
			className="group/card relative p-6 rounded-2xl glass hover:bg-white/6 transition-colors duration-500">
			<div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-linear-to-br from-teal-500/5 to-cyan-500/5" />
			<div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-teal-500/6 blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

			<div className="relative z-10">
				<div className="flex items-start justify-between mb-5">
					<div className="w-12 h-12 rounded-xl bg-linear-to-br from-teal-500/20 to-cyan-500/20 text-teal-400 flex items-center justify-center group-hover/card:shadow-lg group-hover/card:shadow-teal-500/10 transition-shadow duration-300">
						{icon}
					</div>
					{tip && (
						<div className="group relative p-1 z-50">
							<IoInformationCircleOutline className="w-[18px] h-[18px] text-slate-500 group-hover:text-teal-400 transition-colors duration-200 cursor-help" />

							<div className="pointer-events-none absolute bottom-full right-0 mb-2 w-64 invisible scale-95 translate-y-1 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-[transform,visibility] duration-200 z-50">
								<div
									className="rounded-xl border border-white/10 shadow-xl shadow-black/50 p-3.5"
									style={{ background: "#0c0c1d" }}>
									<p className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 mb-1.5">
										Pro tip
									</p>
									<p className="text-[13px] text-slate-300 leading-relaxed">
										{tip}
									</p>
								</div>
								<div
									className="absolute -bottom-1 right-4 w-2 h-2 rotate-45 border-r border-b border-white/10"
									style={{ background: "#0c0c1d" }}
								/>
							</div>
						</div>
					)}
				</div>

				<h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
				<p className="text-slate-400 leading-relaxed text-[15px]">
					{description}
				</p>
			</div>
		</motion.div>
	);
};
