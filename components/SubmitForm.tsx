"use client";
import { useState } from "react";
export default function SubmitForm() {
  const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle"); const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("loading");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const r = await fetch("/api/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({})); if (r.ok) { setState("ok"); setMsg("Thanks! We'll review it soon."); e.currentTarget?.reset?.(); } else { setState("err"); setMsg(j.error || "Something went wrong."); }
  }
  return (<form className="form" onSubmit={submit}>
    <label>Connector name<input name="name" required maxLength={120} /></label>
    <label>Official / docs URL<input name="url" type="url" required maxLength={500} /></label>
    <label>Source repo URL (optional)<input name="repo" type="url" maxLength={500} /></label>
    <label>Category<select name="category">{["Dev Tools","Design","Payments","Productivity","Data & Search","Communication","Other"].map(c => <option key={c}>{c}</option>)}</select></label>
    <label>What does it do?<textarea name="description" rows={4} maxLength={2000} required /></label>
    <label>Your email (optional)<input name="email" type="email" maxLength={200} /></label>
    <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
    <button className="btn" disabled={state === "loading"}>{state === "loading" ? "Sending…" : "Submit connector"}</button>
    {msg && <p className={state === "ok" ? "ok" : "err"}>{msg}</p>}
  </form>);
}
