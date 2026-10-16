import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { put, head } from "@vercel/blob";
export async function POST(req: Request) {
  let body: any; try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (body?.website) return NextResponse.json({ ok: true });
  const email = String(body?.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Signups are temporarily unavailable." }, { status: 503 });
  const key = `subscribers/${createHash("sha256").update(email).digest("hex")}.json`;
  try {
    try { await head(key); return NextResponse.json({ ok: true, already: true }); } catch {}
    await put(key, JSON.stringify({ email, at: new Date().toISOString(), source: req.headers.get("referer") || null }), { access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });
    return NextResponse.json({ ok: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Could not save, please try again." }, { status: 500 }); }
}
