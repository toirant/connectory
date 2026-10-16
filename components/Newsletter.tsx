"use client";
import { useState } from "react";
export default function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState(""); const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle"); const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setState("loading");
    try { const r = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, website: "" }) });
      const j = await r.json(); if (r.ok) { setState("ok"); setMsg("You’re in. The next digest lands this week."); setEmail(""); } else { setState("err"); setMsg(j.error || "Something went wrong."); }
    } catch { setState("err"); setMsg("Network error."); }
  }
  const form = <form onSubmit={submit} className="newsform">
    <input type="email" required placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} aria-label="Email address" />
    <button className="btn" disabled={state === "loading"}>{state === "loading" ? "Joining…" : "Subscribe"}</button>
  </form>;
  if (compact) return <div className="news-compact">{form}{msg && <p className={state === "ok" ? "ok" : "err"} role="status">{msg}</p>}</div>;
  return (<section id="newsletter" className="news">
    <div className="news-l"><p className="eyebrow">The Weekly Digest · Every Thursday</p><h2>New MCP servers, <em>weekly.</em></h2></div>
    <div className="news-r"><p>One short email: the newest servers, what changed in the ones you use, and one setup tip. No tracking pixels, no fluff.</p>{form}{msg && <p className={state === "ok" ? "ok" : "err"} role="status">{msg}</p>}</div>
  </section>);
}
