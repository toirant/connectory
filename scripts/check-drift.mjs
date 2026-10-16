#!/usr/bin/env node
// Drift detection for Connectory.
// For each connector: fetch the upstream README (GitHub) or docs page, extract setup-relevant lines
// (install commands, server URLs, env vars, config keys), hash them, and compare with the stored baseline.
// Usage:  node scripts/check-drift.mjs            -> compare, flag changes (baseline created on first run)
//         node scripts/check-drift.mjs --accept slug1,slug2   -> mark re-verified: adopt new hash, clear flag
//         node scripts/check-drift.mjs --accept-all
import { readFileSync, writeFileSync, existsSync } from "fs";
import { createHash } from "crypto";
const ROOT = new URL("..", import.meta.url).pathname;
const connectors = JSON.parse(readFileSync(ROOT + "data/connectors.json", "utf8"));
const FILE = ROOT + "data/drift.json";
const db = existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : { entries: {} };
const args = process.argv.slice(2);
const accept = args.includes("--accept-all") ? connectors.map(c => c.slug) : (args[args.indexOf("--accept") + 1] || "").split(",").filter(s => args.includes("--accept") && s);
const H = { "user-agent": "connectory-drift-check", ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };
const get = async (u, json) => { const r = await fetch(u, { headers: H, redirect: "follow", signal: AbortSignal.timeout(20000) }); if (!r.ok) throw new Error(`${r.status} ${u}`); return json ? r.json() : r.text(); };
function sources(c) {
  const m = c.sourceUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+)\/(.+))?\/?$/);
  if (m) { const [, o, r, br, p] = m; const branches = br ? [br] : ["main", "master"];
    return { repo: `${o}/${r}`, readmes: branches.map(b => `https://raw.githubusercontent.com/${o}/${r}/${b}/${p ? p + "/" : ""}README.md`) }; }
  return { repo: null, readmes: [c.officialUrl] };
}
const RELEVANT = /(npx |uvx |docker (run|mcp)|"command"|"args"|"url"|"type":|https?:\/\/[^\s"')]*mcp[^\s"')]*|claude mcp add|--transport|[A-Z][A-Z0-9]+_(API_KEY|TOKEN|URL|HOST|KEY|SECRET|CONNECTION_STRING)|pip install|npm i(nstall)? )/;
// Auth-related lines are hashed separately so an auth change gets its own flag.
const AUTH = /(oauth|api[ _-]?key|access[ _-]?token|bearer|\btokens?\b|\bscopes?\b|permissions?|authenticat|authoriz|\bPAT\b|personal access|client[ _-]?(id|secret)|credentials?|service account|sign[ -]?in)/i;
function clean(text) {
  const t = text.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, "\n").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  return t.split("\n").map(l => l.trim().replace(/\s+/g, " ")).filter(l => l && l.length < 400).filter(l => !/img\.shields\.io|badge/i.test(l));
}
function extractAuth(text) { return Array.from(new Set(clean(text).filter(l => AUTH.test(l)))).sort(); }
function extract(text) {
  const t = text.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, "\n").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  const lines = t.split("\n").map(l => l.trim().replace(/\s+/g, " ")).filter(l => l && l.length < 400 && RELEVANT.test(l)).filter(l => !/img\.shields\.io|badge/i.test(l));
  return Array.from(new Set(lines)).sort();
}
const now = new Date().toISOString(); let authChangedNow = [], authBaselined = 0; let changed = [], failed = [], baselined = 0, same = 0;
for (const c of connectors) {
  const s = sources(c); let text = null, used = null;
  for (const u of s.readmes) { try { text = await get(u); used = u; break; } catch {} }
  let release = null;
  if (s.repo) { try { const j = await get(`https://api.github.com/repos/${s.repo}/releases/latest`, true); release = j.tag_name || null; } catch {} }
  const prev = db.entries[c.slug];
  if (!text) { failed.push(c.slug); db.entries[c.slug] = { ...(prev || {}), lastCheck: now, lastError: "fetch failed" }; continue; }
  const lines = extract(text); const hash = createHash("sha256").update(lines.join("\n")).digest("hex").slice(0, 16);
  const e = { source: used, hash, lines: lines.length, release, lastCheck: now, baselineAt: prev?.baselineAt || now, needsReverification: prev?.needsReverification || false, changedAt: prev?.changedAt || null };
  if (!prev?.hash) { baselined++; e.baselineHash = hash; e.baselineRelease = release; }
  else { e.baselineHash = prev.baselineHash || prev.hash; e.baselineRelease = prev.baselineRelease ?? prev.release ?? null;
    const drift = hash !== e.baselineHash || (release && e.baselineRelease && release !== e.baselineRelease);
    if (drift && !e.needsReverification) { e.needsReverification = true; e.changedAt = now; }
    if (drift) changed.push(c.slug); else same++; }
  const al = extractAuth(text); const authHash = createHash("sha256").update(al.join("\n")).digest("hex").slice(0, 16);
  Object.assign(e, { authHash, authLines: al.length, authBaselineHash: prev?.authBaselineHash || null, authChanged: prev?.authChanged || false, authChangedAt: prev?.authChangedAt || null });
  if (!e.authBaselineHash) { e.authBaselineHash = authHash; authBaselined++; }
  else if (authHash !== e.authBaselineHash) { authChangedNow.push(c.slug); if (!e.authChanged) { e.authChanged = true; e.authChangedAt = now; } }
  if (accept.includes(c.slug)) { e.authBaselineHash = authHash; e.authChanged = false; e.authChangedAt = null; }
  if (accept.includes(c.slug)) { e.baselineHash = hash; e.baselineRelease = release; e.baselineAt = now; e.needsReverification = false; e.changedAt = null; }
  db.entries[c.slug] = e;
}
db.lastRun = now; writeFileSync(FILE, JSON.stringify(db, null, 1) + "\n");
const flagged = Object.entries(db.entries).filter(([, v]) => v.needsReverification).map(([k]) => k);
console.log(`Checked ${connectors.length} connectors at ${now}`);
console.log(`  baselined: ${baselined}  unchanged: ${same}  changed: ${changed.length}  fetch failed: ${failed.length}`);
if (changed.length) console.log("  changed:", changed.join(", "));
if (failed.length) console.log("  failed:", failed.join(", "));
console.log(`  flagged 'Needs re-verification': ${flagged.length}${flagged.length ? " -> " + flagged.join(", ") : ""}`);
const authFlagged = Object.entries(db.entries).filter(([, v]) => v.authChanged).map(([k]) => k);
console.log(`  auth baselined: ${authBaselined}  auth changed this run: ${authChangedNow.length}`);
console.log(`  flagged 'Auth changed': ${authFlagged.length}${authFlagged.length ? " -> " + authFlagged.join(", ") : ""}`);
