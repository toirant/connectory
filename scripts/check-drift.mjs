#!/usr/bin/env node
// Drift detection for Connectory.
// For each connector: fetch the upstream README (GitHub) or docs page, extract setup-relevant lines
// (install commands, server URLs, env vars, config keys), hash them, and compare with the stored baseline.
// Usage:  node scripts/check-drift.mjs            -> compare, flag changes (baseline created on first run)
//         node scripts/check-drift.mjs --accept slug1,slug2   -> mark re-verified: adopt new hash, clear flag
//         node scripts/check-drift.mjs --accept-all
import { readFileSync, writeFileSync, existsSync } from "fs";
import { createHash } from "crypto";
import { execFileSync } from "child_process";
const ROOT = new URL("..", import.meta.url).pathname;
const connectors = JSON.parse(readFileSync(ROOT + "data/connectors.json", "utf8"));
const FILE = ROOT + "data/drift.json";
const db = existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : { entries: {} };
const args = process.argv.slice(2);
const accept = args.includes("--accept-all") ? connectors.map(c => c.slug) : (args[args.indexOf("--accept") + 1] || "").split(",").filter(s => args.includes("--accept") && s);
// GitHub token (never printed): GITHUB_TOKEN, GH_TOKEN, else `gh auth token` if gh is installed and signed in.
function ghToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN.trim();
  for (const bin of ["gh", "/usr/local/bin/gh", "/usr/bin/gh", "/opt/homebrew/bin/gh"]) { try { const t = execFileSync(bin, ["auth", "token"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 10000 }).trim(); if (t) return t; } catch {} }
  return null;
}
const TOKEN = ghToken();
if (!TOKEN) console.warn("WARNING: no GitHub token (GITHUB_TOKEN, GH_TOKEN or `gh auth token`); running anonymously, limited to 60 GitHub API requests/hour.");
// The token is only ever sent to GitHub hosts, never to vendor docs pages.
const GH_HOSTS = new Set(["api.github.com", "raw.githubusercontent.com"]);
const headersFor = u => ({ "user-agent": "connectory-drift-check", ...(TOKEN && GH_HOSTS.has(new URL(u).hostname) ? { authorization: `Bearer ${TOKEN}` } : {}) });
class RateLimited extends Error {}
const get = async (u, json) => {
  const r = await fetch(u, { headers: headersFor(u), redirect: "follow", signal: AbortSignal.timeout(20000) });
  if ((r.status === 403 || r.status === 429) && GH_HOSTS.has(new URL(u).hostname) && (r.status === 429 || r.headers.get("x-ratelimit-remaining") === "0" || r.headers.has("retry-after"))) throw new RateLimited(`${r.status} rate limited`);
  if (!r.ok) throw new Error(`${r.status} ${u}`); return json ? r.json() : r.text(); };
function sources(c) {
  const m = c.sourceUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+)\/(.+))?\/?$/);
  if (m) { const [, o, r, br, p] = m; const branches = br ? [br] : ["main", "master"];
    return { repo: `${o}/${r}`, readmes: branches.map(b => `https://raw.githubusercontent.com/${o}/${r}/${b}/${p ? p + "/" : ""}README.md`) }; }
  return { repo: null, readmes: [c.officialUrl] };
}
const RELEVANT = /(npx |uvx |docker (run|mcp)|"command"|"args"|"url"|"type":|https?:\/\/[^\s"')]*mcp[^\s"')]*|claude mcp add|--transport|[A-Z][A-Z0-9]+_(API_KEY|TOKEN|URL|HOST|KEY|SECRET|CONNECTION_STRING)|pip install|npm i(nstall)? )/;
// Auth-related lines are hashed separately so an auth change gets its own flag.
const AUTH = /(oauth|api[ _-]?key|access[ _-]?token|bearer|\btokens?\b|\bscopes?\b|permissions?|authenticat|authoriz|\bPAT\b|personal access|client[ _-]?(id|secret)|credentials?|service account|sign[ -]?in)/i;
// Strip only real HTML tags/comments, so text like `mcp>=1.29.0,<2` is left intact.
const TAG = /<!--[\s\S]*?-->|<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?\/?>/g;
function clean(text) {
  const t = text.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(TAG, "\n").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  return t.split("\n").map(l => l.trim().replace(/\s+/g, " ")).filter(l => l && l.length < 400).filter(l => !/img\.shields\.io|badge/i.test(l));
}
function extractAuth(text) { return Array.from(new Set(clean(text).filter(l => AUTH.test(l)))).sort(); }
function extract(text) { return Array.from(new Set(clean(text).filter(l => RELEVANT.test(l)))).sort(); }
const now = new Date().toISOString(); let authChangedNow = [], authBaselined = 0; let rateSkipped = [], changed = [], failed = [], baselined = 0, same = 0;
for (const c of connectors) {
  const s = sources(c); let text = null, used = null;
  let limited = false;
  for (const u of s.readmes) { try { text = await get(u); used = u; break; } catch (e) { if (e instanceof RateLimited) { limited = true; break; } } }
  let release = null;
  const prev = db.entries[c.slug];
  if (s.repo && !limited) { try { const j = await get(`https://api.github.com/repos/${s.repo}/releases/latest`, true); release = j.tag_name || null; } catch (e) { if (e instanceof RateLimited) limited = true; } }
  // Rate-limited: skip the entry entirely (keep its stored state) and report it, rather than treating it as unchanged.
  if (limited) { rateSkipped.push(c.slug); if (prev) db.entries[c.slug] = { ...prev, lastError: `${now}: GitHub rate limit, not checked` }; continue; }
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
if (rateSkipped.length) console.log(`  SKIPPED (GitHub rate limit, not checked, not accepted): ${rateSkipped.length} -> ${rateSkipped.join(", ")}`);
console.log(`  flagged 'Needs re-verification': ${flagged.length}${flagged.length ? " -> " + flagged.join(", ") : ""}`);
const authFlagged = Object.entries(db.entries).filter(([, v]) => v.authChanged).map(([k]) => k);
console.log(`  auth baselined: ${authBaselined}  auth changed this run: ${authChangedNow.length}`);
console.log(`  flagged 'Auth changed': ${authFlagged.length}${authFlagged.length ? " -> " + authFlagged.join(", ") : ""}`);
