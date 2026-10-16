import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Newsletter from "../../../components/Newsletter";
import CopyButton from "../../../components/CopyButton";
import Logo from "../../../components/Logo";
import { connectors, categories, SITE_URL, logoOf, specOf, driftOf, liveToolsOf, fmtDate } from "../../../lib/data";
export const dynamicParams = false;
export function generateStaticParams() { return connectors.map(c => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const c = connectors.find(x => x.slug === slug); if (!c) return {};
  const title = `${c.name} MCP Server — setup, tools & prompts`;
  return { title, description: c.summary, alternates: { canonical: `/connectors/${c.slug}` }, openGraph: { title, description: c.summary, url: `/connectors/${c.slug}`, type: "article" } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const c = connectors.find(x => x.slug === slug); if (!c) notFound();
  const idx = connectors.findIndex(x => x.slug === c.slug) + 1; const spec = specOf(c); const dr = driftOf(c.slug); const cat = categories[c.category]; const live = liveToolsOf(c.slug);
  const related = connectors.filter(x => x.category === c.category && x.slug !== c.slug).slice(0, 4);
  const jsonld = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: `${c.name} MCP Server`, applicationCategory: "DeveloperApplication", description: c.description, url: `${SITE_URL}/connectors/${c.slug}`, sameAs: [c.officialUrl, c.sourceUrl], publisher: { "@type": "Organization", name: c.vendor }, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: cat.name, item: `${SITE_URL}/category/${c.category}` }, { "@type": "ListItem", position: 3, name: c.name }] };
  return (<article className="wrap article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonld, crumbs]) }} />
    <header className="arthead">
      <div className="art-top"><p className="crumbs eyebrow"><Link href="/">Index</Link> / <Link href={`/category/${c.category}`}>{cat.name}</Link> / <span className="tnum">No. {String(idx).padStart(3, "0")}</span></p>
        <span className="folio tnum" aria-hidden="true">{String(idx).padStart(3, "0")}</span></div>
      <div className="art-id"><Logo src={logoOf(c.slug)} name={c.name} size={56} className="art-logo" />
        <div><p className="eyebrow">{cat.code} · {cat.name} · {spec.status} server</p><h1>{c.name}</h1></div></div>
      <p className="dek">{c.summary}</p>
      {dr.needsReverification && <p className="drift-note"><b className="stale">Needs re-verification</b> Upstream setup docs changed on {fmtDate(dr.changedAt!)}. Details on this page may be out of date — <Link href="/status">see status</Link>.</p>}
      {dr.authChanged && <p className="drift-note"><b className="stale">Auth changed</b> Auth-related upstream docs (OAuth, keys, tokens, scopes) changed on {fmtDate(dr.authChangedAt!)}. Check the auth details below against the <a href={c.officialUrl}>official page</a> — <Link href="/status">see status</Link>.</p>}
      <div className="art-actions">
        {spec.builder ? <Link className="btn" href={`/config?add=${c.slug}`}>+ Add to config</Link> : <a className="btn" href={c.officialUrl} target="_blank" rel="noopener">Setup in README ↗</a>}
        <a className="btn ghost" href={c.officialUrl} target="_blank" rel="noopener">Official page ↗</a><a className="btn ghost" href={c.sourceUrl} target="_blank" rel="noopener">Source ↗</a></div>
    </header>
    <dl className="specsheet">
      <div><dt>Transport</dt><dd>{spec.transport}</dd></div>
      <div><dt>Status</dt><dd>{spec.status}{c.official ? " · " + c.vendor : ""}</dd></div>
      <div><dt>Auth method</dt><dd>{c.auth.method}{spec.credentials.includes("_") && <span className="envkeys">{spec.credentials}</span>}</dd></div>
      <div><dt>Scopes / permissions</dt><dd className={/[:._]/.test(c.auth.scopes) ? "monod" : ""}>{c.auth.scopes}</dd></div>
      <div><dt>Last verified</dt><dd className="tnum">{fmtDate(c.lastVerified)}{dr.needsReverification && <><br /><Link href="/status" className="stale">Needs re-verification</Link></>}</dd></div>
      <div><dt>{live ? "Tools (live)" : "Tools listed"}</dt><dd className="tnum big">{String(live ? live.tools.length : spec.tools).padStart(2, "0")}</dd></div>
    </dl>
    <div className="artgrid">
      <div className="artbody">
        <h2><span className="sec">§1</span>What it does</h2><p className="lede">{c.description}</p>
        <h2><span className="sec">§2</span>Setup</h2>{c.setup.map(s => <figure key={s.label} className="code"><figcaption><span>{s.label}</span><CopyButton text={s.code} /></figcaption><pre><code>{s.code}</code></pre></figure>)}
        <p className="note">Snippets adapted from the official documentation. Check the <a href={c.officialUrl}>official page</a> for current options and auth requirements.</p>
        {live && <><h2><span className="sec">§2a</span>Tools (live-checked {fmtDate(live.checked)})</h2><p className="note">Returned by the server's own <code>tools/list</code> via {live.via}{live.note ? ` (${live.note})` : ""}. No credentials used; no tools were called.</p><ul className="prompts">{live.tools.map(t => <li key={t.name}><span><code>{t.name}</code>{t.description ? ` — ${t.description}` : ""}</span></li>)}</ul></>}
        <h2><span className="sec">§3</span>Prompts to try</h2><ol className="prompts">{c.prompts.map(p => <li key={p}><span>“{p}”</span><CopyButton text={p} /></li>)}</ol>
      </div>
      <aside className="artside">
        <div className="factbox"><p className="eyebrow">Key tools{live ? " (docs)" : ""} <span className="tnum">({c.tools.length})</span></p><ul>{c.tools.map(t => <li key={t}>{t}</li>)}</ul></div>
        <div className="sponsor-mini"><span className="eyebrow">Sponsored · available</span><p>Reach developers wiring up {cat.name.toLowerCase()} agents.</p><Link href="/sponsor">Advertise here →</Link></div>
      </aside>
    </div>
    {related.length > 0 && <section className="related"><div className="sec-head"><h2>Also in {cat.name}</h2></div><div className="relgrid">{related.map(r => <Link key={r.slug} href={`/connectors/${r.slug}`} className="relcard"><Logo src={logoOf(r.slug)} name={r.name} size={28} /><strong>{r.name}</strong><span>{r.summary}</span></Link>)}</div></section>}
    <Newsletter />
  </article>);
}
