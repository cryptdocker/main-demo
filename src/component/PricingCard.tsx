import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Button } from "./Button";

interface PricingFeature {
	text: string;
	included: boolean;
}

interface PricingCardProps {
	name: string;
	price: string;
	period?: string;
	description: string;
	features: PricingFeature[];
	highlighted?: boolean;
	icon: ReactNode;
	contactLink?: string;
	index?: number;
}

export const PricingCard: React.FC<PricingCardProps> = ({
	name,
	price,
	period,
	description,
	features,
	highlighted = false,
	icon,
	contactLink,
	index = 0,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
			className={`relative rounded-2xl p-6 transition-all duration-500 border ${
				highlighted
					? "glow-teal border-teal-500"
					: "glass hover:bg-white/5"
			}`}
		>
			{highlighted && (
				<>
					<div className="absolute inset-0 bg-linear-to-br from-teal-500/8 to-cyan-500/4 rounded-2xl" />
					<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r from-teal-600 to-teal-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-teal-500/30">
						Most Popular
					</div>
				</>
			)}

			<div className="relative z-10">
				<div className="flex items-center gap-3 mb-4">
					<div
						className={`w-10 h-10 rounded-lg flex items-center justify-center ${
							highlighted
								? "bg-teal-500/20 text-teal-400"
								: "bg-white/6 text-slate-400"
						}`}
					>
						{icon}
					</div>
					<h3 className="text-xl font-bold text-white">{name}</h3>
				</div>
				<p className="text-slate-400 mb-6">{description}</p>
				<div className="flex items-baseline gap-1 mb-8">
					<span className="text-4xl font-bold text-white">{price}</span>
					{period && <span className="text-slate-500">/{period}</span>}
				</div>
				<ul className="space-y-3">
					{features.map((feature, i) => (
						<li key={i} className="flex items-center gap-3">
							{feature.included ? (
								<IoCheckmark className="w-5 h-5 text-teal-400 shrink-0" />
							) : (
								<IoClose className="w-5 h-5 text-slate-600 shrink-0" />
							)}
							<span
								className={
									feature.included ? "text-slate-300" : "text-slate-600"
								}
							>
								{feature.text}
							</span>
						</li>
					))}
				</ul>
				{contactLink && (
					<Link to={contactLink} className="block mt-8">
						<Button variant="outline" size="md" className="w-full">
							Contact Us
						</Button>
					</Link>
				)}
			</div>
		</motion.div>
	);
};
