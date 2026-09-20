# Releasing phishclean-mcp

Three registries, in this order — each depends on the previous one.

## 1. Bump and mirror

```bash
# edit mcp-server/package.json: version, and keep mcpName = io.github.chidhu07/phishclean
# edit mcp-server/server.json: version (top-level AND packages[0].version)
bash scripts/sync-mcp-mirror.sh          # pushes to github.com/chidhu07/phishclean-mcp and tags vX.Y.Z
```

## 2. npm

The MCP Registry verifies ownership by reading `mcpName` from the **published** npm package, so npm goes first.

```bash
cd mcp-server
npm login                                 # once per machine
npm publish
```

## 3. MCP Registry (registry.modelcontextprotocol.io)

`mcp-publisher` is installed at `%LOCALAPPDATA%\Programs\mcp-publisher\mcp-publisher.exe`
(from https://github.com/modelcontextprotocol/registry/releases). Add that folder to PATH or use the full path.

```bash
cd mcp-server
mcp-publisher validate                    # checks server.json against the live schema
mcp-publisher login github                # device-code flow; the GitHub user must own chidhu07
mcp-publisher publish
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.chidhu07/phishclean"
```

The registry name is `io.github.chidhu07/phishclean` because we authenticate with GitHub. Switching to a
`com.phishclean/…` name would need DNS authentication (a TXT record on phishclean.com) — see the
registry's authentication guide. Not worth it unless the GitHub account changes hands.
