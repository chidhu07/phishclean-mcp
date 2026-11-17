# Contributing

Thanks for helping with `phishclean-mcp`. It is a small MCP server: each tool forwards its input to the PhishClean API (`https://www.phishclean.com/api/v1/...`) and returns the result.

## Reporting problems

- **Security problems:** follow [SECURITY.md](SECURITY.md). Please do not open a public issue.
- **Bugs:** open an issue with the package version, your MCP client (Claude Desktop, Claude Code, Cursor...), the tool you called, its input (remove any real secrets) and what you got back.
- **Wrong verdicts** (a safe link flagged, a phishing link missed): open an issue or use https://www.phishclean.com/contact. These are fixed in the API, so they need no release here.
- **Ideas for new tools:** open an issue describing what the tool should check.

## Pull requests

1. Fork, branch from `main`, make the change.
2. Run the tests: `npm install && node --test "test/*.test.mjs"`.
3. Open a pull request that says what changed and why.

Every pull request runs the tests and CodeQL in GitHub Actions. The maintainer reviews each one. Accepted changes are released to npm with an entry in [CHANGELOG.md](CHANGELOG.md), and your contribution is credited there.

## Tests

New or changed tools need a test. `test/smoke.test.mjs` starts the server over stdio and checks that every tool is listed, read-only and has an object input schema; extend it for new tools. Tests must not call the live API.

## Rules for tools

- Read-only: a tool may only send its input to the PhishClean API and return the answer. No file access, no shell commands, no other hosts.
- Mark every tool with `readOnlyHint: true`.
- Plain JavaScript (ES modules, strict mode), Node 18 or later, and no runtime dependencies beyond the MCP SDK.
