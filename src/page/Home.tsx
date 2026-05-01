import { Hero } from "../section/Hero";
import { WorkflowStory } from "../section/WorkflowStory";
import { Features } from "../section/Features";
import { AITools } from "../section/AITools";
import { CompatibleWith } from "../section/CompatibleWith";
import { SecurityPrivacy } from "../section/SecurityPrivacy";
import { Pricing } from "../section/Pricing";
import { CTA } from "../section/CTA";
import { SEO } from "../component/SEO";

export const Home: React.FC = () => {
	return (
		<div className="-mt-16">
			<SEO path="/" />
			<Hero />
			<WorkflowStory />
			<Features />
			<AITools />
			<CompatibleWith />
			<SecurityPrivacy />
			<Pricing />
			<CTA />
		</div>
	);
};
