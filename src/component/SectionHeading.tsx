import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeadingProps {
	label?: string;
	title: string;
	description?: ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
	label,
	title,
	description,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-80px" }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="text-center max-w-2xl mx-auto mb-16"
		>
			{label && (
				<span className="inline-block text-sm font-semibold tracking-widest uppercase mb-3 text-gradient">
					{label}
				</span>
			)}
			<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
				{title}
			</h2>
			{description && (
				<p className="text-lg text-slate-400 leading-relaxed">
					{description}
				</p>
			)}
		</motion.div>
	);
};
