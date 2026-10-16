import { connectors, SITE_URL, SITE_NAME } from "../../lib/data";
import { guides } from "../../lib/guides";
export const dynamic = "force-static";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const d = (s: string) => new Date(s + "T12:00:00Z").toUTCString();
export function GET() {
  const items = [...guides.map(g => ({ t: g.title, l: `${SITE_URL}/guides/${g.slug}`, d: g.updated, s: g.description, c: "Guide" })),
    ...connectors.map(c => ({ t: `${c.name} MCP server`, l: `${SITE_URL}/connectors/${c.slug}`, d: c.lastVerified, s: c.summary, c: "Connector" }))];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${SITE_NAME} — MCP servers &amp; guides</title><link>${SITE_URL}</link><description>New and updated MCP server entries and guides from ${SITE_NAME}.</description><language>en</language><atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>${items.map(i => `<item><title>${esc(i.t)}</title><link>${i.l}</link><guid isPermaLink="true">${i.l}</guid><pubDate>${d(i.d)}</pubDate><category>${i.c}</category><description>${esc(i.s)}</description></item>`).join("")}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
