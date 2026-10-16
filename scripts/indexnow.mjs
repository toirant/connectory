// Submit every URL in the live sitemap to IndexNow (shared with Bing, Yandex, Seznam, Naver...).
// Usage: node scripts/indexnow.mjs [https://connectory-rose.vercel.app]
import { readFileSync, readdirSync } from "node:fs";
const site = (process.argv[2] || "https://connectory-rose.vercel.app").replace(/\/$/, "");
const keyFile = readdirSync("public").find(f => /^[a-f0-9]{32}\.txt$/.test(f));
const key = readFileSync(`public/${keyFile}`, "utf8").trim();
const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const body = { host: new URL(site).host, key, keyLocation: `${site}/${keyFile}`, urlList };
for (const ep of ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"]) {
  const r = await fetch(ep, { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(body) });
  console.log(ep, r.status, r.statusText, `${urlList.length} URLs`, (await r.text()).slice(0, 200));
}
