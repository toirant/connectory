import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Logo from "../../../components/Logo";
import { connectors, categories, logoOf } from "../../../lib/data";
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(categories).map(cat => ({ cat })); }
export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const k = (await params).cat; const c = categories[k]; if (!c) return {};
  return { title: `${c.name} MCP servers`, description: `${c.blurb} Browse ${connectors.filter(x => x.category === k).length} ${c.name} MCP connectors with setup guides.`, alternates: { canonical: `/category/${k}` } };
}
export default async function Page({ params }: { params: Promise<{ cat: string }> }) {
  const k = (await params).cat; const c = categories[k]; if (!c) notFound();
  const list = connectors.filter(x => x.category === k);
  return (<div className="wrap"><header className="pagehead"><p className="crumbs eyebrow"><Link href="/">Index</Link> / Section {c.code}</p><p className="eyebrow tnum">Section · {String(list.length).padStart(2, "0")} entries</p><h1>{c.name}</h1><p className="dek">{c.blurb}</p></header>
    <div className="sheet"><ol className="rows">{list.map((r, n) => <li key={r.slug}><Link href={`/connectors/${r.slug}`} className="row-item"><span className="num tnum">{String(n + 1).padStart(3, "0")}</span><span className="rlogo"><Logo src={logoOf(r.slug)} name={r.name} size={22} /></span><span className="rname">{r.name}</span><span className="rsum">{r.summary}</span><span className="rmeta">{r.official ? <span className="pill">Official</span> : <span className="pill ghost">Community</span>}</span><span className="arrow" aria-hidden="true">→</span></Link></li>)}</ol></div></div>);
}
