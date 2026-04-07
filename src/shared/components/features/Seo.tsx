import { Helmet } from "react-helmet-async";

import { DEFAULT_SEO, type SeoConfig } from "../../constants";

const BASE_URL = "https://www.seedlab.cloud";

type Props = {
  config?: SeoConfig;
};

export const Seo = ({ config = DEFAULT_SEO }: Props) => (
  <Helmet>
    <title>{config.title}</title>
    <meta name="description" content={config.description} />
    {config.noindex && <meta name="robots" content="noindex,follow" />}
    {config.path && <link rel="canonical" href={`${BASE_URL}${config.path}`} />}
    <meta property="og:title" content={config.title} />
    <meta property="og:description" content={config.description} />
    {config.path && (
      <meta property="og:url" content={`${BASE_URL}${config.path}`} />
    )}
    <meta name="twitter:title" content={config.title} />
    <meta name="twitter:description" content={config.description} />
  </Helmet>
);
