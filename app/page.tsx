import Link from "next/link";
import Directory from "../components/Directory";
import Newsletter from "../components/Newsletter";
import Hero from "../components/Hero";
import ConfigBuilder from "../components/ConfigBuilder";
import { connectors, categories, SITE_NAME, SITE_URL, slim, entryOf, logoOf } from "../lib/data";
import { guides } from "../lib/guides";
export default function Home() {
  const items = connectors.map(slim);
  const bitems = connectors.map(c => ({ slug: c.slug, name: c.name, logo: logoOf(c.slug), category: c.category, entry: entryOf(c), officialUrl: c.officialUrl }));
  const official = connectors.filter(c => c.official).length; const buildable = bitems.filter(b => b.entry).length;
  const jsonld = { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description: "Directory of MCP servers and AI agent connectors." };
  return (<>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
    <section className="hero"><div className="wrap hero-grid">
      <div className="hero-copy">
        <p className="eyebrow"><span className="dot" /> Vol. 1 · Updated weekly</p>
        <h1>The index of<br />things your agent<br />can <em>plug into.</em></h1>
        <p className="dek">{connectors.length} Model Context Protocol servers — what each does, the tools it exposes, verified setup, and prompts to try. Then wire them together in the Config Builder.</p>
        <div className="hero-cta"><Link href="#directory" className="btn">Browse the index</Link><Link href="/config" className="btn ghost">Build a config →</Link></div>
        <dl className="stats"><div><dt>Servers</dt><dd className="tnum">{connectors.length}</dd></div><div><dt>Official</dt><dd className="tnum">{official}</dd></div><div><dt>One-click configs</dt><dd className="tnum">{buildable}</dd></div></dl>
      </div>
      <Hero />
    </div></section>
    <div className="wrap">
      <Directory items={items} categories={categories} />
      <section className="feature" aria-labelledby="cb">
        <header className="feat-head"><p className="eyebrow">Tool · Config Builder</p><h2 id="cb">Pick servers. Pick a client.<br /><em>Paste one config.</em></h2>
          <p>Generates a combined config for Cursor, VS Code, Claude Desktop, Claude Code or a generic mcp.json — using only setup snippets we’ve checked against official docs. <Link href="/config">Open full page →</Link></p></header>
        <ConfigBuilder items={bitems} compact />
      </section>
      <section className="cats" aria-labelledby="secs"><div className="sec-head"><h2 id="secs">Sections</h2><span className="eyebrow tnum">06</span></div><div className="catgrid">{Object.entries(categories).map(([k, v]) => { const list = connectors.filter(c => c.category === k);
        return <Link key={k} href={`/category/${k}`} className="catcell"><span className="eyebrow tnum">{v.code} · {String(list.length).padStart(2, "0")} entries</span><strong>{v.name}</strong><span className="cat-blurb">{v.blurb}</span>
          <span className="cat-logos">{list.slice(0, 6).map(c => { const l = logoOf(c.slug); return l ? <img key={c.slug} src={l} alt="" width={18} height={18} loading="lazy" /> : null; })}</span></Link>; })}</div></section>
      <section className="related" aria-labelledby="gd"><div className="sec-head"><h2 id="gd">Guides</h2><Link href="/guides" className="eyebrow">All {guides.length} guides →</Link></div><div className="relgrid">{guides.slice(0, 8).map(g => <Link key={g.slug} href={`/guides/${g.slug}`} className="relcard"><span className="eyebrow">{g.kind}</span><strong>{g.h1}</strong><span>{g.description}</span></Link>)}</div></section>
      <aside className="sponsor-band"><span className="eyebrow">Sponsored slot · available</span><p>One sponsor at a time gets this homepage band. Featured listing from $250/month; newsletter slots from $75 per issue.</p><Link href="/sponsor" className="btn ghost">Sponsor {SITE_NAME} →</Link></aside>
      <Newsletter />
    </div>
  </>);
}
