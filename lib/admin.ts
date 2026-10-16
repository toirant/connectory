import { timingSafeEqual, createHash } from "crypto";
export function authorized(req: Request) {
  const want = process.env.ADMIN_TOKEN; if (!want || want.length < 24) return false;
  const h = req.headers.get("authorization") || ""; const got = h.startsWith("Bearer ") ? h.slice(7) : "";
  const a = createHash("sha256").update(got).digest(), b = createHash("sha256").update(want).digest();
  return got.length > 0 && timingSafeEqual(a, b);
}
export const deny = () => new Response("Unauthorized", { status: 401, headers: { "www-authenticate": "Bearer", "cache-control": "no-store" } });
