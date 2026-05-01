import { Helmet } from "react-helmet-async";

const SITE_NAME = "CryptDocker";
const SITE_URL = "https://cryptdocker.com";
const DEFAULT_TITLE = "CryptDocker — A Dedicated Secure Desktop Environment";
const DEFAULT_DESCRIPTION =
	"A dedicated, secure desktop environment for your crypto workflow — run exchanges, DeFi, and tools side-by-side with built-in AI tools, Chrome extensions, and per-site proxies.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOProps {
	title?: string;
	description?: string;
	path?: string;
	ogImage?: string;
	ogType?: string;
	noindex?: boolean;
	jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const SEO: React.FC<SEOProps> = ({
	title,
	description = DEFAULT_DESCRIPTION,
	path = "/",
	ogImage = DEFAULT_OG_IMAGE,
	ogType = "website",
	noindex = false,
	jsonLd,
}) => {
	const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
	const canonicalUrl = `${SITE_URL}${path}`;

	return (
		<Helmet>
			<title>{fullTitle}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={canonicalUrl} />
			{noindex && <meta name="robots" content="noindex,nofollow" />}

			<meta property="og:site_name" content={SITE_NAME} />
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={canonicalUrl} />
			<meta property="og:type" content={ogType} />
			<meta property="og:image" content={ogImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={ogImage} />

			{jsonLd &&
				(Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((data, i) => (
					<script key={i} type="application/ld+json">
						{JSON.stringify(data)}
					</script>
				))}
		</Helmet>
	);
};
