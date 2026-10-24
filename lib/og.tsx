import { readFileSync } from "fs";
import { join } from "path";
export const OG_SIZE = { width: 1200, height: 630 };
export function ogFonts() {
  const rd = (f: string) => { try { return readFileSync(join(process.cwd(), "assets/og", f)); } catch { return null; } };
  const out: any[] = []; const [a, b, c] = [rd("is.ttf"), rd("isi.ttf"), rd("pm.ttf")];
  if (a) out.push({ name: "IS", data: a, style: "normal" }); if (b) out.push({ name: "IS", data: b, style: "italic" }); if (c) out.push({ name: "PM", data: c, style: "normal" });
  return out;
}
export const GRID = "linear-gradient(rgba(22,19,14,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,19,14,.06) 1px, transparent 1px)";
export function Mark({ s }: { s: number }) {
  return <svg width={s} height={s} viewBox="0 0 32 32"><rect x="0" y="10" width="4" height="4" fill="#16130e" /><rect x="0" y="18" width="4" height="4" fill="#16130e" /><rect x="4" y="6" width="12" height="20" fill="#16130e" /><rect x="16" y="6" width="12" height="20" fill="#ff4a1c" /><rect x="28" y="14" width="4" height="4" fill="#ff4a1c" /><path d="M9 16 L14 21 L23 12" fill="none" stroke="#f3efe6" strokeWidth="4" strokeLinecap="square" /></svg>;
}
