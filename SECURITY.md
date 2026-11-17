# Security policy

## Reporting a vulnerability

Please report security problems privately, not in a public issue:

- **GitHub:** use [Report a vulnerability](https://github.com/chidhu07/phishclean-mcp/security/advisories/new) on this repository's Security tab, or
- **Email:** support@phishclean.com with "Security" in the subject.

Include the package version, your MCP client, steps to reproduce and the impact. We aim to reply within 7 days, publish a fixed version to npm, and credit you in the release notes unless you would rather not be named.

## What counts

In scope: anything that makes the server send data somewhere other than the PhishClean API (`https://www.phishclean.com`, or the `PHISHCLEAN_API_URL` you set), leaks the `PHISHCLEAN_API_KEY`, or lets tool input run code on the machine.

Not in scope: wrong phishing verdicts (report those at https://www.phishclean.com/contact) and problems in the MCP SDK or the client application.

## Supported versions

Only the latest version on npm gets fixes.

The full disclosure policy is at https://www.phishclean.com/security.
