import { useEffect, useState } from "react";
import { RiRobot2Line } from "react-icons/ri";

export const TradeGPTBadge: React.FC = () => {
	const [position, setPosition] = useState("-left-41");

	useEffect(() => {
		setTimeout(() => {
			setPosition("left-6");
		}, 1500);
	}, []);

	return (
		<button
			type="button"
			onClick={() =>
				window.open(
					"https://trade.cryptdocker.com",
					"_blank",
					"noopener,noreferrer",
				)
			}
			className={`fixed ${position} top-[calc(50vh-31px)] z-50 transition-all duration-300`}
			aria-label="Open TradeGPT">
			<span className="group relative inline-flex items-center gap-3 rounded-2xl border border-teal-400/30 bg-dark-surface/85 backdrop-blur-xl p-3 shadow-xl shadow-teal-500/20">
				<span
					aria-hidden="true"
					className="pointer-events-none absolute -inset-2 rounded-3xl bg-teal-400/45 blur-2xl opacity-80 transition-opacity duration-300 group-hover:opacity-100"
				/>
				<span
					aria-hidden="true"
					className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-teal-300/40 transition-colors duration-300 group-hover:ring-teal-200/70"
				/>
				<span className="flex flex-col items-start leading-tight">
					<span className="text-sm font-semibold text-white">TradeGPT</span>
					<span className="text-xs text-slate-300">
						Dedicated GPT for traders
					</span>
				</span>
				<span className="relative w-9 h-9 rounded-xl bg-linear-to-br from-teal-400 to-teal-300 flex items-center justify-center shadow-lg shadow-teal-400/50 ring-1 ring-white/20 transition-shadow duration-300 group-hover:shadow-teal-300/80">
					<span
						aria-hidden="true"
						className="pointer-events-none absolute -inset-2 rounded-2xl bg-teal-300/55 blur-xl opacity-90 transition-opacity duration-300 group-hover:opacity-100"
					/>
					<RiRobot2Line className="w-5 h-5 text-white drop-shadow-sm" />
				</span>
			</span>
		</button>
	);
};
