import { motion } from "framer-motion";
import { SectionHeading } from "../component/SectionHeading";

const brands = [
	{
		name: "Binance",
		logoUrl: "https://bin.bnbstatic.com/static/images/bnb-for/brand.png",
	},
	{
		name: "Coinbase",
		logoUrl: "https://www.coinbase.com/favicon.ico",
	},
	{
		name: "DexScreener",
		logoUrl: "https://dexscreener.com/favicon.ico",
	},
	{
		name: "Uniswap",
		logoUrl: "https://app.uniswap.org/favicon.ico",
	},
	{
		name: "TradingView",
		logoUrl: "https://www.tradingview.com/favicon.ico",
	},
];

export const CompatibleWith: React.FC = () => {
	return (
		<section className="relative py-16 overflow-hidden">
			<div className="relative z-10 max-w-8xl mx-auto px-6">
				<SectionHeading
					label="Ecosystem"
					title="Compatible with the tools you already trust"
					description="CryptDocker runs the web apps you use every day — with isolation, extensions, and controls built in."
				/>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-50px" }}
					transition={{ duration: 0.6 }}
					className="rounded-3xl glass p-6 md:p-8 overflow-hidden"
				>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 items-center">
						{brands.map((b, i) => (
							<motion.div
								key={b.name}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.08 }}
								whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
								className="flex items-center justify-center rounded-2xl bg-white/4 border border-white/6 px-4 py-4 hover:bg-white/8 hover:border-white/12 transition-all duration-300"
								title={b.name}
							>
								<div className="flex items-center gap-3">
									<img
										src={b.logoUrl}
										alt={`${b.name} logo`}
										className="w-7 h-7 rounded"
										loading="lazy"
										referrerPolicy="no-referrer"
									/>
									<span className="text-sm font-semibold text-slate-300">
										{b.name}
									</span>
								</div>
							</motion.div>
						))}
					</div>

					<p className="mt-6 text-center text-xs text-slate-500">
						Third-party trademarks belong to their respective owners. Compatibility
						refers to using their web apps inside CryptDocker.
					</p>
				</motion.div>
			</div>
		</section>
	);
};
