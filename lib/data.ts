import raw from "../data/connectors.json";
import logoMap from "../data/logos.json";
import drift from "../data/drift.json";
import toolsDb from "../data/tools.json";
export type Setup = { label: string; code: string };
export type Entry = { command?: string; args?: string[]; env?: Record<string, string>; url?: string; type?: string };
export type Connector = { slug: string; name: string; vendor: string; category: string; official: boolean; summary: string; description: string; tools: string[]; setup: Setup[]; prompts: string[]; officialUrl: string; sourceUrl: string; lastVerified: string; auth: { method: string; scopes: string } };
export const connectors = (raw as Connector[]).slice().sort((a, b) => a.name.localeCompare(b.name));
export const categories: Record<string, { name: string; blurb: string; code: string }> = {
  "dev-tools": { name: "Dev Tools", code: "DEV", blurb: "MCP servers for code, cloud, CI, observability and browsers." },
  design: { name: "Design", code: "DSN", blurb: "Bring design context from tools like Figma into coding agents." },
  payments: { name: "Payments", code: "PAY", blurb: "Payments, invoicing and commerce APIs for AI agents." },
  productivity: { name: "Productivity", code: "PRD", blurb: "Docs, tasks, notes and workflow automation connectors." },
  data: { name: "Data & Search", code: "DAT", blurb: "Databases, vector stores, web search and scraping." },
  communication: { name: "Communication", code: "COM", blurb: "Messaging, email, SMS and voice." },
};
export const SITE_NAME = "Connectory";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
export const CONTACT = "memphiznero@outlook.com";
const logos = logoMap as Record<string, { file: string; hex?: string; source: string }>;
export function logoOf(slug: string) { const l = logos[slug]; return l ? `/logos/${l.file}` : null; }
/** First setup snippet that is a JSON client config; this is the only source the Config Builder uses. */
export function entryOf(c: Connector): Entry | null {
  for (const s of c.setup) { try { const j = JSON.parse(s.code); const o = j.mcpServers || j.servers; if (o) return Object.values(o)[0] as Entry; } catch {} }
  return null;
}
export function specOf(c: Connector) {
  const e = entryOf(c); const all = c.setup.map(s => s.code).join("\n");
  const remote = !!e?.url || /--transport http|https:\/\/[^\s"]*mcp/.test(all);
  const local = !!e?.command || /npx |uvx |docker run/.test(all);
  const transport = remote && local ? "Remote HTTP + local stdio" : remote ? "Remote (HTTP)" : local ? "Local (stdio)" : "See README";
  const envKeys = Array.from(new Set([...(e?.env ? Object.keys(e.env) : []), ...(all.match(/\b[A-Z][A-Z0-9]+_(?:API_KEY|TOKEN|ACCESS_TOKEN|URL|HOST|USER|PASSWORD|CONNECTION_STRING|SERVICE_ACCOUNT_TOKEN)\b/g) || [])]));
  const credentials = envKeys.length ? envKeys.join(", ") : e?.url ? "Sign-in via the vendor (remote server)" : "None listed";
  return { transport, credentials, tools: c.tools.length, status: c.official ? "Official" : "Community", builder: !!e };
}
export function slim(c: Connector) {
  return { slug: c.slug, name: c.name, vendor: c.vendor, category: c.category, official: c.official, summary: c.summary, tools: c.tools, logo: logoOf(c.slug), verified: c.lastVerified, stale: !!driftOf(c.slug).needsReverification };
}

type Drift = { source?: string; needsReverification?: boolean; changedAt?: string | null; lastCheck?: string; release?: string | null; lastError?: string; authChanged?: boolean; authChangedAt?: string | null };
export const driftRun: string | undefined = (drift as any).lastRun;
export function driftOf(slug: string): Drift { return ((drift as any).entries?.[slug] || {}) as Drift; }
export const flagged = () => connectors.filter(c => driftOf(c.slug).needsReverification);
export function fmtDate(iso: string) { return new Date(iso + (iso.length === 10 ? "T12:00:00Z" : "")).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" }); }
export const authFlagged = () => connectors.filter(c => driftOf(c.slug).authChanged);
export type LiveTools = { checked: string; via: string; note?: string; tools: { name: string; description: string }[] };
export function liveToolsOf(slug: string): LiveTools | null { return ((toolsDb as any).entries?.[slug] || null) as LiveTools | null; }
export const liveCount = () => Object.keys((toolsDb as any).entries || {}).length;
