import { test, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.TEST_MODE = "1";
const { app } = await import("../src/server.js");

let server;
let base;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test("GET / serves the page", async () => {
  const res = await fetch(base + "/");
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /qr generator/);
});

test("GET /qr returns a png", async () => {
  const res = await fetch(base + "/qr?text=" + encodeURIComponent("https://ziadlammouri545-dev.github.io"));
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /image\/png/);
  const bytes = new Uint8Array(await res.arrayBuffer());
  assert.deepEqual([0x89, 0x50, 0x4e, 0x47], [...bytes.slice(0, 4)]);
});

test("GET /qr without text returns 400", async () => {
  const res = await fetch(base + "/qr");
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /required/);
});

test("GET /qr?format=svg returns an svg", async () => {
  const res = await fetch(base + "/qr?format=svg&text=" + encodeURIComponent("https://github.com"));
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /image\/svg\+xml/);
  const body = await res.text();
  assert.match(body, /^<svg/);
});