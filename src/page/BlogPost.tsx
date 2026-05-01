import { useParams, Link, Navigate } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { getBlogPost, blogPosts } from "../content/blog";
import { PATH } from "../const";
import { SEO } from "../component/SEO";

export const BlogPost: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const post = slug ? getBlogPost(slug) : undefined;

	if (!post) {
		return <Navigate to={PATH.BLOG} replace />;
	}

	const currentIndex = blogPosts.findIndex((p) => p.slug === post.slug);
	const prevPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
	const nextPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;

	return (
		<>
			<SEO
				title={post.title}
				description={post.excerpt}
				path={`/blog/${post.slug}`}
				ogType="article"
				jsonLd={{
					"@context": "https://schema.org",
					"@type": "BlogPosting",
					headline: post.title,
					description: post.excerpt,
					datePublished: post.date,
					author: { "@type": "Organization", name: "CryptDocker" },
					publisher: {
						"@type": "Organization",
						name: "CryptDocker",
						logo: { "@type": "ImageObject", url: "https://cryptdocker.com/logo.png" },
					},
					mainEntityOfPage: `https://cryptdocker.com/blog/${post.slug}`,
				}}
			/>
			<section className="relative py-20 md:py-28 overflow-hidden">
				<div className="absolute inset-0 mesh-gradient" />
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="relative z-10 max-w-3xl mx-auto px-6"
				>
					<Link
						to={PATH.BLOG}
						className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-400 transition-colors mb-8"
					>
						<IoArrowBack className="w-4 h-4" />
						Back to Blog
					</Link>

					<div className="flex items-center gap-3 mb-4">
						<span className="px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400 text-xs font-medium">
							{post.category}
						</span>
						<span className="text-sm text-slate-500">{post.date}</span>
						<span className="text-sm text-slate-500">&middot; {post.readTime}</span>
					</div>

					<h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
						{post.title}
					</h1>
				</motion.div>
			</section>

			<section className="py-16">
				<article className="max-w-3xl mx-auto px-6 prose prose-dark prose-lg prose-headings:font-bold prose-a:no-underline hover:prose-a:underline prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-black/40 prose-img:rounded-xl">
					<Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
				</article>
			</section>

			<section className="py-12">
				<div className="max-w-3xl mx-auto px-6">
					<div className="grid grid-cols-2 gap-6">
						{prevPost ? (
							<Link
								to={`${PATH.BLOG}/${prevPost.slug}`}
								className="group p-5 rounded-xl glass hover:bg-white/5 transition-all"
							>
								<span className="text-xs text-slate-500">Previous</span>
								<p className="text-sm font-semibold text-white mt-1 group-hover:text-teal-400 transition-colors line-clamp-2">
									{prevPost.title}
								</p>
							</Link>
						) : (
							<div />
						)}
						{nextPost ? (
							<Link
								to={`${PATH.BLOG}/${nextPost.slug}`}
								className="group p-5 rounded-xl glass hover:bg-white/5 transition-all text-right"
							>
								<span className="text-xs text-slate-500">Next</span>
								<p className="text-sm font-semibold text-white mt-1 group-hover:text-teal-400 transition-colors line-clamp-2">
									{nextPost.title}
								</p>
							</Link>
						) : (
							<div />
						)}
					</div>
				</div>
			</section>
		</>
	);
};
