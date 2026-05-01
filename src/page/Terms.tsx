import { motion } from "framer-motion";
import { PageHeader } from "../layout/PageHeader";
import { SEO } from "../component/SEO";

const sections = [
	{
		title: "1. Acceptance of Terms",
		content:
			"By downloading, installing, or using CryptDocker, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the application.",
	},
	{
		title: "2. Description of Service",
		content:
			"CryptDocker is a desktop application that provides a unified workspace for managing web applications, with features including workspace management, session isolation, Chrome extension support, per-site proxy configuration, and AI-powered tools. The service is available in Free and Pro tiers.",
	},
	{
		title: "3. Account Registration",
		content:
			"You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.",
	},
	{
		title: "4. Subscription & Payments",
		content:
			"CryptDocker Pro is a paid subscription billed monthly. Payments can be made via credit card (processed by Stripe) or cryptocurrency (USDT/USDC on ERC-20, TRC-20, and BEP-20 networks). Subscriptions auto-renew unless canceled before the billing date. Refunds are available within 7 days of initial purchase.",
	},
	{
		title: "5. Acceptable Use",
		content:
			"You agree not to use CryptDocker to: (a) violate any applicable laws or regulations; (b) infringe on the intellectual property rights of others; (c) distribute malware or engage in phishing; (d) attempt to reverse-engineer, decompile, or disassemble the application; (e) overload or disrupt our infrastructure or services.",
	},
	{
		title: "6. Chrome Extensions",
		content:
			"CryptDocker supports installing Chrome extensions. We are not responsible for the functionality, security, or privacy practices of third-party extensions. Use extensions at your own risk and review their individual privacy policies.",
	},
	{
		title: "7. AI Features Disclaimer",
		content:
			"AI-powered features (ChatBot, Real-Time Contract Auditing, Market Sentiment Engine) are provided for informational purposes only and should not be considered financial, legal, or security advice. AI responses may contain inaccuracies. Always perform your own due diligence before making financial decisions.",
	},
	{
		title: "8. Intellectual Property",
		content:
			"CryptDocker and its original content, features, and functionality are owned by CryptDocker and protected by international copyright, trademark, and other intellectual property laws. Our trademarks may not be used without prior written consent.",
	},
	{
		title: "9. Limitation of Liability",
		content:
			'CryptDocker is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service, including but not limited to loss of data, profits, or cryptocurrency assets.',
	},
	{
		title: "10. Termination",
		content:
			"We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we determine violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the service ceases immediately.",
	},
	{
		title: "11. Changes to Terms",
		content:
			"We reserve the right to modify these Terms at any time. Material changes will be communicated via email or in-app notification at least 14 days before taking effect. Continued use after changes constitutes acceptance.",
	},
	{
		title: "12. Governing Law",
		content:
			"These Terms are governed by the laws of Singapore. Any disputes shall be resolved through binding arbitration in Singapore under the rules of the Singapore International Arbitration Centre.",
	},
	{
		title: "13. Contact",
		content:
			"For questions about these Terms, contact us at contact@cryptdocker.com.",
	},
];

export const Terms: React.FC = () => {
	return (
		<>
			<SEO
				title="Terms of Service"
				description="CryptDocker terms of service. Read about account registration, subscriptions, acceptable use, AI features disclaimer, and intellectual property."
				path="/terms"
			/>
			<PageHeader
				label="Legal"
				title="Terms of Service"
				description="Last updated: March 1, 2026"
			/>

			<section className="py-20">
				<div className="max-w-3xl mx-auto px-6">
					<div className="space-y-10">
						{sections.map((section, i) => (
							<motion.div
								key={section.title}
								initial={{ opacity: 0, y: 15 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.03 }}
							>
								<h2 className="text-xl font-bold text-white mb-3">
									{section.title}
								</h2>
								<p className="text-slate-400 leading-relaxed text-[15px]">
									{section.content}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};
