import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CopyButton from "../../../components/CopyButton";
import Logo from "../../../components/Logo";
import Rich from "../../../components/Rich";
import Newsletter from "../../../components/Newsletter";
import { guides, guideOf, type Block } from "../../../lib/guides";
import { connectors, logoOf, specOf, SITE_URL, fmtDate } from "../../../lib/data";
import { snippetFor } from "../../../lib/snippets";
export const dynamicParams = false;
export function generateStaticParams() { return guides.map(g => ({ slug: g.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = guideOf((await params).slug); if (!g) return {};
  return { title: g.title, description: g.description, alternates: { canonical: `/guides/${g.slug}` }, openGraph: { title: g.title, description: g.description, url: `/guides/${g.slug}`, type: "article", modifiedTime: g.updated } };
}
function B({ b }: { b: Block }) {
  if (b.t === "p") return <p><Rich x={b.x} /></p>;
  if (b.t === "ul") return <ul>{b.x.map(x => <li key={x}><Rich x={x} /></li>)}</ul>;
  if (b.t === "ol") return <ol className="checklist">{b.x.map(x => <li key={x}><Rich x={x} /></li>)}</ol>;
  if (b.t === "code") return <figure className="code"><figcaption><span>{b.label}</span><CopyButton text={b.x} /></figcaption><pre><code>{b.x}</code></pre></figure>;
  if (b.t === "table") return <div className="tablewrap"><table className="gtable"><thead><tr>{b.head.map(h => <th key={h}><Rich x={h} /></th>)}</tr></thead><tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Rich x={c} /></td>)}</tr>)}</tbody></table></div>;
  return <ol className="picks">{b.slugs.map((s, n) => { const c = connectors.find(x => x.slug === s)!; const sp = specOf(c); const sn = b.client ? snippetFor(c, b.client) : null;
    return <li key={s} className="pick"><div className="pick-head"><span className="num tnum">{String(n + 1).padStart(2, "0")}</span><Logo src={logoOf(c.slug)} name={c.name} size={32} /><div><h3><Link href={`/connectors/${c.slug}`}>{c.name}</Link></h3><p className="eyebrow">{sp.status} · {sp.transport} · {c.auth.method}</p></div></div>
      <p>{b.why?.[s] || c.summary}</p>
      {b.client && (sn ? <figure className="code"><figcaption><span>{sn.label} · {sn.origin === "docs" ? "from docs" : "derived"}</span><CopyButton text={sn.code} /></figcaption><pre><code>{sn.code}</code></pre></figure> : <p className="note">No verified config snippet — follow the <a href={c.officialUrl} target="_blank" rel="noopener">official setup ↗</a>.</p>)}
      <p className="pick-links"><Link href={`/connectors/${c.slug}`}>Spec sheet →</Link>{sp.builder && <Link href={`/config?add=${c.slug}`}>+ Add to config</Link>}</p></li>; })}</ol>;
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideOf((await params).slug); if (!g) notFound();
  const url = `${SITE_URL}/guides/${g.slug}`;
  const ld: object[] = [{ "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description, dateModified: g.updated, datePublished: g.updated, mainEntityOfPage: url, author: { "@type": "Organization", name: "Connectory", url: SITE_URL }, publisher: { "@type": "Organization", name: "Connectory" }, citation: g.sources.map(s => s.url) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` }, { "@type": "ListItem", position: 3, name: g.h1 }] }];
  if (g.faq.length) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  const rel = g.related.map(guideOf).filter(Boolean);
  return (<article className="wrap article guide">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <header className="arthead"><p className="crumbs eyebrow"><Link href="/">Index</Link> / <Link href="/guides">Guides</Link> / <span>{g.kind}</span></p>
      <h1 className="guide-h1">{g.h1}</h1><p className="dek"><Rich x={g.dek} /></p>
      <p className="eyebrow tnum">Updated {fmtDate(g.updated)} · {g.sources.length} source{g.sources.length > 1 ? "s" : ""}</p></header>
    <div className="artgrid">
      <div className="artbody">{g.sections.map((s, i) => <section key={s.h}><h2><span className="sec">§{i + 1}</span>{s.h}</h2>{s.b.map((b, j) => <B key={j} b={b} />)}</section>)}
        {g.faq.length > 0 && <section><h2><span className="sec">§{g.sections.length + 1}</span>FAQ</h2><dl className="faq">{g.faq.map(f => <div key={f.q}><dt>{f.q}</dt><dd>{f.a}</dd></div>)}</dl></section>}
        <section><h2><span className="sec">§{g.sections.length + 2}</span>Sources</h2><ol className="sources">{g.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.name} ↗</a></li>)}</ol><p className="note">Sources checked {fmtDate(g.updated)}. Spot something out of date? <Link href="/submit">Tell us</Link>.</p></section>
      </div>
      <aside className="artside"><div className="factbox"><p className="eyebrow">On this page</p><ul>{g.sections.map(s => <li key={s.h}>{s.h}</li>)}</ul></div>
        {rel.length > 0 && <div className="factbox"><p className="eyebrow">Related guides</p><ul>{rel.map(r => <li key={r!.slug}><Link href={`/guides/${r!.slug}`}>{r!.h1}</Link></li>)}</ul></div>}
        <div className="sponsor-mini"><span className="eyebrow">Build it</span><p>Combine any of these into one config file.</p><Link href="/config">Open Config Builder →</Link></div></aside>
    </div>
    <Newsletter />
  </article>);
}
