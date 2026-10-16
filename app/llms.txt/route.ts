import { connectors, categories, SITE_URL, SITE_NAME } from "../../lib/data";
import { guides, comparisons } from "../../lib/guides";
export const dynamic = "force-static";
export function GET() {
  const t = [`# ${SITE_NAME}`, "", `> Independent, hand-verified index of ${connectors.length} Model Context Protocol (MCP) servers: what each does, transport, auth method and documented scopes, setup snippets, and the date its sources were last checked. Includes a Config Builder that combines servers into one mcp.json for Cursor, VS Code, Claude Desktop or Claude Code.`, "",
    "Data is taken from each server's official docs or repository. Entries marked \"Not documented\" mean the vendor does not publish that detail. A drift check flags entries whose upstream setup docs changed (see /status).", "",
    "## Guides", ...guides.map(g => `- [${g.h1}](${SITE_URL}/guides/${g.slug}): ${g.description}`), "",
    "## Comparisons", ...comparisons.map(c => `- [${c.a} vs ${c.b}](${SITE_URL}/compare/${c.slug}): ${c.note}`), "",
    ...Object.entries(categories).flatMap(([k, v]) => [`## ${v.name}`, ...connectors.filter(c => c.category === k).map(c => `- [${c.name}](${SITE_URL}/connectors/${c.slug}): ${c.summary} Auth: ${c.auth.method}. Verified ${c.lastVerified}.`), ""]),
    "## Optional", `- [Config Builder](${SITE_URL}/config)`, `- [Verification status](${SITE_URL}/status)`, `- [RSS feed](${SITE_URL}/feed.xml)`, `- [Sitemap](${SITE_URL}/sitemap.xml)`, ""];
  return new Response(t.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
