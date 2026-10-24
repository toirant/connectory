import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 }; export const contentType = "image/png";
export default function AppleIcon() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3efe6" }}>
    <svg width="132" height="132" viewBox="0 0 32 32"><rect x="0" y="10" width="4" height="4" fill="#16130e" /><rect x="0" y="18" width="4" height="4" fill="#16130e" /><rect x="4" y="6" width="12" height="20" fill="#16130e" /><rect x="16" y="6" width="12" height="20" fill="#ff4a1c" /><rect x="28" y="14" width="4" height="4" fill="#ff4a1c" /><path d="M9 16 L14 21 L23 12" fill="none" stroke="#f3efe6" strokeWidth="4" strokeLinecap="square" /></svg>
  </div>, size);
}
