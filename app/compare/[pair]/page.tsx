import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Logo from "../../../components/Logo";
import CopyButton from "../../../components/CopyButton";
import { comparisons } from "../../../lib/guides";
import { connectors, logoOf, specOf, SITE_URL, fmtDate, categories } from "../../../lib/data";
export const dynamicParams = false;
export function generateStaticParams() { return comparisons.map(c => ({ pair: c.slug })); }
const get = (s: string) => connectors.find(c => c.slug === s)!;
export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params; const p = comparisons.find(c => c.slug === pair); if (!p) return {};
  const a = get(p.a), b = get(p.b); const title = `${a.name} vs ${b.name} MCP server — comparison`;
  return { title, description: `${a.name} vs ${b.name} MCP servers side by side: transport, auth, scopes, tools and setup. ${p.note}`.slice(0, 300), alternates: { canonical: `/compare/${p.slug}` } };
}
export default async function Page({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params; const p = comparisons.find(c => c.slug === pair); if (!p) notFound();
  const a = get(p.a), b = get(p.b); const sa = specOf(a), sb = specOf(b);
  const rows: [string, string, string][] = [["Category", categories[a.category].name, categories[b.category].name], ["Status", `${sa.status} · ${a.vendor}`, `${sb.status} · ${b.vendor}`], ["Transport", sa.transport, sb.transport], ["Auth method", a.auth.method, b.auth.method], ["Scopes / permissions", a.auth.scopes, b.auth.scopes], ["Tools listed", String(sa.tools), String(sb.tools)], ["In Config Builder", sa.builder ? "Yes" : "Manual setup", sb.builder ? "Yes" : "Manual setup"], ["Last verified", fmtDate(a.lastVerified), fmtDate(b.lastVerified)]];
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: `${a.name} vs ${b.name} MCP server`, dateModified: a.lastVerified, mainEntityOfPage: `${SITE_URL}/compare/${p.slug}`, about: [a, b].map(x => ({ "@type": "SoftwareApplication", name: `${x.name} MCP Server`, url: `${SITE_URL}/connectors/${x.slug}` })) };
  return (<article className="wrap article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <header className="arthead"><p className="crumbs eyebrow"><Link href="/">Index</Link> / <Link href="/guides">Guides</Link> / Comparison</p>
      <div className="vs-head"><Logo src={logoOf(a.slug)} name={a.name} size={48} /><h1 className="guide-h1">{a.name} <em>vs</em> {b.name}</h1><Logo src={logoOf(b.slug)} name={b.name} size={48} /></div>
      <p className="dek">{p.note}</p></header>
    <div className="tablewrap"><table className="gtable vs"><thead><tr><th></th><th><Link href={`/connectors/${a.slug}`}>{a.name}</Link></th><th><Link href={`/connectors/${b.slug}`}>{b.name}</Link></th></tr></thead>
      <tbody>{rows.map(r => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}
        <tr><th scope="row">Summary</th><td>{a.summary}</td><td>{b.summary}</td></tr>
        <tr><th scope="row">Key tools</th><td><ul>{a.tools.map(t => <li key={t}>{t}</li>)}</ul></td><td><ul>{b.tools.map(t => <li key={t}>{t}</li>)}</ul></td></tr></tbody></table></div>
    <div className="vs-setup">{[a, b].map(x => <div key={x.slug} className="artbody"><h2>{x.name} setup</h2>{x.setup.slice(0, 1).map(s => <figure key={s.label} className="code"><figcaption><span>{s.label}</span><CopyButton text={s.code} /></figcaption><pre><code>{s.code}</code></pre></figure>)}<p className="pick-links"><Link href={`/connectors/${x.slug}`}>Full spec sheet →</Link>{specOf(x).builder && <Link href={`/config?add=${x.slug}`}>+ Add to config</Link>}</p></div>)}</div>
    <p className="note" style={{ margin: "24px 0 64px" }}>Built from the verified data on each spec sheet. Check the official pages before relying on details.</p>
  </article>);
}
