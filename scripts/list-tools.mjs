#!/usr/bin/env node
// Live tool listing for credential-free MCP servers.
// Only servers on the explicit allowlist below are started/contacted: official or well-known packages
// that need no API keys, tokens or env secrets. Each connection gets a hard timeout; stdio child
// processes run in a throwaway temp dir with a minimal env (no secrets from this shell are passed on)
// and are killed afterwards. We only call initialize + tools/list — never any tool.
// Usage: node scripts/list-tools.mjs [slug ...]
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os"; import { join } from "path"; import { execSync } from "child_process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
const ROOT = new URL("..", import.meta.url).pathname;
const FILE = ROOT + "data/tools.json";
const connectors = JSON.parse(readFileSync(ROOT + "data/connectors.json", "utf8"));
const db = existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : { entries: {} };
const TIMEOUT = 90000;
// {dir} is replaced with a fresh empty temp directory.
const ALLOW = {
  memory: { command: "npx", args: ["-y", "@modelcontextprotocol/server-memory"], env: { MEMORY_FILE_PATH: "{dir}/memory.json" } },
  "sequential-thinking": { command: "npx", args: ["-y", "@modelcontextprotocol/server-sequential-thinking"] },
  everything: { command: "npx", args: ["-y", "@modelcontextprotocol/server-everything"] },
  filesystem: { command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem", "{dir}"] },
  time: { command: "uvx", args: ["mcp-server-time"] },
  fetch: { command: "uvx", args: ["mcp-server-fetch"] },
  git: { command: "uvx", args: ["mcp-server-git", "--repository", "{dir}"], gitInit: true },
  playwright: { command: "npx", args: ["-y", "@playwright/mcp@latest", "--headless", "--isolated"] },
  "chrome-devtools": { command: "npx", args: ["-y", "chrome-devtools-mcp@latest", "--headless", "--isolated"] },
  context7: { url: "https://mcp.context7.com/mcp" },
  cloudflare: { url: "https://docs.mcp.cloudflare.com/mcp", note: "Cloudflare Docs server only" },
  exa: { url: "https://mcp.exa.ai/mcp" },
};
const only = process.argv.slice(2);
const sub = (v, dir) => v.replaceAll("{dir}", dir);
async function list(slug, spec) {
  const client = new Client({ name: "connectory-list-tools", version: "1.0.0" });
  let transport, dir = null;
  if (spec.url) transport = new StreamableHTTPClientTransport(new URL(spec.url));
  else {
    dir = mkdtempSync(join(tmpdir(), `mcp-${slug}-`));
    if (spec.gitInit) execSync("git init -q && git -c user.email=a@b -c user.name=x commit -q --allow-empty -m init", { cwd: dir });
    const env = { PATH: process.env.PATH, HOME: process.env.HOME, TMPDIR: tmpdir(), npm_config_yes: "true" };
    for (const [k, v] of Object.entries(spec.env || {})) env[k] = sub(v, dir);
    transport = new StdioClientTransport({ command: spec.command, args: spec.args.map(a => sub(a, dir)), env, cwd: dir, stderr: "ignore" });
  }
  let timer;
  try {
    const run = (async () => { await client.connect(transport); const r = await client.listTools(undefined, { timeout: 30000 }); return r.tools; })();
    return await Promise.race([run, new Promise((_, rej) => { timer = setTimeout(() => rej(new Error("timeout")), TIMEOUT); })]);
  } finally {
    clearTimeout(timer);
    try { await client.close(); } catch {}
    try { const pid = transport.pid; if (pid) process.kill(pid, "SIGKILL"); } catch {}
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}
const today = new Date().toISOString().slice(0, 10); let ok = 0, fail = [];
for (const c of connectors) {
  const spec = ALLOW[c.slug]; if (!spec || (only.length && !only.includes(c.slug))) continue;
  process.stdout.write(`${c.slug} ... `);
  try {
    const tools = await list(c.slug, spec);
    db.entries[c.slug] = { checked: today, via: spec.url ? `remote ${spec.url}` : `${spec.command} ${spec.args[spec.args[0] === "-y" ? 1 : 0]}`, ...(spec.note ? { note: spec.note } : {}),
      tools: tools.map(t => ({ name: t.name, description: (t.description || "").replace(/\s+/g, " ").trim().slice(0, 300) })) };
    ok++; console.log(`${tools.length} tools`);
  } catch (e) { fail.push(c.slug); console.log(`failed (${e.message.slice(0, 120)})`); if (db.entries[c.slug]) db.entries[c.slug].lastError = `${today}: ${e.message.slice(0, 200)}`; }
}
db.lastRun = new Date().toISOString(); writeFileSync(FILE, JSON.stringify(db, null, 1) + "\n");
console.log(`Listed ${ok} servers; failed: ${fail.join(", ") || "none"}. Skipped ${connectors.length - Object.keys(ALLOW).length} that need credentials or aren't allowlisted.`);
process.exit(0);
