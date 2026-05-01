import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "white" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
	variant?: Variant;
	size?: Size;
	children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
	primary:
		"bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:from-teal-500 hover:to-teal-400",
	secondary:
		"bg-white/6 text-teal-300 hover:bg-white/10 border border-white/[0.08]",
	outline:
		"border border-white/[0.12] text-slate-300 hover:border-teal-500/50 hover:text-teal-300 hover:bg-white/3",
	white:
		"bg-white text-teal-700 hover:bg-teal-50 shadow-lg shadow-white/10",
	ghost:
		"border border-white/[0.15] text-white hover:bg-white/8 hover:border-white/[0.25]",
};

const sizeStyles: Record<Size, string> = {
	sm: "px-4 py-2 text-sm",
	md: "px-6 py-2.5 text-sm",
	lg: "px-8 py-3 text-base",
};

export const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	size = "md",
	className = "",
	children,
	...props
}) => {
	const disabled = props.disabled;

	return (
		<motion.button
			whileHover={disabled ? undefined : { scale: 1.02 }}
			whileTap={disabled ? undefined : { scale: 0.98 }}
			transition={{ type: "spring", stiffness: 400, damping: 17 }}
			className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 ${
				disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
			} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			{...props}
		>
			{children}
		</motion.button>
	);
};
