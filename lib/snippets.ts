import { Connector, entryOf } from "./data";
import type { Client } from "./guides";
const key = (s: string) => s.replace(/[^a-z0-9-]/g, "");
const sh = (s: string) => /^[\w@./:=,-]+$/.test(s) ? s : `'${s.replace(/'/g, "'\\''")}'`;
const tq = (s: string) => JSON.stringify(s);
/** Returns { label, code, origin } or null. origin: "docs" = copied from vendor docs, "derived" = mechanically converted from the documented config. */
export function snippetFor(c: Connector, client: Client): { label: string; code: string; origin: "docs" | "derived" } | null {
  const e = entryOf(c); const k = key(c.slug);
  if (client === "claudecode") {
    const doc = c.setup.find(s => /claude code/i.test(s.label) && /^claude mcp add/m.test(s.code));
    if (doc) return { label: doc.label, code: doc.code, origin: "docs" };
    if (!e) return null;
    if (e.url) return { label: "Claude Code", code: `claude mcp add --transport http ${k} ${e.url}`, origin: "derived" };
    const env = Object.entries(e.env || {}).map(([a, b]) => `--env ${a}=${sh(b)} `).join("");
    return { label: "Claude Code", code: `claude mcp add ${k} ${env}-- ${[e.command!, ...(e.args || [])].map(sh).join(" ")}`, origin: "derived" };
  }
  if (!e) return null;
  if (client === "codex") {
    const l = [`[mcp_servers.${k.replace(/-/g, "_")}]`];
    if (e.url) l.push(`url = ${tq(e.url)}`); else { l.push(`command = ${tq(e.command!)}`); l.push(`args = [${(e.args || []).map(tq).join(", ")}]`); }
    if (e.env && !e.url) { l.push("", `[mcp_servers.${k.replace(/-/g, "_")}.env]`); for (const [a, b] of Object.entries(e.env)) l.push(`${a} = ${tq(b)}`); }
    return { label: "~/.codex/config.toml", code: l.join("\n"), origin: "derived" };
  }
  const body: Record<string, unknown> = e.url ? (client === "vscode" ? { type: "http", url: e.url } : { url: e.url }) : { ...(client === "vscode" ? { type: "stdio" } : {}), command: e.command, args: e.args || [], ...(e.env ? { env: e.env } : {}) };
  const root = client === "vscode" ? { servers: { [k]: body } } : { mcpServers: { [k]: body } };
  return { label: client === "vscode" ? ".vscode/mcp.json" : "~/.cursor/mcp.json", code: JSON.stringify(root, null, 2), origin: e.url || client === "vscode" ? "derived" : "docs" };
}
