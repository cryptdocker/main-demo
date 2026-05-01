import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";
import { PageHeader } from "../layout/PageHeader";
import { blogPosts } from "../content/blog";
import { PATH } from "../const";
import { SEO } from "../component/SEO";

const categories = ["All", ...new Set(blogPosts.map((p) => p.category))];

export const Blog: React.FC = () => {
	const [active, setActive] = useState("All");
	const filtered =
		active === "All" ? blogPosts : blogPosts.filter((p) => p.category === active);

	return (
		<>
			<SEO
				title="Blog"
				description="Product updates, tutorials, and insights on crypto tooling. Learn about CryptDocker features, security best practices, and DeFi workspace tips."
				path="/blog"
			/>
			<PageHeader
				label="Blog"
				title="News & Insights"
				description="Product updates, tutorials, and thoughts on the future of crypto tooling."
			/>

			<section className="py-20">
				<div className="max-w-5xl mx-auto px-6">
					<div className="flex flex-wrap gap-2 mb-12">
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => setActive(cat)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
									cat === active
										? "bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/20"
										: "bg-white/4 text-slate-400 border border-white/8 hover:bg-white/8 hover:text-white"
								}`}
							>
								{cat}
							</button>
						))}
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{filtered.map((post, i) => (
							<motion.div
								key={post.slug}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: i * 0.1 }}
							>
								<Link
									to={`${PATH.BLOG}/${post.slug}`}
									className="group block rounded-2xl glass p-6 hover:bg-white/5 transition-all duration-300"
								>
									<div className="flex items-center gap-3 mb-4">
										<span className="px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400 text-xs font-medium">
											{post.category}
										</span>
										<span className="text-xs text-slate-500">{post.date}</span>
										<span className="text-xs text-slate-500">
											&middot; {post.readTime}
										</span>
									</div>
									<h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
										{post.title}
									</h3>
									<p className="text-slate-400 text-[15px] leading-relaxed mb-4">
										{post.excerpt}
									</p>
									<span className="inline-flex items-center text-sm font-medium text-teal-400 gap-1 group-hover:gap-2 transition-all">
										Read More
										<IoArrowForward className="w-4 h-4" />
									</span>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};
