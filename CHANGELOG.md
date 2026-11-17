# Changelog

Release notes for `phishclean-mcp`. Versions follow semantic versioning and match the npm package and the `v*` tags in this repository.

## Unreleased: 1.2.0

- New tool `check_agent_config`: checks a repository's coding-agent settings (`.claude/settings.json` hooks, `ANTHROPIC_BASE_URL` redirects, permission bypass, `.mcp.json`, `devcontainer.json`, `.vscode/tasks.json`, `CLAUDE.md` / `AGENTS.md`) for backdoors before an agent acts on them. Nothing is run.
- `scan_secrets` detects more AI provider keys (Anthropic, OpenAI, OpenRouter, Groq, xAI, Hugging Face).

## 1.1.2 (2026-09-24)

- Every tool declares `readOnlyHint`, `idempotentHint` and `openWorldHint` annotations and a title, so clients can call them without a confirmation prompt.
- The MCP SDK requirement moves from `^1.0.0` to `^1.30.1`, so installs cannot resolve to early 1.x releases with known advisories.

## 1.1.1 (2026-09-21)

- Source published at github.com/chidhu07/phishclean-mcp (MIT).
- `package.json` gains `repository`, `homepage`, `bugs`, `author`, `engines` and `files`, so the npm page links back here and the package ships only four files.
- README: setup for Claude Code, Cursor and Windsurf, and what each tool call sends and where.
- `server.json` for the MCP Registry (`io.github.chidhu07/phishclean`).

## 1.1.0 (2026-03-09)

- Optional `PHISHCLEAN_API_KEY` environment variable: sent as a bearer token for the higher API rate limits.

## 1.0.0 (2026-03-08)

- First release: seven tools over the PhishClean API (`check_link`, `check_password`, `check_email`, `analyze_headers`, `decode_jwt`, `scan_secrets`, `scan_page`).

## Security fixes

None so far. Report problems as described in [SECURITY.md](SECURITY.md).
