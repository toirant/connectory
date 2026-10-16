"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
type Item = { slug: string; name: string; vendor: string; category: string; official: boolean; summary: string; tools: string[]; logo: string | null; verified: string; stale: boolean };
export default function Directory({ items, categories }: { items: Item[]; categories: Record<string, { name: string; code: string }> }) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("all"); const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { const f = (e: KeyboardEvent) => { const t = e.target as HTMLElement;
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(t.tagName)) { e.preventDefault(); ref.current?.focus(); ref.current?.scrollIntoView({ block: "center", behavior: "smooth" }); }
    if (e.key === "Escape" && t === ref.current) { setQ(""); ref.current?.blur(); } };
    window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f); }, []);
  const list = useMemo(() => { const t = q.toLowerCase().trim();
    return items.filter(i => (cat === "all" || i.category === cat) && (!t || [i.name, i.vendor, i.summary, ...i.tools].join(" ").toLowerCase().includes(t)));
  }, [q, cat, items]);
  const counts = (k: string) => k === "all" ? items.length : items.filter(i => i.category === k).length;
  return (<section id="directory" className="index">
    <div className="tabs" role="tablist" aria-label="Filter by section">{[["all", "All", "ALL"], ...Object.entries(categories).map(([k, v]) => [k, v.name, v.code])].map(([k, n, code]) =>
      <button key={k} role="tab" aria-selected={cat === k} className={cat === k ? "tab on" : "tab"} onClick={() => setCat(k)}>
        <span className="tab-code">{code}</span><span className="tab-name">{n}</span><span className="tab-n tnum">{String(counts(k)).padStart(2, "0")}</span></button>)}</div>
    <div className="sheet">
      <label className="searchwrap"><span className="eyebrow">Search</span>
        <input ref={ref} className="search" placeholder="postgres, browser, invoice, figma…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search connectors" />
        <kbd aria-hidden="true">/</kbd><span className="eyebrow tnum res">{String(list.length).padStart(2, "0")}/{items.length}</span></label>
      <ol className="rows" key={cat + "|" + q.length}>{list.map((i, n) => <li key={i.slug} style={{ ["--i" as string]: Math.min(n, 14) }}><Link href={`/connectors/${i.slug}`} className="row-item">
        <span className="num tnum">{String(n + 1).padStart(3, "0")}</span>
        <span className="rlogo">{i.logo && <img src={i.logo} alt="" width={22} height={22} loading="lazy" decoding="async" />}</span>
        <span className="rname">{i.name}</span>
        <span className="rsum">{i.summary}<span className="rver tnum">{i.stale ? <b className="stale">Needs re-verification</b> : <>Verified {i.verified}</>}</span></span>
        <span className="rmeta"><span className="code">{categories[i.category]?.code}</span>{i.official ? <span className="pill">Official</span> : <span className="pill ghost">Community</span>}</span>
        <span className="arrow" aria-hidden="true">→</span>
      </Link></li>)}</ol>
      {list.length === 0 && <p className="empty">No entries match “{q}”. <a href="/submit">Suggest one →</a></p>}
    </div>
  </section>);
}
