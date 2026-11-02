# phishclean-mcp

[![npm](https://img.shields.io/npm/v/phishclean-mcp)](https://www.npmjs.com/package/phishclean-mcp) [![license](https://img.shields.io/npm/l/phishclean-mcp)](LICENSE)

MCP server for [PhishClean](https://www.phishclean.com) security analysis tools. Works with Claude Desktop, Claude Code, Gemini CLI, and any MCP-compatible client.

## Quick Start

```bash
npx phishclean-mcp
```

Or add it to Claude Code in one line:

```bash
claude mcp add phishclean -- npx -y phishclean-mcp
```

## Remote server (Claude connector)

No install needed: PhishClean also runs as a remote MCP server at

```
https://www.phishclean.com/mcp
```

In Claude (web, desktop or mobile): **Customize → Connectors → + → Add custom connector**, name it PhishClean, and paste that URL. No sign-in is needed. In Claude Code:

```bash
claude mcp add --transport http phishclean https://www.phishclean.com/mcp
```

The remote server has the same tools as this package except `check_password`, so nobody is invited to type a real password into a chat. Every tool is read-only and runs the same scanner as the matching `/api/v1` endpoint, in memory, without fetching anything. Limits: 1,000 tool calls an hour per IP without a key, or your plan's limit with `Authorization: Bearer pk_live_…`.

## Claude Desktop Setup

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "phishclean": {
      "command": "npx",
      "args": ["-y", "phishclean-mcp"]
    }
  }
}
```

Config file location:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Tools

| Tool | Description |
|------|-------------|
| `check_link` | Check a URL for phishing signals (domain spoofing, suspicious TLDs, token leaks) |
| `check_password` | Analyze password strength (entropy, crack time, common patterns) |
| `check_email` | Detect phishing in email body text (urgency, threats, credential requests) |
| `analyze_headers` | Check email headers for SPF/DKIM/DMARC and spoofing |
| `decode_jwt` | Decode JWT and flag security issues (expired, alg:none, sensitive data) |
| `scan_secrets` | Scan code for leaked API keys (AWS, Stripe, GitHub, Google, etc.) |
| `scan_page` | Full page scan — 12 phishing signals on HTML source |

## Examples

Once configured, ask Claude:

- "Check if this URL is safe: https://paypal-secure.xyz/login"
- "How strong is the password Summer2024!?"
- "Is this email phishing? Dear customer, verify your account..."
- "Scan this code for leaked secrets: const key = AKIA..."
- "Decode this JWT: eyJhbGci..."

## API Key (Optional)

Free tier: 30 requests/hour (no key needed).

For higher limits, get an API key at [phishclean.com/developers](https://www.phishclean.com/developers):

| Tier | Rate Limit | Price |
|------|-----------|-------|
| Free | 30 req/hr | $0 |
| Pro | 2,000 req/hr | $19/mo |
| Business | 25,000 req/hr | $49/mo |
| Enterprise | Unlimited | $700/yr |

Set your API key via environment variable:

```json
{
  "mcpServers": {
    "phishclean": {
      "command": "npx",
      "args": ["-y", "phishclean-mcp"],
      "env": {
        "PHISHCLEAN_API_KEY": "pk_live_your_key_here"
      }
    }
  }
}
```

Or via shell:
```bash
PHISHCLEAN_API_KEY=pk_live_your_key_here npx phishclean-mcp
```

## API

All tools call the PhishClean API at `https://www.phishclean.com/api/v1/`.

Override the base URL with:
```bash
PHISHCLEAN_API_URL=http://localhost:3000 npx phishclean-mcp
```

## Privacy policy

Both the npm package and the remote server at `https://www.phishclean.com/mcp` handle data the same way:

- **Collected:** only the arguments of each tool call (a URL, email text, headers, a token, source code or page HTML), plus your IP address or API key for rate limiting.
- **Use and storage:** arguments are analysed in memory and discarded when the response is sent. They are not stored or logged. Rate-limit counters (IP or key hash, hourly count) are deleted after a few hours.
- **Third parties:** nothing is shared or sold. The scanners make no outbound requests.
- **Retention:** none for tool arguments; a few hours for rate-limit counters.
- **Contact:** https://www.phishclean.com/contact. Full policy: https://www.phishclean.com/privacy

## What this server sends, and where

This is a thin stdio client: each tool call is one HTTPS POST to `https://www.phishclean.com/api/v1/<tool>` carrying only the argument you passed (the URL, password, email text, headers, token, or source). Nothing is stored or logged server-side beyond rate limiting; passwords are analysed and discarded. The whole server is [one file](index.js) — read it before trusting it.

The PhishClean browser extension is a separate, fully local product whose source is also public: [phishclean-extension](https://github.com/chidhu07/phishclean-extension).

## Links

- [PhishClean Website](https://www.phishclean.com)
- [Developer Portal & API Keys](https://www.phishclean.com/developers)
- [API Documentation](https://www.phishclean.com/api/v1)
- [Chrome Extension](https://chromewebstore.google.com/detail/phishclean/kloceclooedmphmnnpgoekolaggejgca)
- [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/phishclean/)
- [Edge Add-on](https://microsoftedge.microsoft.com/addons/detail/phishclean/jeilenifcaoenlglebpmmphbfmbfkgbj)
- [Extension source](https://github.com/chidhu07/phishclean-extension)

## License

MIT — see [LICENSE](LICENSE).
