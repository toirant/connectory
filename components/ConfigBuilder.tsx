"use client";
import { useEffect, useMemo, useState } from "react";
import CopyButton from "./CopyButton";
type Entry = { command?: string; args?: string[]; env?: Record<string, string>; url?: string; type?: string };
export type BItem = { slug: string; name: string; logo: string | null; category: string; entry: Entry | null; officialUrl: string };
const CLIENTS = [
  { id: "cursor", name: "Cursor", file: "~/.cursor/mcp.json" },
  { id: "vscode", name: "VS Code", file: ".vscode/mcp.json" },
  { id: "claude", name: "Claude Desktop", file: "claude_desktop_config.json" },
  { id: "claudecode", name: "Claude Code", file: "terminal" },
  { id: "generic", name: "Generic mcp.json", file: "mcp.json" },
] as const;
type CId = typeof CLIENTS[number]["id"];
const key = (s: string) => s.replace(/[^a-z0-9-]/g, "");
const sh = (s: string) => /^[\w@./:=,-]+$/.test(s) ? s : `'${s.replace(/'/g, "'\\''")}'`;
function build(client: CId, list: BItem[]) {
  const notes: string[] = [];
  if (client === "claudecode") {
    const lines = list.map(i => { const e = i.entry!; const k = key(i.slug);
      if (e.url) return `claude mcp add --transport http ${k} ${e.url}`;
      const env = Object.entries(e.env || {}).map(([a, b]) => `-e ${a}=${sh(b)} `).join("");
      return `claude mcp add ${k} ${env}-- ${[e.command!, ...(e.args || [])].map(sh).join(" ")}`; });
    return { text: lines.join("\n"), notes, lang: "sh" };
  }
  const servers: Record<string, unknown> = {};
  for (const i of list) { const e = i.entry!; const k = key(i.slug);
    if (e.url) {
      if (client === "claude") { notes.push(`${i.name}: remote server — add ${e.url} under Settings → Connectors.`); continue; }
      servers[k] = client === "vscode" ? { type: "http", url: e.url } : { url: e.url };
    } else {
      const base: Record<string, unknown> = { command: e.command, args: e.args || [] }; if (e.env) base.env = e.env;
      servers[k] = client === "vscode" ? { type: "stdio", ...base } : base;
    } }
  const root = client === "vscode" ? { servers } : { mcpServers: servers };
  return { text: JSON.stringify(root, null, 2), notes, lang: "json" };
}
function hl(t: string, lang: string) {
  const esc = t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  if (lang !== "json") return esc.replace(/^(claude mcp add)/gm, '<i class="t-k">$1</i>');
  return esc.replace(/("(?:[^"\\]|\\.)*")(\s*:)?/g, (_m, s, c) => c ? `<i class="t-k">${s}</i>${c}` : `<i class="t-s">${s}</i>`);
}
export default function ConfigBuilder({ items, compact = false }: { items: BItem[]; compact?: boolean }) {
  const [sel, setSel] = useState<string[]>(["github", "linear", "filesystem"]);
  const [client, setClient] = useState<CId>("cursor"); const [q, setQ] = useState("");
  useEffect(() => { const a = new URLSearchParams(window.location.search).get("add");
    if (a) setSel(s => Array.from(new Set([...a.split(",").filter(x => items.some(i => i.slug === x && i.entry)), ...s]))); }, [items]);
  const ok = items.filter(i => sel.includes(i.slug) && i.entry);
  const out = useMemo(() => build(client, ok), [client, ok.map(i => i.slug).join()]);
  const match = (i: BItem) => !q || i.name.toLowerCase().includes(q.toLowerCase());
  const shown = items.filter(i => i.entry && match(i)); const manual = items.filter(i => !i.entry && match(i));
  const toggle = (s: string) => setSel(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const c = CLIENTS.find(x => x.id === client)!;
  return (<div className={compact ? "builder compact" : "builder"}>
    <div className="b-pick">
      <div className="b-bar"><span className="eyebrow"><b>01</b> Select servers</span><span className="tnum eyebrow">{ok.length} selected</span></div>
      <input className="b-search" placeholder="Filter servers…" value={q} onChange={e => setQ(e.target.value)} aria-label="Filter servers" />
      <ul className="b-tiles">{shown.map(i => { const on = sel.includes(i.slug); const dis = !i.entry;
        return <li key={i.slug}><label className={`tile${on && !dis ? " on" : ""}${dis ? " dis" : ""}`} title={dis ? "No verified JSON config — see the README" : i.name}>
          <input type="checkbox" checked={on && !dis} disabled={dis} onChange={() => toggle(i.slug)} />
          <span className="tile-logo">{i.logo ? <img src={i.logo} alt="" width={20} height={20} loading="lazy" /> : null}</span>
          <span className="tile-name">{i.name.replace(/ \(.*\)/, "")}</span>
          <span className="tile-box" aria-hidden="true" />
        </label></li>; })}</ul>
      {manual.length > 0 && <div className="b-manual"><p className="eyebrow">Manual setup · see README <span className="tnum">({manual.length})</span></p>
        <p>{manual.map((i, n) => <span key={i.slug}><a href={i.officialUrl} target="_blank" rel="noopener">{i.name.replace(/ \(.*\)/, "")}</a>{n < manual.length - 1 ? " · " : ""}</span>)}</p></div>}
    </div>
    <div className="b-out">
      <div className="b-bar"><span className="eyebrow"><b>02</b> Choose client</span></div>
      <div className="b-clients" role="tablist">{CLIENTS.map(x => <button key={x.id} role="tab" aria-selected={client === x.id} className={client === x.id ? "on" : ""} onClick={() => setClient(x.id)}>{x.name}</button>)}</div>
      <div className="b-bar"><span className="eyebrow"><b>03</b> Paste into <code>{c.file}</code></span><CopyButton text={out.text} label="Copy config" /></div>
      <pre className="b-code" aria-live="polite"><code dangerouslySetInnerHTML={{ __html: ok.length ? hl(out.text, out.lang) : "// Select at least one server" }} /></pre>
      {out.notes.length > 0 && <ul className="b-notes">{out.notes.map(n => <li key={n}>{n}</li>)}</ul>}
      <p className="b-fine">Built only from setup snippets verified against each server’s official docs. Replace placeholder values (keys, paths) before use. Servers marked “see README” need manual setup.</p>
    </div>
  </div>);
}
