import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
export async function save(prefix: string, record: Record<string, unknown>) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("storage not configured");
  const key = `${prefix}/${new Date().toISOString().slice(0, 10)}/${Date.now()}-${randomUUID()}.json`;
  await put(key, JSON.stringify({ ...record, at: new Date().toISOString() }), { access: "private", contentType: "application/json", addRandomSuffix: false });
}
