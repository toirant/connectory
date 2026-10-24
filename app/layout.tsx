import "./globals.css";
import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { SITE_NAME, SITE_URL, connectors, categories } from "../lib/data";
import { display, serif, sans, mono } from "./fonts";
import BrandMark from "../components/BrandMark";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  metadataBase: new URL("https://connectory-rose.vercel.app"),
  title: { default: `${SITE_NAME} — Directory of MCP servers & AI agent connectors`, template: `%s | ${SITE_NAME}` },
  description: "Searchable directory of Model Context Protocol (MCP) servers and AI agent connectors with setup instructions, key tools and example prompts. Weekly new-connectors newsletter.",
  openGraph: { siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image" },
  alternates: { types: { "application/rss+xml": [{ url: "/feed.xml", title: "Connectory — MCP servers & guides" }] } },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};
export const viewport: Viewport = { themeColor: "#f3efe6" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}><body>
    <a href="#main" className="skip">Skip to content</a>
    <header className="top"><div className="wrap top-row">
      <Link href="/" className="brand" aria-label="Connectory home"><BrandMark size={26} /><span className="brand-word">Connectory</span></Link>
      <span className="eyebrow top-meta tnum">Index of MCP servers — No. {String(connectors.length).padStart(3, "0")}</span>
      <nav className="nav" aria-label="Primary">
        <Link href="/#directory">Index</Link><Link href="/guides">Guides</Link><Link href="/config">Config Builder</Link><Link href="/submit">Submit</Link><Link href="/sponsor">Sponsor</Link>
        <Link href="/#newsletter" className="btn sm">Subscribe</Link>
      </nav>
    </div></header>
    <main id="main">{children}</main>
    <footer className="foot"><div className="wrap footgrid">
      <div><div className="foot-word">Connectory<span>.</span></div><p>An independent index of Model Context Protocol servers. Not affiliated with listed vendors; logos are trademarks of their owners. Data sourced from public docs and repositories — always verify setup against the official link.</p></div>
      <div><h4>Sections</h4>{Object.entries(categories).map(([k, v]) => <Link key={k} href={`/category/${k}`}><span className="tnum">{v.code}</span> {v.name}</Link>)}</div>
      <div><h4>Colophon</h4><Link href="/guides">Guides</Link><Link href="/config">Config Builder</Link><Link href="/submit">Submit a connector</Link><Link href="/sponsor">Sponsorship</Link><Link href="/status">Verification status</Link><Link href="/sitemap.xml">Sitemap</Link><a href="/feed.xml">RSS feed</a><span>Set in Instrument Serif, Source Serif &amp; IBM Plex.</span><span>© {new Date().getFullYear()} {SITE_NAME}</span></div>
    </div></footer>
    <Analytics />
  </body></html>);
}
