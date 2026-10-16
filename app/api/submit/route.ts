import { NextResponse } from "next/server";
import { save } from "../../../lib/store";
export async function POST(req: Request) {
  let b: any; try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (b?.website) return NextResponse.json({ ok: true });
  const s = (k: string, n: number) => String(b?.[k] || "").slice(0, n).trim();
  const rec = { name: s("name", 120), url: s("url", 500), repo: s("repo", 500), category: s("category", 40), description: s("description", 2000), email: s("email", 200) };
  if (!rec.name || !/^https?:\/\//.test(rec.url) || !rec.description) return NextResponse.json({ error: "Name, URL and description are required." }, { status: 400 });
  try { await save("submissions", rec); return NextResponse.json({ ok: true }); } catch (e) { console.error(e); return NextResponse.json({ error: "Could not save, please try again." }, { status: 500 }); }
}
