/* Long-form guides. Every factual claim comes from data/connectors.json (verified 2026-10-15)
   or from the client/protocol docs listed in each guide's `sources`, fetched 2026-10-15. */
export type Client = "cursor" | "claudecode" | "codex" | "vscode";
export type Block =
  | { t: "p"; x: string }
  | { t: "ul"; x: string[] }
  | { t: "ol"; x: string[] }
  | { t: "code"; label: string; x: string }
  | { t: "picks"; slugs: string[]; client?: Client; why?: Record<string, string> }
  | { t: "table"; head: string[]; rows: string[][] };
export type Guide = { slug: string; title: string; h1: string; description: string; dek: string; kind: "Guide" | "How-to" | "List" | "Checklist"; updated: string; sections: { h: string; b: Block[] }[]; faq: { q: string; a: string }[]; sources: { name: string; url: string }[]; related: string[] };
const D = "2026-10-15";
const S = {
  cursor: { name: "Cursor docs — Model Context Protocol", url: "https://cursor.com/docs/context/mcp" },
  cc: { name: "Claude Code docs — Connect Claude Code to tools via MCP", url: "https://docs.claude.com/en/docs/claude-code/mcp" },
  codex: { name: "OpenAI docs — Model Context Protocol (Codex)", url: "https://developers.openai.com/codex/mcp" },
  vscode: { name: "VS Code docs — Add and manage MCP servers", url: "https://code.visualstudio.com/docs/copilot/customization/mcp-servers" },
  transports: { name: "MCP specification — Transports (2025-06-18)", url: "https://modelcontextprotocol.io/specification/2025-06-18/basic/transports" },
  sec: { name: "MCP specification — Security Best Practices", url: "https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices" },
};
export const guides: Guide[] = [
{
  slug: "best-mcp-servers-for-cursor", kind: "List", updated: D,
  title: "Best MCP servers for Cursor (with copy-paste mcp.json)",
  h1: "MCP servers for Cursor",
  description: "A short, sourced list of MCP servers that work well in Cursor — GitHub, Context7, Playwright, Linear, Sentry, Supabase and more — with ready mcp.json entries.",
  dek: "Picks from our verified index for a Cursor coding workflow: code hosting, live docs, a browser, issues, errors and a database. Each entry includes the mcp.json snippet from the server's own docs.",
  sections: [
    { h: "Where Cursor reads MCP config", b: [
      { t: "p", x: "Cursor reads servers from `.cursor/mcp.json` in a project (project-specific tools) or `~/.cursor/mcp.json` in your home directory (tools available everywhere). Both use a top-level `mcpServers` object." },
      { t: "p", x: "Cursor supports three transports: `stdio` (a local command Cursor manages), SSE and Streamable HTTP (a URL). Remote servers can use OAuth; Cursor asks for approval before running MCP tools by default." },
      { t: "code", label: "~/.cursor/mcp.json — shape", x: '{\n  "mcpServers": {\n    "local-server": { "command": "npx", "args": ["-y", "mcp-server"], "env": { "API_KEY": "value" } },\n    "remote-server": { "url": "https://example.com/mcp" }\n  }\n}' },
    ] },
    { h: "How we picked", b: [
      { t: "ul", x: ["Official server from the vendor, or the reference implementation", "A documented JSON config we could verify, so the snippet below is real", "Useful inside a code editor: repo context, docs, a browser, issues, errors, data"] },
    ] },
    { h: "The picks", b: [
      { t: "picks", client: "cursor", slugs: ["github", "context7", "playwright", "chrome-devtools", "linear", "sentry", "supabase", "neon", "figma", "vercel"], why: {
        github: "Repos, issues and pull requests without leaving the editor.",
        context7: "Version-specific library docs so the agent stops guessing at APIs.",
        playwright: "Lets the agent open your app in a real browser and check its work.",
        "chrome-devtools": "Performance traces, network and console from a live Chrome.",
        linear: "Read the ticket, then update it when the change lands.",
        sentry: "Pull the actual error and trace into the fix.",
        supabase: "The documented URL supports project scoping and read-only mode.",
        neon: "Branches and SQL for Neon Postgres projects.",
        figma: "Design context (frames, variables, components) from Figma.",
        vercel: "Manage Vercel projects and deployments and search Vercel docs.",
      } },
      { t: "p", x: "Want several at once? Tick them in the [Config Builder](/config) and copy one combined `mcp.json`." },
    ] },
    { h: "Debugging", b: [
      { t: "p", x: "Cursor's docs point to the Output panel (Cmd+Shift+U) → \"MCP Logs\" for connection errors, auth problems and crashes. Servers can be toggled off without removing them." },
    ] },
  ],
  faq: [
    { q: "Where is Cursor's MCP config file?", a: "Project config lives in .cursor/mcp.json; global config lives in ~/.cursor/mcp.json. Both use a top-level mcpServers object." },
    { q: "Does Cursor support remote MCP servers?", a: "Yes. Cursor supports stdio, SSE and Streamable HTTP transports; remote servers are added with a url and can use OAuth." },
    { q: "How many MCP servers should I add?", a: "Only the ones you use. Every server adds tools the model has to choose between, and Cursor lets you toggle servers off without deleting them." },
  ],
  sources: [S.cursor], related: ["github-mcp-server-cursor", "best-mcp-servers-for-claude-code", "remote-vs-local-mcp-servers"],
},
{
  slug: "best-mcp-servers-for-claude-code", kind: "List", updated: D,
  title: "Best MCP servers for Claude Code (claude mcp add commands)",
  h1: "MCP servers for Claude Code",
  description: "MCP servers worth adding to Claude Code, each with the claude mcp add command — GitHub, Linear, Sentry, Playwright, Context7, Notion and more. Scopes and auth explained.",
  dek: "Claude Code adds servers from the terminal with `claude mcp add`. These are picks from our verified index, with the command for each.",
  sections: [
    { h: "The three commands you need", b: [
      { t: "code", label: "Remote (Streamable HTTP)", x: "claude mcp add --transport http <name> <url>" },
      { t: "code", label: "Local (stdio) — everything after -- runs the server", x: "claude mcp add <name> --env KEY=value -- npx -y some-mcp-server" },
      { t: "code", label: "Check status / authenticate", x: "claude mcp list\n# inside Claude Code:\n/mcp" },
      { t: "p", x: "Per Anthropic's docs, HTTP is the recommended transport for remote servers and SSE is deprecated. Use `/mcp` inside Claude Code to complete OAuth sign-in for remote servers." },
    ] },
    { h: "Scopes: local, project, user", b: [
      { t: "table", head: ["Scope", "Loads in", "Shared", "Stored in"], rows: [["local (default)", "Current project", "No", "~/.claude.json"], ["project", "Current project", "Yes, via git", ".mcp.json in project root"], ["user", "All your projects", "No", "~/.claude.json"]] },
      { t: "p", x: "Add `--scope project` to write a `.mcp.json` your team can commit. Claude Code asks for approval before using project-scoped servers from `.mcp.json` in interactive sessions." },
    ] },
    { h: "The picks", b: [
      { t: "picks", client: "claudecode", slugs: ["github", "linear", "sentry", "playwright", "context7", "notion", "atlassian", "vercel", "supabase", "resend"], why: {
        github: "Claude Code's own docs use GitHub as the code-review example.",
        linear: "Linear documents the exact claude mcp add command.",
        sentry: "The Claude Code docs use Sentry as the OAuth example: add it, then run /mcp.",
        playwright: "A real browser for checking UI changes.",
        context7: "Current library docs inside the session.",
        notion: "Specs and docs from Notion.",
        atlassian: "Jira and Confluence; inherits your existing Atlassian permissions.",
        vercel: "Manage projects and deployments; search Vercel docs.",
        supabase: "Database work; the documented URL can scope to one project and enable read-only mode.",
        resend: "Send transactional email from an agent workflow.",
      } },
      { t: "p", x: "Commands marked \"derived\" are built from the server's documented config using Claude Code's documented syntax; commands marked \"from docs\" are copied from the vendor." },
    ] },
  ],
  faq: [
    { q: "How do I add an MCP server to Claude Code?", a: "Run claude mcp add --transport http <name> <url> for a remote server, or claude mcp add <name> -- <command> for a local stdio server. Check with claude mcp list." },
    { q: "Where does Claude Code store MCP servers?", a: "Local and user scope are stored in ~/.claude.json; project scope is stored in .mcp.json at the project root." },
    { q: "How do I sign in to an OAuth MCP server in Claude Code?", a: "Run /mcp inside Claude Code and follow the browser login, or run claude mcp login <name> from your shell." },
  ],
  sources: [S.cc], related: ["best-mcp-servers-for-cursor", "best-mcp-servers-for-codex", "mcp-server-security-checklist"],
},
{
  slug: "best-mcp-servers-for-codex", kind: "List", updated: D,
  title: "Best MCP servers for OpenAI Codex (config.toml examples)",
  h1: "MCP servers for Codex",
  description: "How Codex configures MCP servers in ~/.codex/config.toml, plus picks from our verified index — Context7, Playwright, GitHub, Figma, Sentry, Chrome DevTools — with TOML for each.",
  dek: "Codex keeps MCP servers in `config.toml`, not JSON. The CLI, IDE extension and ChatGPT desktop app share that file.",
  sections: [
    { h: "Where Codex reads MCP config", b: [
      { t: "p", x: "By default `~/.codex/config.toml`; you can also scope servers to a trusted project with `.codex/config.toml`. Each server is a `[mcp_servers.<name>]` table. Codex supports stdio servers and Streamable HTTP servers (bearer token or OAuth)." },
      { t: "code", label: "From the CLI (example from OpenAI's docs)", x: "codex mcp add context7 -- npx -y @upstash/context7-mcp\ncodex mcp list\ncodex mcp login <server-name>   # for OAuth servers" },
      { t: "code", label: "~/.codex/config.toml — shape", x: '[mcp_servers.context7]\ncommand = "npx"\nargs = ["-y", "@upstash/context7-mcp"]\n\n[mcp_servers.figma]\nurl = "https://mcp.figma.com/mcp"' },
      { t: "p", x: "Useful options: `enabled_tools` / `disabled_tools` to limit what a server exposes, `default_tools_approval_mode` (`auto`, `prompt`, `writes`, `approve`), and `startup_timeout_sec` (default 10) / `tool_timeout_sec` (default 60)." },
    ] },
    { h: "The picks", b: [
      { t: "p", x: "OpenAI's Codex docs list Context7, Figma, Playwright, Chrome DevTools, Sentry and GitHub as common servers. All six are in our index; TOML below is derived from each server's documented config." },
      { t: "picks", client: "codex", slugs: ["context7", "playwright", "chrome-devtools", "github", "figma", "sentry", "linear", "neon"] },
    ] },
  ],
  faq: [
    { q: "Where is the Codex MCP config?", a: "~/.codex/config.toml by default, or .codex/config.toml in a trusted project. Each server is a [mcp_servers.<name>] table." },
    { q: "Does Codex support remote MCP servers?", a: "Yes, Streamable HTTP servers with a url, using a bearer token, OAuth (run codex mcp login <name>), or static headers." },
    { q: "Can I restrict which tools a server exposes to Codex?", a: "Yes. enabled_tools is an allow list and disabled_tools is a deny list applied after it; default_tools_approval_mode controls prompting." },
  ],
  sources: [S.codex], related: ["best-mcp-servers-for-claude-code", "remote-vs-local-mcp-servers"],
},
{
  slug: "github-mcp-server-cursor", kind: "How-to", updated: D,
  title: "How to set up the GitHub MCP server in Cursor (and VS Code, Claude Code)",
  h1: "Set up the GitHub MCP server in Cursor",
  description: "Step-by-step: add GitHub's official remote MCP server (api.githubcopilot.com/mcp/) to Cursor, VS Code or Claude Code, authenticate with OAuth or a PAT, and test it.",
  dek: "GitHub runs an official remote MCP server. You add one URL, sign in, and your agent can read repos and work with issues and pull requests.",
  sections: [
    { h: "1. Add the server", b: [
      { t: "p", x: "Open (or create) `~/.cursor/mcp.json` for all projects, or `.cursor/mcp.json` for one project, and add GitHub's remote endpoint:" },
      { t: "code", label: "~/.cursor/mcp.json", x: '{\n  "mcpServers": {\n    "github": {\n      "url": "https://api.githubcopilot.com/mcp/"\n    }\n  }\n}' },
    ] },
    { h: "2. Authenticate", b: [
      { t: "p", x: "GitHub documents two methods: OAuth on the remote server, or a Personal Access Token. With a PAT, send it as a header; Cursor supports `${env:NAME}` interpolation so the token stays out of the file:" },
      { t: "code", label: "Remote server with a PAT", x: '{\n  "mcpServers": {\n    "github": {\n      "url": "https://api.githubcopilot.com/mcp/",\n      "headers": { "Authorization": "Bearer ${env:GITHUB_PAT}" }\n    }\n  }\n}' },
      { t: "p", x: "Anthropic's Claude Code docs recommend a fine-grained token limited to the repositories you want the agent to work with. GitHub's README does not list required scopes, so grant the least you need and widen only when a tool fails." },
    ] },
    { h: "3. Test it", b: [
      { t: "ol", x: ["Open Cursor's MCP settings and check the server shows as connected.", "If it fails, open the Output panel (Cmd+Shift+U) and pick \"MCP Logs\".", "Ask: \"Summarize the open pull requests in my repo that are waiting on review.\""] },
    ] },
    { h: "Same server in other clients", b: [
      { t: "code", label: "VS Code — .vscode/mcp.json", x: '{\n  "servers": {\n    "github": { "type": "http", "url": "https://api.githubcopilot.com/mcp/" }\n  }\n}' },
      { t: "code", label: "Claude Code — from Anthropic's docs", x: 'claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \\\n  --header "Authorization: Bearer YOUR_GITHUB_PAT"' },
      { t: "code", label: "Claude Code — local via Docker (from GitHub's README)", x: "claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server" },
      { t: "picks", slugs: ["github"] },
    ] },
  ],
  faq: [
    { q: "What is the GitHub MCP server URL?", a: "https://api.githubcopilot.com/mcp/ — GitHub's hosted remote server." },
    { q: "Do I need a personal access token?", a: "No. The remote server supports OAuth or a Personal Access Token. A PAT is useful where OAuth is not available, such as with a static header." },
    { q: "Can I run the GitHub MCP server locally?", a: "Yes, GitHub publishes a Docker image (ghcr.io/github/github-mcp-server) that takes GITHUB_PERSONAL_ACCESS_TOKEN." },
  ],
  sources: [S.cursor, S.vscode, S.cc, { name: "github/github-mcp-server README", url: "https://github.com/github/github-mcp-server" }], related: ["best-mcp-servers-for-cursor", "mcp-server-security-checklist"],
},
{
  slug: "mcp-servers-for-databases", kind: "Guide", updated: D,
  title: "MCP servers for databases: Postgres, Supabase, Neon, MongoDB and more",
  h1: "MCP servers for databases",
  description: "Compare database MCP servers — Postgres, Supabase, Neon, DBHub, MongoDB, SQLite, Redis, ClickHouse — by transport, auth and read-only options, with setup snippets.",
  dek: "Connecting an agent to a database is the most useful and most dangerous MCP setup. Here is what each server needs, and which ones document a read-only mode.",
  sections: [
    { h: "At a glance", b: [
      { t: "table", head: ["Server", "Runs", "Auth", "Read-only option"], rows: [
        ["[[supabase]]", "Remote", "OAuth", "Yes — `read_only=true` URL parameter, scoped by `project_ref`"],
        ["[[neon]]", "Remote", "OAuth or Neon API key", "Not in our verified snippet — see README"],
        ["[[postgres]]", "Local (npx)", "Connection string", "Read-only by design (archived reference server)"],
        ["[[dbhub]]", "Local (npx, HTTP)", "Database DSN", "Use a read-only DB user (Claude Code docs example)"],
        ["[[mongodb]]", "Local (npx)", "Connection string or Atlas service account", "Yes — `--readOnly` flag"],
        ["[[sqlite]]", "Local", "None (local file)", "No — exposes write_query and create_table"],
        ["[[redis]]", "Local", "Redis URL / credentials", "See README"],
        ["[[clickhouse]]", "Local (uvx)", "ClickHouse user + password", "See README"],
      ] },
    ] },
    { h: "Postgres options", b: [
      { t: "p", x: "There are three Postgres paths in the index. [[supabase]] and [[neon]] are vendor-run remote servers that sign you in with OAuth. [[postgres]] is the original reference server — read-only and schema-aware, but archived, so it receives no updates. [[dbhub]] is a maintained community server that speaks Postgres, MySQL, SQL Server and SQLite through one DSN." },
      { t: "code", label: "Supabase — scoped and read-only (from Supabase docs)", x: '{\n  "mcpServers": {\n    "supabase": { "url": "https://mcp.supabase.com/mcp?project_ref=<project-ref>&read_only=true" }\n  }\n}' },
      { t: "code", label: "DBHub in Claude Code with a read-only user (from Anthropic's docs)", x: 'claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \\\n  --dsn "postgresql://readonly:pass@prod.db.com:5432/analytics"' },
    ] },
    { h: "Rules worth following", b: [
      { t: "ul", x: ["Connect with a database user that has only the privileges the task needs; read-only for analysis.", "Prefer a branch, replica or staging database over production.", "Keep credentials in environment variables, not in a committed config file.", "Leave tool approval on for anything that writes."] },
    ] },
    { h: "All database servers", b: [{ t: "picks", slugs: ["supabase", "neon", "postgres", "dbhub", "mongodb", "sqlite", "redis", "clickhouse", "elasticsearch", "qdrant", "pinecone"] }] },
  ],
  faq: [
    { q: "Is there an official Postgres MCP server?", a: "The Postgres reference server from the MCP project is archived. Supabase and Neon run official remote servers for their hosted Postgres, and DBHub is a maintained community option." },
    { q: "Which database MCP servers have a read-only mode?", a: "Supabase (read_only=true URL parameter) and MongoDB (--readOnly flag) document one; the archived Postgres reference server is read-only by design. For others, use a read-only database user." },
  ],
  sources: [S.cc, { name: "Supabase MCP docs", url: "https://supabase.com/docs/guides/getting-started/mcp" }, { name: "neondatabase/mcp-server-neon", url: "https://github.com/neondatabase/mcp-server-neon" }, { name: "bytebase/dbhub", url: "https://github.com/bytebase/dbhub" }, { name: "mongodb-js/mongodb-mcp-server", url: "https://github.com/mongodb-js/mongodb-mcp-server" }], related: ["mcp-server-security-checklist", "remote-vs-local-mcp-servers"],
},
{
  slug: "remote-vs-local-mcp-servers", kind: "Guide", updated: D,
  title: "Remote vs local MCP servers: stdio vs Streamable HTTP explained",
  h1: "Remote vs local MCP servers",
  description: "What the difference between stdio (local) and Streamable HTTP (remote) MCP servers means for setup, auth and security — and how each client configures them.",
  dek: "MCP defines two standard transports. Which one a server uses decides how you install it, how it signs in, and what it can touch on your machine.",
  sections: [
    { h: "The two transports", b: [
      { t: "table", head: ["", "Local — stdio", "Remote — Streamable HTTP"], rows: [
        ["How it runs", "The client launches the server as a subprocess and talks over stdin/stdout", "An independent server process at a URL (e.g. https://example.com/mcp), handling many clients"],
        ["Install", "A command: npx, uvx, docker, a binary", "A URL"],
        ["Auth", "Usually env vars / API keys you pass in", "OAuth sign-in or a bearer token header"],
        ["Reach", "Can access your files, local apps and network", "Only what the vendor's API allows for your account"],
      ] },
      { t: "p", x: "The older HTTP+SSE transport was replaced by Streamable HTTP in protocol version 2025-03-26; Anthropic's Claude Code docs call SSE deprecated. Some services still expose `/sse` endpoints." },
    ] },
    { h: "Same idea, different config per client", b: [
      { t: "code", label: "Cursor / Claude Desktop-style mcp.json", x: '{\n  "mcpServers": {\n    "local": { "command": "npx", "args": ["-y", "some-mcp-server"] },\n    "remote": { "url": "https://example.com/mcp" }\n  }\n}' },
      { t: "code", label: "VS Code — servers + type", x: '{\n  "servers": {\n    "remote": { "type": "http", "url": "https://example.com/mcp" }\n  }\n}' },
      { t: "code", label: "Claude Code", x: "claude mcp add --transport http remote https://example.com/mcp\nclaude mcp add local -- npx -y some-mcp-server" },
      { t: "code", label: "Codex — ~/.codex/config.toml", x: '[mcp_servers.remote]\nurl = "https://example.com/mcp"\n\n[mcp_servers.local]\ncommand = "npx"\nargs = ["-y", "some-mcp-server"]' },
      { t: "p", x: "Claude Code reads a JSON entry with a `url` but no `type` as a stdio server and skips it — add `\"type\": \"http\"` when copying configs into `.mcp.json`." },
    ] },
    { h: "Which should you pick?", b: [
      { t: "ul", x: ["Pick remote when the vendor runs an official server (GitHub, Linear, Sentry, Stripe, Notion, Supabase): no install, OAuth instead of long-lived keys.", "Pick local when the tool needs your machine: a filesystem, a local browser, a local database, git.", "Cursor's docs suggest running servers that handle sensitive data locally over stdio."] },
      { t: "p", x: "Remote servers in the index include [[github]], [[linear]], [[sentry]], [[stripe]], [[notion]], [[supabase]] and [[figma]]. Local-only examples include [[filesystem]], [[git]], [[playwright]] and [[sqlite]]." },
    ] },
  ],
  faq: [
    { q: "What is the difference between stdio and Streamable HTTP in MCP?", a: "With stdio the client launches the server as a local subprocess and exchanges messages over stdin/stdout. With Streamable HTTP the server is an independent process at a URL that handles HTTP POST and GET requests, optionally streaming with Server-Sent Events." },
    { q: "Is SSE deprecated in MCP?", a: "The HTTP+SSE transport from protocol version 2024-11-05 was replaced by Streamable HTTP, and Claude Code's docs describe SSE as deprecated. Streamable HTTP can still use SSE internally for streaming." },
  ],
  sources: [S.transports, S.cursor, S.cc, S.codex, S.vscode], related: ["mcp-server-security-checklist", "best-mcp-servers-for-cursor"],
},
{
  slug: "mcp-servers-for-figma-design", kind: "Guide", updated: D,
  title: "MCP servers for design: Figma's official server vs Framelink",
  h1: "MCP servers for design (Figma)",
  description: "Figma's official remote MCP server vs the community Framelink server: tools, auth, setup and which to use for design-to-code in Cursor, Claude Code or Codex.",
  dek: "Two servers bring Figma into coding agents. One is Figma's own remote server; the other is a popular community server that runs locally with a personal access token.",
  sections: [
    { h: "Side by side", b: [
      { t: "table", head: ["", "[[figma]]", "[[framelink-figma]]"], rows: [
        ["Maintainer", "Figma (official)", "Community (GLips/Figma-Context-MCP)"],
        ["Runs", "Remote — https://mcp.figma.com/mcp", "Local — npx figma-developer-mcp"],
        ["Auth", "Figma account sign-in (remote server)", "Figma personal access token"],
        ["Tools listed", "get_design_context, get_screenshot, get_metadata, get_variable_defs, Code Connect mapping tools", "Fetch Figma file/frame layout data; download images"],
      ] },
    ] },
    { h: "Setup", b: [
      { t: "code", label: "Figma official — mcp.json", x: '{\n  "mcpServers": {\n    "figma": { "url": "https://mcp.figma.com/mcp" }\n  }\n}' },
      { t: "code", label: "Framelink — mcp.json (from its README)", x: '{\n  "mcpServers": {\n    "Framelink MCP for Figma": {\n      "command": "npx",\n      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]\n    }\n  }\n}' },
      { t: "p", x: "Cursor's docs note Figma requires a whitelisted redirect URL for OAuth, which is why Cursor supports static OAuth client credentials for providers like Figma. In Codex, the docs show the Figma remote server configured with `url = \"https://mcp.figma.com/mcp\"`." },
    ] },
    { h: "Which one?", b: [
      { t: "ul", x: ["Use Figma's official server if you want variables, components and Code Connect mappings, and you can sign in with your Figma account.", "Use Framelink if you prefer a local process and a personal access token, and you mostly need layout data and images."] },
      { t: "picks", slugs: ["figma", "framelink-figma"] },
    ] },
  ],
  faq: [
    { q: "Does Figma have an official MCP server?", a: "Yes. Figma runs a remote MCP server at https://mcp.figma.com/mcp that provides design context such as frames, variables and components." },
    { q: "What is Framelink MCP for Figma?", a: "A community MCP server (figma-developer-mcp on npm) that gives coding agents simplified Figma layout data and image downloads using a Figma personal access token." },
  ],
  sources: [{ name: "Figma MCP server docs", url: "https://developers.figma.com/docs/figma-mcp-server/" }, { name: "GLips/Figma-Context-MCP", url: "https://github.com/GLips/Figma-Context-MCP" }, S.cursor, S.codex], related: ["best-mcp-servers-for-cursor"],
},
{
  slug: "mcp-servers-for-browser-automation", kind: "Guide", updated: D,
  title: "MCP servers for browser automation: Playwright, Chrome DevTools, Puppeteer, Browserbase",
  h1: "MCP servers for browser automation",
  description: "Compare browser MCP servers — Playwright MCP, Chrome DevTools MCP, Puppeteer and Browserbase — by what they do, where the browser runs and how to set them up.",
  dek: "Giving an agent a browser lets it check its own UI work, reproduce bugs and fill forms. Four servers in the index do this, with different trade-offs.",
  sections: [
    { h: "At a glance", b: [
      { t: "table", head: ["Server", "Browser runs", "Auth", "Good for"], rows: [
        ["[[playwright]]", "Local", "None", "Driving pages via accessibility snapshots: navigate, click, fill forms"],
        ["[[chrome-devtools]]", "Local Chrome", "None", "Debugging: performance traces, network, console, screenshots"],
        ["[[puppeteer]]", "Local", "None", "Scripted browsing and scraping (archived reference server)"],
        ["[[browserbase]]", "Cloud (remote server)", "Browserbase API key", "Headless browsers you don't run yourself"],
      ] },
    ] },
    { h: "Setup", b: [
      { t: "code", label: "Playwright — mcp.json", x: '{\n  "mcpServers": {\n    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] }\n  }\n}' },
      { t: "code", label: "Playwright — Claude Code (from its README)", x: "claude mcp add playwright npx @playwright/mcp@latest" },
      { t: "code", label: "Chrome DevTools — mcp.json", x: '{\n  "mcpServers": {\n    "chrome-devtools": { "command": "npx", "args": ["-y", "chrome-devtools-mcp@latest"] }\n  }\n}' },
      { t: "p", x: "VS Code's docs use Playwright as their MCP quickstart, and also point out VS Code has built-in browser tools that need no server." },
    ] },
    { h: "All browser servers", b: [{ t: "picks", slugs: ["playwright", "chrome-devtools", "puppeteer", "browserbase"] }] },
  ],
  faq: [
    { q: "Playwright MCP or Chrome DevTools MCP?", a: "Playwright MCP is built for driving pages (navigate, click, fill forms) using accessibility snapshots. Chrome DevTools MCP focuses on inspecting a live Chrome: performance traces, network requests and console messages. Many people run both." },
    { q: "Do browser MCP servers need an API key?", a: "Playwright, Chrome DevTools and Puppeteer run a local browser and need none. Browserbase runs browsers in the cloud and needs a Browserbase API key." },
  ],
  sources: [{ name: "microsoft/playwright-mcp", url: "https://github.com/microsoft/playwright-mcp" }, { name: "ChromeDevTools/chrome-devtools-mcp", url: "https://github.com/ChromeDevTools/chrome-devtools-mcp" }, S.vscode], related: ["best-mcp-servers-for-cursor"],
},
{
  slug: "vs-code-mcp-servers-setup", kind: "How-to", updated: D,
  title: "How to add MCP servers in VS Code (mcp.json, gallery, CLI)",
  h1: "Add MCP servers in VS Code",
  description: "Every way to add an MCP server in VS Code — the @mcp gallery, .vscode/mcp.json, workspace .mcp.json, the code --add-mcp CLI — plus trust, sandboxing and logs.",
  dek: "VS Code supports MCP servers in GitHub Copilot chat. Its config uses a `servers` object (not `mcpServers`) and an explicit `type`.",
  sections: [
    { h: "Config files", b: [
      { t: "table", head: ["Scope", "File", "Top-level key"], rows: [["Workspace (portable)", ".mcp.json at workspace root", "mcpServers"], ["Workspace (VS Code features)", ".vscode/mcp.json", "servers"], ["User", "~/.copilot/mcp-config.json (or $COPILOT_HOME)", "mcpServers"], ["User profile", "mcp.json via \"MCP: Open User Configuration\"", "servers"]] },
      { t: "code", label: ".vscode/mcp.json", x: '{\n  "servers": {\n    "github": { "type": "http", "url": "https://api.githubcopilot.com/mcp" },\n    "playwright": { "command": "npx", "args": ["-y", "@microsoft/mcp-server-playwright"] }\n  }\n}' },
    ] },
    { h: "Other ways to add a server", b: [
      { t: "ul", x: ["Extensions view → search `@mcp` → Install (user profile) or Install in Workspace.", "Command Palette → \"MCP: Add Server\" for a guided flow (stdio command or HTTP URL).", "CLI: `code --add-mcp \"{\\\"name\\\":\\\"my-server\\\",\\\"command\\\":\\\"uvx\\\",\\\"args\\\":[\\\"mcp-server-fetch\\\"]}\"`", "Auto-discovery of configs from Claude Desktop, Cursor and others via the `chat.mcp.discovery.enabled` setting."] },
    ] },
    { h: "Trust and sandboxing", b: [
      { t: "p", x: "Workspace MCP servers inherit Workspace Trust; other servers get a trust prompt when they first start or their config changes. On macOS and Linux you can set `\"sandboxEnabled\": true` on a stdio server to restrict its file system and network access." },
      { t: "p", x: "Build a `.vscode/mcp.json` from any of our servers in the [Config Builder](/config) — pick the VS Code tab." },
    ] },
  ],
  faq: [
    { q: "What is the VS Code MCP config file?", a: ".vscode/mcp.json in the workspace (top-level servers object), or a portable .mcp.json at the workspace root (top-level mcpServers object)." },
    { q: "Can VS Code sandbox MCP servers?", a: "Yes, on macOS and Linux. Set sandboxEnabled: true on a stdio server and add a sandbox object to grant specific file or network access. Not available on Windows." },
  ],
  sources: [S.vscode], related: ["github-mcp-server-cursor", "remote-vs-local-mcp-servers"],
},
{
  slug: "mcp-server-security-checklist", kind: "Checklist", updated: D,
  title: "MCP server security & permissions checklist",
  h1: "MCP security & permissions checklist",
  description: "A practical checklist before you connect an MCP server: verify the source, minimize scopes and tokens, prefer read-only, review local commands, keep approvals on. Sourced from the MCP spec and client docs.",
  dek: "An MCP server acts with your credentials. This checklist turns the MCP specification's security guidance and the major clients' docs into steps you can follow before you click Allow.",
  sections: [
    { h: "Before you install", b: [
      { t: "ol", x: [
        "Verify the source. Prefer the vendor's official server or a known repository; every Connectory entry links to its official page and source.",
        "Read the exact command for local servers. The MCP spec warns local servers can run arbitrary code with your privileges — watch for `sudo`, `rm -rf`, network calls or access to home directories and SSH keys.",
        "Check what it can reach. A local server can touch your files and network; a remote server can do whatever the vendor's API allows for your account.",
      ] },
    ] },
    { h: "Credentials and scopes", b: [
      { t: "ol", x: [
        "Use the narrowest token you can: a fine-grained GitHub token for specific repos, a read-only database user, a restricted API key.",
        "Request minimal OAuth scopes. The spec's scope-minimization guidance: start with low-risk read scopes and elevate only when needed. Claude Code lets you pin scopes with `oauth.scopes`; Cursor lets you set `scopes` in a static OAuth `auth` block.",
        "Keep secrets out of committed files. Use `${env:NAME}` in Cursor, `${VAR}` in Claude Code's `.mcp.json`, `bearer_token_env_var` in Codex, or input variables in VS Code.",
        "Check each Connectory spec sheet's Scopes / permissions cell — where the vendor documents scopes we list them; where they don't, we say \"Not documented\".",
      ] },
    ] },
    { h: "While it runs", b: [
      { t: "ol", x: [
        "Keep tool approval on for anything that writes. Cursor asks before MCP tool calls by default; Codex supports `default_tools_approval_mode = \"writes\"`.",
        "Limit tools. Codex has `enabled_tools` / `disabled_tools`; VS Code and Cursor let you toggle tools or servers off.",
        "Sandbox local servers where possible — VS Code's `sandboxEnabled` on macOS/Linux, or run the server in a container.",
        "Treat fetched content as untrusted. Claude Code's docs warn that servers fetching external content can expose you to prompt injection.",
        "Re-verify after upgrades. Server READMEs change; our [status page](/status) flags entries whose upstream setup docs changed.",
      ] },
    ] },
    { h: "If you build or host a server", b: [
      { t: "ul", x: ["Don't pass client tokens through to downstream APIs — the spec forbids accepting tokens not issued for your server.", "Use secure random session IDs and never use sessions for authentication.", "For local HTTP servers, bind to 127.0.0.1, validate the Origin header and require auth — or use stdio."] },
    ] },
  ],
  faq: [
    { q: "Are MCP servers safe?", a: "They are as safe as their code and the credentials you give them. Local servers run with your user's privileges, so verify the source, use least-privilege tokens, keep approvals on and sandbox where you can." },
    { q: "What permissions does an MCP server need?", a: "It depends on the server. Connectory lists the documented auth method and scopes for each server; many vendors don't document scopes, which we mark as Not documented." },
  ],
  sources: [S.sec, S.transports, S.cursor, S.cc, S.codex, S.vscode], related: ["remote-vs-local-mcp-servers", "mcp-servers-for-databases"],
},
];
export const guideOf = (s: string) => guides.find(g => g.slug === s);

/* Comparison pages: pairs where both entries exist in verified data. */
export const comparisons: { slug: string; a: string; b: string; note: string }[] = [
  { slug: "playwright-vs-chrome-devtools", a: "playwright", b: "chrome-devtools", note: "Both run a local browser. Playwright MCP drives pages through accessibility snapshots; Chrome DevTools MCP adds performance traces, network inspection and console access to a live Chrome." },
  { slug: "supabase-vs-neon", a: "supabase", b: "neon", note: "Both are vendor-run remote servers for hosted Postgres with OAuth sign-in. Supabase's documented URL supports project scoping and read-only mode; Neon documents read and write scopes and branch tools." },
  { slug: "figma-vs-framelink-figma", a: "figma", b: "framelink-figma", note: "Figma's official server is remote with account sign-in; Framelink is a community server run locally with a personal access token." },
  { slug: "postgres-vs-dbhub", a: "postgres", b: "dbhub", note: "The Postgres reference server is read-only but archived. DBHub is maintained and connects to Postgres, MySQL, SQL Server and SQLite through one DSN." },
  { slug: "playwright-vs-puppeteer", a: "playwright", b: "puppeteer", note: "Both automate a local browser. Playwright MCP is maintained by Microsoft; the Puppeteer server is an archived reference implementation." },
  { slug: "brave-search-vs-tavily", a: "brave-search", b: "tavily", note: "Both give agents web search behind an API key from the vendor." },
];
