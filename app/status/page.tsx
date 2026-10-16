import Link from "next/link";
import type { Metadata } from "next";
import Logo from "../../components/Logo";
import { connectors, driftOf, driftRun, flagged, authFlagged, liveCount, logoOf, fmtDate } from "../../lib/data";
export const metadata: Metadata = { title: "Verification status", description: "Which Connectory entries need re-verification because their upstream setup docs changed.", alternates: { canonical: "/status" } };
export default function Page() {
  const f = flagged(); const af = authFlagged(); const failed = connectors.filter(c => driftOf(c.slug).lastError);
  return (<div className="wrap"><header className="pagehead"><p className="eyebrow">Colophon · Verification</p><h1>Status</h1>
    <p className="dek">Every entry is docs-matched: its setup, auth method and scopes were copied from the vendor's own README or docs, and the date of that check is recorded. Automated checks then watch for upstream changes.</p>
    <dl className="stats"><div><dt>Entries</dt><dd className="tnum">{connectors.length}</dd></div><div><dt>Setup drift</dt><dd className="tnum">{String(f.length).padStart(2, "0")}</dd></div><div><dt>Auth changed</dt><dd className="tnum">{String(af.length).padStart(2, "0")}</dd></div><div><dt>Live tool lists</dt><dd className="tnum">{String(liveCount()).padStart(2, "0")}</dd></div><div><dt>Last drift run</dt><dd className="tnum small">{driftRun ? fmtDate(driftRun) : "—"}</dd></div></dl></header>
    <section className="sheet" style={{ marginTop: 40 }}><div className="b-bar"><span className="eyebrow"><b>●</b> Setup drift · needs re-verification</span><span className="eyebrow tnum">{f.length}</span></div>
      {f.length === 0 ? <p className="empty">Nothing flagged. All {connectors.length} entries match their upstream baseline as of the last run.</p> :
      <ol className="rows">{f.map((c, n) => { const d = driftOf(c.slug); return <li key={c.slug}><Link href={`/connectors/${c.slug}`} className="row-item"><span className="num tnum">{String(n + 1).padStart(3, "0")}</span><span className="rlogo"><Logo src={logoOf(c.slug)} name={c.name} size={22} /></span><span className="rname">{c.name}</span><span className="rsum">Changed {d.changedAt ? fmtDate(d.changedAt) : "?"} · source {d.source}{d.release ? ` · release ${d.release}` : ""}</span><span className="rmeta"><b className="stale">Re-verify</b></span><span className="arrow">→</span></Link></li>; })}</ol>}
      {failed.length > 0 && <p className="empty">Could not fetch: {failed.map(c => c.name).join(", ")}.</p>}
    </section>
    <section className="sheet" style={{ marginTop: 40 }}><div className="b-bar"><span className="eyebrow"><b>◆</b> Auth changed</span><span className="eyebrow tnum">{af.length}</span></div>
      {af.length === 0 ? <p className="empty">No auth changes detected. Auth-related upstream text (OAuth, API keys, tokens, scopes, permissions) matches its baseline for all entries.</p> :
      <ol className="rows">{af.map((c, n) => { const d = driftOf(c.slug); return <li key={c.slug}><Link href={`/connectors/${c.slug}`} className="row-item"><span className="num tnum">{String(n + 1).padStart(3, "0")}</span><span className="rlogo"><Logo src={logoOf(c.slug)} name={c.name} size={22} /></span><span className="rname">{c.name}</span><span className="rsum">Auth text changed {d.authChangedAt ? fmtDate(d.authChangedAt) : "?"} · documented: {c.auth.method}</span><span className="rmeta"><b className="stale">Auth changed</b></span><span className="arrow">→</span></Link></li>; })}</ol>}
    </section>
    <div className="artbody narrow"><h2>Methodology</h2>
      <p><b>Docs-matched verification.</b> Entries are written from each server's official README or docs. Auth method and scopes are recorded only when the vendor documents them; otherwise we say "Not documented". "Last verified" is the date a person last matched the entry against those sources. We have not tested every server end to end.</p>
      <p><b>Setup drift.</b> <code>npm run check-drift</code> hashes the setup-relevant lines of each upstream page (install commands, server URLs, env vars, config keys) plus the latest GitHub release tag. A change flags the entry "Needs re-verification".</p>
      <p><b>Auth-change flag.</b> The same run separately hashes auth-related lines (OAuth, API keys, tokens, scopes, permissions, PATs, client IDs/secrets). A change there is its own "Auth changed" flag, since it can mean new scopes or a different sign-in flow. It is a text-change signal, not proof that auth actually changed.</p>
      <p><b>Live tool listing.</b> For {liveCount()} servers that run without any credentials (stdio packages that need no secrets, plus public remote endpoints with no auth), <code>npm run list-tools</code> connects with the MCP SDK and calls only <code>tools/list</code>, with timeouts, from an empty temp directory. No tools are invoked. Those pages show "Tools (live-checked DATE)". Every other server keeps its docs-based tool list.</p></div>
    <div className="artbody narrow"><h2>How it runs</h2><p>On demand from the repository: <code>npm run check-drift</code> and <code>npm run list-tools</code>. After re-checking an entry by hand, accept it with <code>node scripts/check-drift.mjs --accept slug</code> and update its <code>lastVerified</code> date.</p></div>
  </div>);
}
