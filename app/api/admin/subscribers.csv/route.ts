import { list } from "@vercel/blob";
import { get } from "@vercel/blob";
import { authorized, deny } from "../../../../lib/admin";
export const dynamic = "force-dynamic";
async function readJson(pathname: string) {
  const r = await get(pathname, { access: "private" }); if (!r || !r.stream) return null;
  return JSON.parse(await new Response(r.stream).text());
}
const q = (s: unknown) => `"${String(s ?? "").replace(/"/g, '""')}"`;
export async function GET(req: Request) {
  if (!authorized(req)) return deny();
  const rows: string[] = ["email,subscribed_at,source"]; let cursor: string | undefined;
  do { const r = await list({ prefix: "subscribers/", cursor, limit: 1000 }); cursor = r.hasMore ? r.cursor : undefined;
    for (const b of r.blobs) { const j = await readJson(b.pathname).catch(() => null); if (j?.email) rows.push([q(j.email), q(j.at), q(j.source)].join(",")); } } while (cursor);
  return new Response(rows.join("\n") + "\n", { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=subscribers.csv", "cache-control": "no-store" } });
}
