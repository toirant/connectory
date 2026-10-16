import type { Metadata } from "next";
import { CONTACT, SITE_NAME } from "../../lib/data";
export const metadata: Metadata = { title: "Sponsor", description: `Sponsor ${SITE_NAME}: featured placement in the MCP connector directory and the weekly newsletter.`, alternates: { canonical: "/sponsor" } };
export default function Page() {
  return (<div className="wrap"><header className="pagehead"><p className="eyebrow">Advertising · Rate card</p><h1>Sponsor <em>{SITE_NAME}</em></h1>
    <p className="dek">{SITE_NAME} is read by developers and builders deciding which MCP servers and agent tools to plug in. Sponsorship keeps the index free and independent.</p></header>
    <div className="ratecard ratecard4">
      {([["A", "Newsletter slot", "$75", "per issue", "Top-of-email placement in the weekly new-connectors digest."], ["B", "Connector page slot", "$150", "per month", "Your message shown across all connector pages."], ["C", "Featured homepage listing", "$250", "per month", "The full-width sponsored band on the homepage. One sponsor at a time."], ["D", "Launch bundle", "$400", "per month", "All three placements. Founding rate, limited to the first few sponsors."]] as const).map(([k, t, pr, per, d]) =>
        <div key={k} className={"rate" + (k === "D" ? " rate-hot" : "")}><span className="rate-k">{k}</span>{k === "D" && <span className="rate-tag">Founding rate</span>}<strong>{t}</strong><p className="rate-price tnum">{pr}<span>{per}</span></p><p>{d}</p><a className="rate-cta" href={`mailto:${CONTACT}?subject=${encodeURIComponent(SITE_NAME + " sponsorship: " + t + " (" + pr + " " + per + ")")}`}>Email about this slot →</a></div>)}
    </div>
    <div className="artbody narrow"><h2>Terms</h2><ul><li>Newsletter slots are booked per issue; connector page, homepage and bundle slots are billed monthly.</li><li>One sponsor per slot at a time. The founding bundle rate is offered to the first few sponsors only.</li><li>Sponsored placements are always clearly labelled.</li><li>Listings are never pay-to-play — editorial data stays independent.</li></ul>
    <p><a className="btn" href={`mailto:${CONTACT}?subject=${encodeURIComponent(SITE_NAME + " sponsorship")}`}>Email us about sponsoring</a></p><p className="note tnum">{CONTACT}</p></div>
  </div>);
}
