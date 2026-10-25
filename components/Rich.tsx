import Link from "next/link";
import { connectors } from "../lib/data";
/** Inline mini-markup: [[slug]] → connector link, [text](href) → link, `code` → code, **bold** → strong. */
export default function Rich({ x }: { x: string }) {
  const parts = x.split(/(\[\[[a-z0-9-]+\]\]|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return <>{parts.map((p, i) => {
    let m = p.match(/^\[\[([a-z0-9-]+)\]\]$/);
    if (m) { const c = connectors.find(c => c.slug === m![1]); return c ? <Link key={i} href={`/connectors/${c.slug}`}>{c.name}</Link> : p; }
    m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) return m[2].startsWith("/") ? <Link key={i} href={m[2]}>{m[1]}</Link> : <a key={i} href={m[2]} target="_blank" rel="noopener">{m[1]}</a>;
    if (p.startsWith("`") && p.endsWith("`") && p.length > 1) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) return <strong key={i}>{p.slice(2, -2)}</strong>;
    return p;
  })}</>;
}
