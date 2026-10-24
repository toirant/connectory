import { ImageResponse } from "next/og";
import { connectors, categories } from "../../../lib/data";
import { OG_SIZE, ogFonts, GRID, Mark } from "../../../lib/og";
export const size = OG_SIZE; export const contentType = "image/png"; export const alt = "Connectory connector setup";
export function generateStaticParams() { return connectors.map(c => ({ slug: c.slug })); }
export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const c = connectors.find(x => x.slug === slug);
  const name = c?.name || slug; const cat = c ? categories[c.category] : undefined;
  const fs = name.length > 22 ? 96 : name.length > 14 ? 124 : 150;
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f3efe6", backgroundImage: GRID, backgroundSize: "32px 32px", color: "#16130e", padding: "52px 68px", fontFamily: "IS" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #16130e", paddingBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Mark s={44} /><span style={{ fontSize: 40 }}>Connectory</span></div>
      <span style={{ fontFamily: "PM", fontSize: 20, letterSpacing: 3 }}>{cat ? `${cat.code} · ${cat.name.toUpperCase()}` : "MCP SERVER"}</span></div>
    <div style={{ display: "flex", fontFamily: "PM", fontSize: 22, letterSpacing: 3, marginTop: 70, color: "#c2300c" }}>{c?.official ? "OFFICIAL MCP SERVER" : "COMMUNITY MCP SERVER"}</div>
    <div style={{ display: "flex", fontSize: fs, lineHeight: 1, letterSpacing: -3, marginTop: 14 }}>{name}<span style={{ color: "#ff4a1c" }}>.</span></div>
    {c?.vendor ? <div style={{ display: "flex", fontSize: 46, fontStyle: "italic", color: "#3b362d", marginTop: 14 }}>by {c.vendor}</div> : null}
    <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #16130e", paddingTop: 22, fontFamily: "PM", fontSize: 20, letterSpacing: 2 }}>
      <span>VERIFIED SETUP · TOOLS · PROMPTS</span><span style={{ background: "#ff4a1c", color: "#fff", padding: "10px 14px" }}>{`/CONNECTORS/${slug.toUpperCase()}`}</span></div>
  </div>, { ...size, fonts: ogFonts() });
}
