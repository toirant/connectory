import Link from "next/link";
import type { Metadata } from "next";
import { guides, comparisons } from "../../lib/guides";
import { connectors, fmtDate } from "../../lib/data";
export const metadata: Metadata = { title: "MCP guides — setup, picks & security", description: "Sourced guides to Model Context Protocol servers: best MCP servers for Cursor, Claude Code and Codex, GitHub MCP setup, database and design servers, remote vs local, and a security checklist.", alternates: { canonical: "/guides" } };
const nm = (s: string) => connectors.find(c => c.slug === s)?.name || s;
export default function Page() {
  return (<div className="wrap"><header className="pagehead"><p className="eyebrow">Field notes · Guides</p><h1>Guides</h1>
    <p className="dek">Setup walkthroughs and short lists built only from our verified data and the clients' own documentation. Every guide lists its sources.</p></header>
    <ol className="rows guide-rows">{guides.map((g, n) => <li key={g.slug}><Link href={`/guides/${g.slug}`} className="row-item"><span className="num tnum">{String(n + 1).padStart(3, "0")}</span><span className="pill">{g.kind}</span><span className="rname">{g.h1}</span><span className="rsum">{g.description}</span><span className="rmeta tnum">{fmtDate(g.updated)}</span><span className="arrow">→</span></Link></li>)}</ol>
    <section className="related"><div className="sec-head"><h2>Comparisons</h2></div><div className="relgrid">{comparisons.map(c => <Link key={c.slug} href={`/compare/${c.slug}`} className="relcard"><strong>{nm(c.a)} vs {nm(c.b)}</strong><span>{c.note}</span></Link>)}</div></section>
  </div>);
}
