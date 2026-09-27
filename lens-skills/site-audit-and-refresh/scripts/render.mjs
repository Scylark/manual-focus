// Screenshot one element of a page with headless Chrome over the DevTools
// protocol. No npm dependencies (Node 22+ for the global WebSocket).
//
// Usage: node render.mjs <url> <out.png> [width=1000] [height=780] [dpr=2] [selector=body]
// Env:   PRE=<js expression>   runs before capture (e.g. inject a CSS override)
//        SCROLL=<js expression> runs after load to scroll into position
//        CHROME=<path>          Chrome binary (defaults to the macOS install)
//        HOVER=1                moves the mouse over the element first, so :hover styles render
//        THEME=light|dark       sets <html data-theme> before capture (for sites with a theme toggle)
//
// The clip uses page coordinates, so scrolled elements are captured correctly.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, out, w = '1000', h = '780', dpr = '2', selector = 'body'] = process.argv.slice(2);
if (!url || !out) { console.error('usage: node render.mjs <url> <out.png> [w h dpr selector]'); process.exit(2); }
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const proc = spawn(chrome, [
  `--remote-debugging-port=${port}`, '--headless=new', '--no-first-run',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cdp-'))}`, 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  await sleep(200);
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
  } catch {}
}
if (!wsUrl) { proc.kill(); throw new Error('Chrome did not start'); }
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((r) => {
  const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params }));
});
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;

await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: +dpr, mobile: +w < 600 });
await send('Page.enable');
await send('Page.navigate', { url });
await sleep(3000);
if (process.env.SCROLL) { await evaluate(process.env.SCROLL); await sleep(2500); }
if (process.env.THEME) { await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(process.env.THEME)}`); await sleep(300); }
if (process.env.HOVER) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({ block: 'center' })`);
  await sleep(400);
  const c = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c[0], y: c[1] });
  await sleep(700);
}
if (process.env.PRE) { console.log('PRE ->', JSON.stringify(await evaluate(process.env.PRE))); await sleep(800); }
const box = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return null; const r = el.getBoundingClientRect(); return [r.left, r.top + scrollY, r.width, r.height]; })()`);
if (!box) { ws.close(); proc.kill(); throw new Error(`selector not found: ${selector}`); }
const [x, y, bw, bh] = box;
const shot = await send('Page.captureScreenshot', {
  format: 'png',
  clip: { x: Math.max(0, x - 20), y: Math.max(0, y - 20), width: Math.min(bw + 40, +w), height: Math.min(bh + 40, 4000), scale: 1 },
});
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
ws.close();
proc.kill();
console.log('saved', out);
