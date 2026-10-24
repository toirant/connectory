import { ImageResponse } from "next/og";
import raw from "../data/connectors.json";
import { OG_SIZE, ogFonts, GRID, Mark } from "../lib/og";
export const size = OG_SIZE; export const contentType = "image/png"; export const alt = "Connectory — Verified MCP server setups for AI coding agents";
export default async function OG() {
  const n = (raw as unknown[]).length;
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f3efe6", backgroundImage: GRID, backgroundSize: "32px 32px", color: "#16130e", padding: "52px 68px", fontFamily: "IS" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 20, fontFamily: "PM", letterSpacing: 3, borderBottom: "2px solid #16130e", paddingBottom: 16 }}>
      <span>THE INDEX OF MCP SERVERS</span><span>CONNECTORY-ROSE.VERCEL.APP</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 64 }}>
      <Mark s={150} />
      <div style={{ display: "flex", fontSize: 150, lineHeight: 1, letterSpacing: -4 }}>Connectory<span style={{ color: "#ff4a1c" }}>.</span></div></div>
    <div style={{ display: "flex", fontSize: 54, marginTop: 24, fontStyle: "italic", color: "#3b362d" }}>Verified MCP server setups for AI coding agents</div>
    <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: "1px solid #16130e", paddingTop: 22 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}><span style={{ fontSize: 96, lineHeight: 0.9, color: "#ff4a1c" }}>{n}</span><span style={{ fontFamily: "PM", fontSize: 22, letterSpacing: 3 }}>CONNECTORS, CONFIGS CHECKED</span></div>
      <div style={{ display: "flex", fontFamily: "PM", fontSize: 20, background: "#16130e", color: "#f3efe6", padding: "12px 16px", letterSpacing: 2 }}>CLAUDE · CURSOR · VS CODE</div></div>
  </div>, { ...size, fonts: ogFonts() });
}
