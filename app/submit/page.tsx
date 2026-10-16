import type { Metadata } from "next";
import SubmitForm from "../../components/SubmitForm";
export const metadata: Metadata = { title: "Submit a connector", description: "Built an MCP server or AI agent plugin? Submit it to the Connectory directory.", alternates: { canonical: "/submit" } };
export default function Page() {
  return (<div className="wrap"><header className="pagehead"><p className="eyebrow">Letters to the editor</p><h1>Submit a <em>connector</em></h1>
    <p className="dek">Built or found an MCP server we’re missing? Send it over. Every submission is checked against its public docs before listing — free, no payment required.</p></header>
    <SubmitForm /></div>);
}
