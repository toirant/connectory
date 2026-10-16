import { list, del, get } from "@vercel/blob";
import { authorized, deny } from "../../../../lib/admin";
export const dynamic = "force-dynamic";
const ok = (p: string) => /^(subscribers|submissions)\//.test(p);
/** GET ?prefix=submissions/ → list with contents. DELETE {pathnames:[...]} → delete (subscribers/ and submissions/ only). */
export async function GET(req: Request) {
  if (!authorized(req)) return deny();
  const prefix = new URL(req.url).searchParams.get("prefix") || ""; if (!ok(prefix)) return Response.json({ error: "prefix must be subscribers/ or submissions/" }, { status: 400 });
  const r = await list({ prefix, limit: 1000 });
  const out = await Promise.all(r.blobs.map(async b => { const g = await get(b.pathname, { access: "private" }).catch(() => null); let data = null; try { data = g?.stream ? JSON.parse(await new Response(g.stream).text()) : null; } catch {} return { pathname: b.pathname, uploadedAt: b.uploadedAt, data }; }));
  return Response.json({ count: out.length, blobs: out }, { headers: { "cache-control": "no-store" } });
}
export async function DELETE(req: Request) {
  if (!authorized(req)) return deny();
  const b = await req.json().catch(() => null); const p: string[] = Array.isArray(b?.pathnames) ? b.pathnames.filter((x: unknown) => typeof x === "string" && ok(x)) : [];
  if (!p.length) return Response.json({ error: "no valid pathnames" }, { status: 400 });
  await del(p); return Response.json({ deleted: p });
}
