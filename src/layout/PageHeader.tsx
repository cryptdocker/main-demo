import { motion } from "framer-motion";

interface PageHeaderProps {
	label?: string;
	title: string;
	description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
	label,
	title,
	description,
}) => {
	return (
		<section className="relative py-20 md:py-28 overflow-hidden">
			<div className="absolute inset-0 mesh-gradient" />
			<div className="absolute top-10 right-[15%] w-64 h-64 bg-teal-500/8 rounded-full blur-3xl animate-float-slow" />
			<div className="absolute bottom-10 left-[10%] w-48 h-48 bg-cyan-500/6 rounded-full blur-3xl animate-float" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="relative z-10 max-w-3xl mx-auto px-6 text-center"
			>
				{label && (
					<span className="inline-block text-sm font-semibold tracking-widest uppercase mb-3 text-gradient">
						{label}
					</span>
				)}
				<h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
					{title}
				</h1>
				{description && (
					<p className="text-lg text-slate-400 leading-relaxed">
						{description}
					</p>
				)}
			</motion.div>
		</section>
	);
};
