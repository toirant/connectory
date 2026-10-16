import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
export const size = { width: 1200, height: 630 }; export const contentType = "image/png"; export const alt = "Connectory — the index of MCP servers";
const LOGOS = ["github", "figma", "stripe", "linear", "notion", "supabase", "sentry", "vercel", "postgres", "cloudflare"];
export default async function OG() {
  const rd = (f: string) => { try { return readFileSync(join(process.cwd(), "assets/og", f)); } catch { return null; } };
  const [pf, pfi, mono] = [rd("is.ttf"), rd("isi.ttf"), rd("pm.ttf")];
  const fonts: any[] = []; if (pf) fonts.push({ name: "IS", data: pf, style: "normal" }); if (pfi) fonts.push({ name: "IS", data: pfi, style: "italic" }); if (mono) fonts.push({ name: "PM", data: mono, style: "normal" });
  const logos = LOGOS.map(s => { try { return "data:image/svg+xml;base64," + readFileSync(join(process.cwd(), "public/logos", s + ".svg")).toString("base64"); } catch { return null; } }).filter(Boolean) as string[];
  const grid = "linear-gradient(rgba(22,19,14,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,19,14,.06) 1px, transparent 1px)";
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f3efe6", backgroundImage: grid, backgroundSize: "32px 32px", color: "#16130e", padding: "48px 64px", fontFamily: "IS" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 20, fontFamily: "PM", letterSpacing: 3, borderBottom: "2px solid #16130e", paddingBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ display: "flex", flexWrap: "wrap", width: 28, gap: 3 }}>{[0, 1, 2, 3].map(i => <div key={i} style={{ width: 12, height: 12, background: i === 1 ? "#ff4a1c" : "#16130e" }} />)}</div>THE INDEX OF MCP SERVERS</div><span>VOL. 1 · NO. 058</span></div>
    <div style={{ display: "flex", fontSize: 168, lineHeight: 1, marginTop: 40, letterSpacing: -5 }}>Connectory<span style={{ color: "#ff4a1c" }}>.</span></div>
    <div style={{ display: "flex", fontSize: 50, marginTop: 6, fontStyle: "italic", color: "#3b362d" }}>Everything your agent can plug into.</div>
    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 14, borderTop: "1px solid #16130e", paddingTop: 22 }}>
      {logos.map((l, i) => <div key={i} style={{ width: 64, height: 64, background: "#faf8f3", border: "1px solid #16130e", display: "flex", alignItems: "center", justifyContent: "center" }}><img src={l} width={32} height={32} /></div>)}
      <div style={{ marginLeft: "auto", display: "flex", fontFamily: "PM", fontSize: 20, background: "#ff4a1c", color: "#fff", padding: "12px 16px", letterSpacing: 2 }}>+48 MORE</div></div>
  </div>, { ...size, fonts });
}
