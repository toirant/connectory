import Link from "next/link";
import { connectors, logoOf } from "../lib/data";
const L = ["github", "figma", "stripe", "linear", "notion", "slack"];
const R = ["supabase", "sentry", "vercel", "postgres", "cloudflare", "playwright"];
const W = 640, H = 460, CX = 320, CY = 230;
export default function Hero() {
  const nodes = [...L.map((s, i) => ({ s, x: 46, y: 50 + i * 72, side: -1 })), ...R.map((s, i) => ({ s, x: W - 46, y: 50 + i * 72, side: 1 }))];
  return (<figure className="hero-viz" aria-label="Diagram: MCP servers plugging into an AI agent">
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-hidden="true">
      <defs><pattern id="g" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="var(--grid)" strokeWidth="1" /></pattern></defs>
      <rect width={W} height={H} fill="url(#g)" />
      {[[12, 12], [W - 12, 12], [12, H - 12], [W - 12, H - 12]].map(([x, y], i) => <g key={i} className="reg" transform={`translate(${x} ${y})`}><circle r="5" /><path d="M-9 0H9M0-9V9" /></g>)}
      {nodes.map((n, i) => { const sx = n.x - n.side * 26, ex = CX + n.side * 62, ey = CY + (n.y - CY) * 0.18;
        const d = `M${sx} ${n.y} C ${(sx + ex) / 2} ${n.y}, ${(sx + ex) / 2} ${ey}, ${ex} ${ey}`;
        return <g key={n.s} className="wire" style={{ ["--d" as string]: `${(i * 0.37) % 3.2}s` }}>
          <path d={d} className="w-base" /><path d={d} className="w-pulse" pathLength={100} />
          <circle cx={ex} cy={ey} r="3" className="w-port" /></g>; })}
      <g className="agent" transform={`translate(${CX - 60} ${CY - 60})`}>
        <rect width="120" height="120" className="a-body" />
        {Array.from({ length: 7 }).map((_, i) => <g key={i}><path d={`M${12 + i * 16} 0V-8M${12 + i * 16} 120V128`} className="a-pin" /></g>)}
        <text x="60" y="52" textAnchor="middle" className="a-t1">AGENT</text>
        <text x="60" y="72" textAnchor="middle" className="a-t2">via MCP</text>
        <circle cx="60" cy="94" r="4" className="a-led" />
      </g>
    </svg>
    <div className="hero-nodes">{nodes.map(n => { const c = connectors.find(x => x.slug === n.s)!;
      return <Link key={n.s} href={`/connectors/${n.s}`} className="hn" style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }} aria-label={c.name}>
        <img src={logoOf(n.s)!} alt="" width={22} height={22} /><span>{c.name.replace(/ \(.*\)/, "")}</span></Link>; })}</div>
    <figcaption className="eyebrow">Fig. 1 — Twelve of {connectors.length} servers, wired to one agent. Hover a node.</figcaption>
  </figure>);
}
