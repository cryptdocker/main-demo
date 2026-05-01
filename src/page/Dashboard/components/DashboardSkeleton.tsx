import { cx } from "./shared";

export function DashboardSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
			{[...Array(4)].map((_, i) => (
				<div
					key={i}
					className={cx(
						"glass-strong rounded-2xl border border-white/8 animate-pulse",
						i >= 2 ? "md:col-span-2 h-56" : "h-44",
					)}
				/>
			))}
		</div>
	);
}

