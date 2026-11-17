// Starts the server over stdio and checks that it lists every tool, each marked
// read-only. Makes no network requests: no tool is called.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const serverPath = fileURLToPath(new URL("../index.js", import.meta.url));

function rpc(child) {
  let buffer = "";
  const waiting = new Map();
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let i;
    while ((i = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, i).trim();
      buffer = buffer.slice(i + 1);
      if (!line) continue;
      const msg = JSON.parse(line);
      if (msg.id != null && waiting.has(msg.id)) {
        waiting.get(msg.id)(msg);
        waiting.delete(msg.id);
      }
    }
  });
  let nextId = 1;
  return {
    request(method, params = {}) {
      const id = nextId++;
      child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
      return new Promise((resolve) => waiting.set(id, resolve));
    },
    notify(method, params = {}) {
      child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
    },
  };
}

test("lists the PhishClean tools, all read-only", async (t) => {
  const child = spawn(process.execPath, [serverPath], { stdio: ["pipe", "pipe", "inherit"] });
  t.after(() => child.kill());
  const client = rpc(child);

  const init = await client.request("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "smoke-test", version: "0" },
  });
  assert.equal(init.result.serverInfo.name, "phishclean");
  client.notify("notifications/initialized");

  const list = await client.request("tools/list");
  const tools = list.result.tools;
  const names = tools.map((tool) => tool.name);
  for (const expected of ["check_link", "check_email", "analyze_headers", "decode_jwt", "scan_secrets", "scan_page"]) {
    assert.ok(names.includes(expected), `missing tool ${expected}`);
  }
  for (const tool of tools) {
    assert.equal(tool.annotations?.readOnlyHint, true, `${tool.name} should be read-only`);
    assert.equal(tool.inputSchema?.type, "object", `${tool.name} needs an object input schema`);
  }
});
