import Link from "next/link";
import type { Metadata } from "next";
import Logo from "../../components/Logo";
import { connectors, driftOf, driftRun, flagged, logoOf, fmtDate } from "../../lib/data";
export const metadata: Metadata = { title: "Verification status", description: "Which Connectory entries need re-verification because their upstream setup docs changed.", alternates: { canonical: "/status" } };
export default function Page() {
  const f = flagged(); const failed = connectors.filter(c => driftOf(c.slug).lastError);
  return (<div className="wrap"><header className="pagehead"><p className="eyebrow">Colophon · Verification</p><h1>Status</h1>
    <p className="dek">Every entry records the date its sources were last checked by hand. A drift check hashes the setup-relevant parts of each upstream README or docs page (install commands, server URLs, env vars) plus the latest GitHub release, and flags entries whose upstream changed.</p>
    <dl className="stats"><div><dt>Entries</dt><dd className="tnum">{connectors.length}</dd></div><div><dt>Flagged</dt><dd className="tnum">{String(f.length).padStart(2, "0")}</dd></div><div><dt>Last drift run</dt><dd className="tnum small">{driftRun ? fmtDate(driftRun) : "—"}</dd></div></dl></header>
    <section className="sheet" style={{ marginTop: 40 }}><div className="b-bar"><span className="eyebrow"><b>●</b> Needs re-verification</span><span className="eyebrow tnum">{f.length}</span></div>
      {f.length === 0 ? <p className="empty">Nothing flagged. All {connectors.length} entries match their upstream baseline as of the last run.</p> :
      <ol className="rows">{f.map((c, n) => { const d = driftOf(c.slug); return <li key={c.slug}><Link href={`/connectors/${c.slug}`} className="row-item"><span className="num tnum">{String(n + 1).padStart(3, "0")}</span><span className="rlogo"><Logo src={logoOf(c.slug)} name={c.name} size={22} /></span><span className="rname">{c.name}</span><span className="rsum">Changed {d.changedAt ? fmtDate(d.changedAt) : "?"} · source {d.source}{d.release ? ` · release ${d.release}` : ""}</span><span className="rmeta"><b className="stale">Re-verify</b></span><span className="arrow">→</span></Link></li>; })}</ol>}
      {failed.length > 0 && <p className="empty">Could not fetch: {failed.map(c => c.name).join(", ")}.</p>}
    </section>
    <div className="artbody narrow"><h2>How it runs</h2><p>On demand from the repository: <code>npm run check-drift</code>. After re-checking an entry by hand, accept it with <code>node scripts/check-drift.mjs --accept slug</code> and update its <code>lastVerified</code> date.</p></div>
  </div>);
}
