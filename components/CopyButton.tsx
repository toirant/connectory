"use client";
import { useState } from "react";
export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return <button type="button" className={done ? "copy done" : "copy"} aria-label={`${label} to clipboard`}
    onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1600); } catch {} }}>
    {done ? "Copied ✓" : label}</button>;
}
