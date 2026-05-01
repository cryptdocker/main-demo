import { motion } from "framer-motion";
import { PageHeader } from "../layout/PageHeader";
import { SEO } from "../component/SEO";

const sections = [
	{
		title: "1. Information We Collect",
		content: [
			"Account Information: When you create an account, we collect your email address, name, and authentication credentials.",
			"Usage Data: We collect anonymized usage statistics to improve our product, including feature usage frequency and crash reports.",
			"Payment Information: Payment processing is handled by Stripe and on-chain crypto transactions. We do not store credit card numbers or private keys.",
			"Device Information: We collect basic device information (OS, app version) for compatibility and support purposes.",
		],
	},
	{
		title: "2. How We Use Your Information",
		content: [
			"To provide and maintain the CryptDocker application and services.",
			"To process payments and manage your subscription.",
			"To send important updates about your account and the service.",
			"To improve our product based on anonymized usage patterns.",
			"To provide customer support and respond to your inquiries.",
		],
	},
	{
		title: "3. Session Isolation & Data Privacy",
		content: [
			"Each workspace in CryptDocker runs in a fully isolated browser session. We do not have access to your browsing data, cookies, or credentials stored within these sessions.",
			"Per-site proxy configurations are stored locally on your device and are never transmitted to our servers.",
			"Chrome extension data remains local and is not synced to CryptDocker servers.",
		],
	},
	{
		title: "4. AI Features & Data Handling",
		content: [
			"AI ChatBot conversations are processed by our AI provider and are not stored beyond the active session unless you explicitly save them.",
			"Real-Time Contract Auditing scores are generated in real time and are not associated with your personal identity.",
			"Market Sentiment Engine uses publicly available data and does not access your private browsing history.",
		],
	},
	{
		title: "5. Data Sharing",
		content: [
			"We do not sell, trade, or rent your personal information to third parties.",
			"We may share anonymized, aggregated data with partners for analytical purposes.",
			"We may disclose information when required by law or to protect our rights and safety.",
		],
	},
	{
		title: "6. Data Security",
		content: [
			"We implement industry-standard security measures including encryption in transit (TLS) and at rest.",
			"Regular security audits are performed on our infrastructure.",
			"We follow the principle of least privilege for internal access to user data.",
		],
	},
	{
		title: "7. Your Rights",
		content: [
			"Access: You can request a copy of your personal data at any time.",
			"Deletion: You can request deletion of your account and associated data.",
			"Portability: You can export your app configurations and workspace settings.",
			"Opt-out: You can opt out of anonymized usage tracking in Settings.",
		],
	},
	{
		title: "8. Contact",
		content: [
			"For privacy-related questions or requests, contact us at contact@cryptdocker.com.",
		],
	},
];

export const Privacy: React.FC = () => {
	return (
		<>
			<SEO
				title="Privacy Policy"
				description="CryptDocker privacy policy. Learn how we collect, use, and safeguard your information including session isolation, AI data handling, and your rights."
				path="/privacy"
			/>
			<PageHeader
				label="Legal"
				title="Privacy Policy"
				description="Last updated: March 1, 2026"
			/>

			<section className="py-20">
				<div className="max-w-3xl mx-auto px-6">
					<p className="text-slate-400 leading-relaxed mb-12">
						CryptDocker ("we", "our", "us") is committed to protecting your
						privacy. This Privacy Policy explains how we collect, use, and
						safeguard your information when you use our desktop application and
						services.
					</p>

					<div className="space-y-10">
						{sections.map((section, i) => (
							<motion.div
								key={section.title}
								initial={{ opacity: 0, y: 15 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.03 }}
							>
								<h2 className="text-xl font-bold text-white mb-4">
									{section.title}
								</h2>
								<ul className="space-y-3">
									{section.content.map((item, j) => (
										<li
											key={j}
											className="text-slate-400 leading-relaxed text-[15px] pl-4 border-l-2 border-teal-500/20"
										>
											{item}
										</li>
									))}
								</ul>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};
