#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const API_BASE = process.env.PHISHCLEAN_API_URL || "https://www.phishclean.com";
const API_KEY = process.env.PHISHCLEAN_API_KEY || "";

// Every tool only analyzes the input it is given and returns a report; the only side effect
// is a call to the PhishClean API, hence openWorldHint.
const ANNOTATIONS = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };

const TOOLS = [
  {
    name: "check_link",
    title: "Check link for phishing",
    description: "Check a URL for phishing signals including domain spoofing, suspicious TLDs, IP addresses, HTTPS downgrades, token leaks, and more. Returns risk level and detailed signals.",
    inputSchema: {
      type: "object",
      properties: { url: { type: "string", description: "The URL to analyze for phishing signals" } },
      required: ["url"]
    },
    endpoint: "/api/v1/check-link",
    mapInput: (args) => ({ url: args.url })
  },
  {
    name: "check_password",
    title: "Check password strength",
    description: "Analyze password strength. Checks length, character variety, common passwords, keyboard walks, dictionary words, date patterns, and calculates entropy and estimated crack time.",
    inputSchema: {
      type: "object",
      properties: { password: { type: "string", description: "The password to analyze (not stored or logged)" } },
      required: ["password"]
    },
    endpoint: "/api/v1/check-password",
    mapInput: (args) => ({ password: args.password })
  },
  {
    name: "check_email",
    title: "Check email for phishing",
    description: "Analyze email body text for phishing indicators: urgency language, threats, credential requests, suspicious links, generic greetings, and attachment references.",
    inputSchema: {
      type: "object",
      properties: { body: { type: "string", description: "The email body text to analyze" } },
      required: ["body"]
    },
    endpoint: "/api/v1/check-email",
    mapInput: (args) => ({ body: args.body })
  },
  {
    name: "analyze_headers",
    title: "Analyze email headers",
    description: "Analyze raw email headers to check SPF/DKIM/DMARC authentication, trace relay hops, and detect email spoofing indicators.",
    inputSchema: {
      type: "object",
      properties: { headers: { type: "string", description: "Raw email headers to analyze" } },
      required: ["headers"]
    },
    endpoint: "/api/v1/analyze-headers",
    mapInput: (args) => ({ headers: args.headers })
  },
  {
    name: "decode_jwt",
    title: "Decode and audit JWT",
    description: "Decode a JSON Web Token and check for security issues: expired tokens, algorithm 'none', weak algorithms, sensitive data in claims, very long expiration, missing standard claims.",
    inputSchema: {
      type: "object",
      properties: { token: { type: "string", description: "The JWT string to decode and analyze" } },
      required: ["token"]
    },
    endpoint: "/api/v1/decode-jwt",
    mapInput: (args) => ({ token: args.token })
  },
  {
    name: "scan_secrets",
    title: "Scan code for leaked secrets",
    description: "Scan source code for leaked secrets: AWS keys, Stripe keys, GitHub tokens, Google API keys, Slack tokens, Twilio keys, SendGrid keys, private keys, bearer tokens, and more.",
    inputSchema: {
      type: "object",
      properties: { source: { type: "string", description: "Source code text to scan for leaked secrets" } },
      required: ["source"]
    },
    endpoint: "/api/v1/scan-secrets",
    mapInput: (args) => ({ source: args.source })
  },
  {
    name: "scan_page",
    title: "Scan web page for phishing",
    description: "Full security page scan — analyzes a web page for 12 phishing/security signals including password fields, domain mismatches, hidden iframes, JWT in URL, hardcoded secrets, and more. Returns a risk score.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "The page URL" },
        html: { type: "string", description: "The page HTML source" }
      },
      required: ["url", "html"]
    },
    endpoint: "/api/v1/scan-page",
    mapInput: (args) => ({ url: args.url, html: args.html })
  }
];

const server = new Server(
  { name: "phishclean", version: "1.1.2" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(t => ({
    name: t.name,
    title: t.title,
    description: t.description,
    inputSchema: t.inputSchema,
    annotations: { title: t.title, ...ANNOTATIONS }
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = TOOLS.find(t => t.name === request.params.name);
  if (!tool) {
    return { content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }], isError: true };
  }

  try {
    const body = tool.mapInput(request.params.arguments || {});
    const headers = { "Content-Type": "application/json" };
    if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;

    const response = await fetch(`${API_BASE}${tool.endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!data.ok) {
      return { content: [{ type: "text", text: `Error: ${data.error}` }], isError: true };
    }

    return { content: [{ type: "text", text: JSON.stringify(data.data, null, 2) }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Request failed: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
