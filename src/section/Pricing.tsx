import { IoInfiniteOutline, IoSparkles, IoStar } from "react-icons/io5";
import { SectionHeading } from "../component/SectionHeading";
import { PricingCard } from "../component/PricingCard";
import { PATH } from "../const";
import UsdtIcon from "../assets/usdt.svg";
import UsdcIcon from "../assets/usdc.svg";
import VisaIcon from "../assets/visa.svg";
import MastercardIcon from "../assets/mastercard.svg";

const paymentMethods = [
	{ name: "USDT", icon: UsdtIcon },
	{ name: "USDC", icon: UsdcIcon },
	{ name: "Visa", icon: VisaIcon },
	{ name: "Mastercard", icon: MastercardIcon },
];

const plans = [
	{
		name: "Free",
		price: "$0",
		description: "Get started for free.",
		icon: <IoStar className="w-5 h-5" />,
		features: [
			{ text: "15-day trial for every new account", included: true },
			{ text: "Up to 10 apps", included: true },
			{ text: "3 workspaces", included: true },
			{ text: "Basic notifications", included: true },
			{ text: "Session isolation", included: true },
			{ text: "AI ChatBot", included: false },
			{ text: "Risk & News analysis", included: false },
			{ text: "Chrome extensions", included: false },
			{ text: "Per-site proxies", included: false },
		],
		highlighted: false,
	},
	{
		name: "Pro",
		price: "$5",
		period: "month",
		description: "All premium features unlocked.",
		icon: <IoSparkles className="w-5 h-5" />,
		features: [
			{ text: "15-day trial for every new account", included: true },
			{ text: "Unlimited apps", included: true },
			{ text: "Unlimited workspaces", included: true },
			{ text: "Smart notifications", included: true },
			{ text: "Session isolation", included: true },
			{ text: "AI ChatBot (GPT-5)", included: true },
			{ text: "Risk & News analysis", included: true },
			{ text: "Chrome extensions", included: true },
			{ text: "Per-site proxies", included: true },
		],
		highlighted: true,
	},
	{
		name: "Lifetime",
		price: "$199",
		period: "once",
		description: "Full access for life.",
		icon: <IoInfiniteOutline className="w-5 h-5" />,
		features: [
			{ text: "15-day trial for every new account", included: true },
			{ text: "All current and future Pro features", included: true },
			{ text: "No recurring payments", included: true },
			{ text: "Priority support", included: true },
		],
		highlighted: false,
		contactLink: `${PATH.CONTACT}?subject=${encodeURIComponent("Lifetime Plan Inquiry")}&message=${encodeURIComponent("Hi, I'm interested in purchasing the Lifetime plan ($199). Could you please provide more details on the purchase process?")}`,
	},
];

export const Pricing: React.FC = () => {
	return (
		<section id="pricing" className="section-scroll-target relative py-24 overflow-hidden">
			<div className="absolute inset-0 mesh-gradient opacity-40" />
			<div className="relative z-10 max-w-8xl mx-auto px-6">
				<SectionHeading
					label="Pricing"
					title="Flexible Plans for Professional Traders"
					description={
						<>
							<span className="font-semibold text-gradient">
								15-day trial for every new account
							</span>
							—even if you only use Free. Upgrade when you need more. Pay with
							crypto or card.
						</>
					}
				/>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-8xl mx-auto">
					{plans.map((plan, i) => (
						<PricingCard key={plan.name} index={i} {...plan} />
					))}
				</div>
				<div className="text-center mt-10">
					<div className="inline-flex items-center gap-4 text-sm text-slate-500">
						<span>Accepted payments:</span>
						<div className="flex items-center gap-3">
							{paymentMethods.map(({ name, icon }) => (
								<div
									key={name}
									className="flex items-center gap-1.5 px-1 py-1.5 rounded-lg"
									title={name}
								>
									<img src={icon} alt={name} className="h-5 w-auto" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
