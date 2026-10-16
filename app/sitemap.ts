import type { MetadataRoute } from "next";
import { connectors, categories, SITE_URL } from "../lib/data";
import { guides, comparisons } from "../lib/guides";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [{ url: SITE_URL, lastModified: now, priority: 1 }, { url: `${SITE_URL}/sponsor`, lastModified: now }, { url: `${SITE_URL}/submit`, lastModified: now }, { url: `${SITE_URL}/config`, lastModified: now, priority: 0.9 }, { url: `${SITE_URL}/status`, lastModified: now },
    ...Object.keys(categories).map(k => ({ url: `${SITE_URL}/category/${k}`, lastModified: now, priority: 0.8 })),
    { url: `${SITE_URL}/guides`, lastModified: now, priority: 0.9 },
    ...guides.map(g => ({ url: `${SITE_URL}/guides/${g.slug}`, lastModified: new Date(g.updated), priority: 0.8 })),
    ...comparisons.map(c => ({ url: `${SITE_URL}/compare/${c.slug}`, lastModified: now, priority: 0.6 })),
    ...connectors.map(c => ({ url: `${SITE_URL}/connectors/${c.slug}`, lastModified: new Date(c.lastVerified), priority: 0.7 }))];
}
