import type { Metadata } from "next";
import ConfigBuilder from "../../components/ConfigBuilder";
import { connectors, entryOf, logoOf } from "../../lib/data";
export const metadata: Metadata = { title: "MCP Config Builder — combine servers into one config", description: "Select MCP servers and a client (Cursor, VS Code, Claude Desktop, Claude Code, mcp.json) to generate one combined, copy-ready configuration.", alternates: { canonical: "/config" } };
export default function Page() {
  const items = connectors.map(c => ({ slug: c.slug, name: c.name, logo: logoOf(c.slug), category: c.category, entry: entryOf(c), officialUrl: c.officialUrl }));
  return (<div className="wrap"><header className="pagehead"><p className="crumbs eyebrow"><a href="/">Index</a> / Tools</p><p className="eyebrow">Tool · Config Builder</p>
    <h1>Config <em>Builder</em></h1><p className="dek">Tick the servers you want, choose your client, copy one config. {items.filter(i => i.entry).length} of {items.length} servers have a verified JSON snippet; the rest link to their README.</p></header>
    <ConfigBuilder items={items} /></div>);
}
