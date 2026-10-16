// Regenerates simple-icons SVG logos into public/logos at build time (PNG avatars are committed).
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import * as si from "simple-icons";
const ROOT = new URL("..", import.meta.url).pathname;
const L = JSON.parse(readFileSync(ROOT + "data/logos.json", "utf8"));
const icons = Object.values(si).filter(x => x && x.slug); mkdirSync(ROOT + "public/logos", { recursive: true }); let n = 0;
for (const [slug, v] of Object.entries(L)) { if (v.source !== "simple-icons") continue; const i = icons.find(x => x.slug === v.si); if (!i) { console.warn("missing icon", slug); continue; }
  const fill = slug === "filesystem" || ["fetch", "memory", "sequential-thinking", "time", "everything"].includes(slug) ? "111111" : i.hex;
  writeFileSync(`${ROOT}public/logos/${v.file}`, i.svg.replace("<svg ", `<svg fill="#${fill}" `)); n++; }
console.log(`gen-logos: wrote ${n} SVGs`);
