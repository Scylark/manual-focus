// Diagrams for "What is marketing" (the article and the minibook). Each
// function returns a standalone SVG string. build.mjs writes them to
// public/images/what-is-marketing/ for the article and inlines them in the
// minibook, so the two always match.
//
// Drawn 820 wide with 22px+ text so they stay legible when the article
// shrinks them to phone width. Colours are the site's light-theme tokens
// (src/styles/global.css), on their own card so they also sit on the dark
// theme.

const C = {
  card: '#FBF7F0',
  cardLine: '#E7DECF',
  panel: '#FFFFFF',
  text: '#1A1612',
  sub: '#5F574A',
  muted: '#8A8172',
  orange: '#C45A2C',
  gold: '#D89B3F',
  teal: '#7CA89A',
  orangeTint: '#F6E3D9',
  goldTint: '#F7EBD6',
  tealTint: '#E2EEEA',
};
const F = {
  display: "'Arial Narrow','Archivo Narrow','Helvetica Neue Condensed',Arial,sans-serif",
  body: "Inter,'Helvetica Neue',Helvetica,Arial,sans-serif",
  mono: "'SF Mono',Menlo,'JetBrains Mono',monospace",
};
const W = 820;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Greedy word wrap by an average character width (em fraction per font).
function wrap(text, size, width, em = 0.53) {
  const max = Math.max(4, Math.floor(width / (size * em)));
  const lines = [];
  let line = '';
  for (const word of String(text).split(/\s+/)) {
    if (line && (line + ' ' + word).length > max) { lines.push(line); line = word; }
    else line = line ? line + ' ' + word : word;
  }
  if (line) lines.push(line);
  return lines;
}

function text(x, y, str, { size = 22, font = F.body, weight = 400, fill = C.text, anchor = 'start', spacing = 0, upper = false } = {}) {
  const s = upper ? String(str).toUpperCase() : str;
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${spacing ? ` letter-spacing="${spacing}"` : ''}>${esc(s)}</text>`;
}

// A wrapped block. Returns { svg, height }.
function para(x, y, str, width, opts = {}) {
  const size = opts.size ?? 22;
  const lh = opts.lh ?? Math.round(size * 1.3);
  const em = opts.em ?? (opts.font === F.display ? 0.62 : 0.53);
  const lines = wrap(opts.upper ? String(str).toUpperCase() : str, size, width, em);
  const svg = lines.map((l, i) => text(x, y + i * lh, l, { ...opts, upper: false })).join('');
  return { svg, height: lines.length * lh, lines: lines.length };
}

function frame(id, title, kicker, heading, body, h0) {
  const head = para(48, 112, heading, W - 96, { size: 44, font: F.display, weight: 700, lh: 48, upper: true });
  const extra = (head.lines - 1) * 48;
  const height = h0 + extra;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}" role="img" aria-labelledby="${id}-t"><title id="${id}-t">${esc(title)}</title>`
    + `<defs><marker id="${id}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${C.sub}"/></marker></defs>`
    + `<rect x="1" y="1" width="${W - 2}" height="${height - 2}" rx="22" fill="${C.card}" stroke="${C.cardLine}" stroke-width="2"/>`
    + text(48, 64, kicker, { size: 16, font: F.mono, fill: C.orange, spacing: 2.5, upper: true })
    + head.svg
    + `<g transform="translate(0 ${extra})">${body}</g></svg>`;
}

function chip(x, y, label, { fill = C.tealTint, color = '#3F6B5E', size = 17 } = {}) {
  const w = Math.round(label.length * size * 0.62 + 28);
  return {
    svg: `<rect x="${x}" y="${y}" width="${w}" height="${size + 18}" rx="${(size + 18) / 2}" fill="${fill}"/>`
      + text(x + w / 2, y + size + 3, label, { size, font: F.mono, fill: color, anchor: 'middle', spacing: 1, upper: true }),
    w,
  };
}

// 1. The common thread: six steps, each with its SOSTAC stage.
export function chain() {
  const steps = [
    ['Product-market fit', 'Is there a market that wants this?', 'Situation'],
    ['Market research', 'Who buys, why, and instead of what?', 'Situation'],
    ['Product requirements', 'What must the product do for them?', 'Objectives · Strategy'],
    ['Communication hierarchy', 'What do we say first?', 'Strategy'],
    ['Benefits ladder', 'Why will they care?', 'Tactics'],
    ['Plan and measure', 'Who does what, and is it working?', 'Action · Control'],
  ];
  const top = 170, rowH = 158;
  let body = `<line x1="88" y1="${top + 70}" x2="88" y2="${top + 70 + rowH * 5}" stroke="${C.cardLine}" stroke-width="4"/>`;
  steps.forEach(([name, q, stage], i) => {
    const y = top + i * rowH;
    body += `<rect x="40" y="${y}" width="${W - 80}" height="${rowH - 18}" rx="14" fill="${C.panel}" stroke="${C.cardLine}"/>`;
    body += `<circle cx="88" cy="${y + 70}" r="26" fill="${i === 5 ? C.teal : C.orange}"/>`;
    body += text(88, y + 79, String(i + 1), { size: 26, font: F.display, weight: 700, fill: '#fff', anchor: 'middle' });
    body += text(134, y + 46, name, { size: 30, font: F.display, weight: 700, upper: true });
    body += text(134, y + 80, q, { size: 21, fill: C.sub });
    body += `<g transform="translate(134 ${y + 96})">${chip(0, 0, stage).svg}</g>`;
  });
  body += text(48, top + rowH * 6 + 24, 'The chip under each step is the SOSTAC stage it feeds.', { size: 18, fill: C.muted });
  return frame('chain', 'The common thread of marketing in six steps, each mapped to its SOSTAC stage', 'The common thread', 'Six steps, one chain', body, top + rowH * 6 + 60);
}

// 2. Is there a market? Narrowing from the category to the market you can win.
export function market() {
  const bands = [
    ['Riders who buy helmets', 'The category exists. That alone proves nothing.', C.tealTint],
    ['Badly served by what they wear now', 'A need the current choices miss.', C.goldTint],
    ['Would switch at the price we need', 'Enough of them, at a margin that works.', C.orangeTint],
  ];
  const top = 170;
  let body = '';
  bands.forEach(([label, note, fill], i) => {
    const inset = i * 36;
    const y = top + i * 116;
    body += `<rect x="${40 + inset}" y="${y}" width="${W - 80 - inset * 2}" height="100" rx="14" fill="${fill}"/>`;
    body += text(W / 2, y + 44, label, { size: 25, font: F.display, weight: 700, anchor: 'middle', upper: true });
    body += text(W / 2, y + 78, note, { size: 20, fill: C.sub, anchor: 'middle' });
  });
  const y4 = top + 3 * 116;
  body += `<rect x="${40 + 3 * 36}" y="${y4}" width="${W - 80 - 6 * 36}" height="76" rx="14" fill="${C.orange}"/>`;
  body += text(W / 2, y4 + 49, 'The market you can win', { size: 26, font: F.display, weight: 700, fill: '#fff', anchor: 'middle', upper: true });
  const y5 = y4 + 120;
  body += text(48, y5, 'Instead of what?', { size: 16, font: F.mono, fill: C.orange, spacing: 2.5, upper: true });
  const alts = ['Their current helmet plus a clip-on light', 'Another brand’s helmet', 'Not riding after dark at all'];
  alts.forEach((a, i) => {
    body += `<circle cx="60" cy="${y5 + 34 + i * 36}" r="5" fill="${C.sub}"/>`;
    body += text(78, y5 + 41 + i * 36, a, { size: 21 });
  });
  return frame('market', 'Narrowing from everyone who buys helmets to the market a new helmet can win, and the alternatives it competes with', 'Step 1 · Product-market fit', 'Is there a market you can win?', body, y5 + 160);
}

// 3. Research to requirements to features, each traceable.
export function trace() {
  const rows = [
    ['Commuters want drivers to see them on dark evenings', 'Visible from behind on an unlit road', 'Integrated rear light'],
    ['Road riders overheat on long summer climbs', 'Stays cool on a long climb', 'Larger vents and internal channels'],
    ['Long-distance riders find helmets uncomfortable by the end', 'Comfortable on a five-hour ride', 'Adjustable fit system'],
  ];
  const cols = [['Finding', C.goldTint], ['Requirement', C.tealTint], ['Feature', C.orangeTint]];
  const colW = 218, gap = 40, x0 = 48, top = 172;
  let body = '';
  cols.forEach(([h], j) => {
    body += text(x0 + j * (colW + gap), top, h, { size: 16, font: F.mono, fill: C.orange, spacing: 2.5, upper: true });
  });
  let y = top + 22;
  rows.forEach((row) => {
    const blocks = row.map((t) => wrap(t, 20, colW - 28));
    const h = Math.max(...blocks.map((b) => b.length)) * 26 + 34;
    row.forEach((t, j) => {
      const x = x0 + j * (colW + gap);
      body += `<rect x="${x}" y="${y}" width="${colW}" height="${h}" rx="12" fill="${cols[j][1]}"/>`;
      body += blocks[j].map((l, k) => text(x + 14, y + 32 + k * 26, l, { size: 20 })).join('');
      if (j < 2) body += `<line x1="${x + colW + 4}" y1="${y + h / 2}" x2="${x + colW + gap - 6}" y2="${y + h / 2}" stroke="${C.sub}" stroke-width="2.5" marker-end="url(#trace-arrow)"/>`;
    });
    y += h + 20;
  });
  body += para(48, y + 26, 'Marketing writes the first two columns in the buyer’s words. Engineering chooses the third. A feature with no finding behind it is a feature looking for a reason.', W - 96, { size: 20, fill: C.sub }).svg;
  return frame('trace', 'Each research finding becomes a requirement in the buyer’s words, and each requirement becomes a feature', 'Steps 2 and 3 · Research to requirements', 'Every feature traces back', body, y + 120);
}

// 4. The communication hierarchy, and how far down each channel goes.
export function hierarchy() {
  const top = 168;
  let body = '';
  // Core message.
  body += `<rect x="100" y="${top}" width="${W - 200}" height="92" rx="14" fill="${C.orange}"/>`;
  body += text(W / 2, top + 30, 'Core message', { size: 15, font: F.mono, fill: '#FCE6DA', anchor: 'middle', spacing: 2.5, upper: true });
  body += text(W / 2, top + 70, 'The helmet for riding all year', { size: 28, font: F.display, weight: 700, fill: '#fff', anchor: 'middle', upper: true });
  // Supporting messages and proof.
  const sup = [['Seen on dark evenings', 'Integrated rear light'], ['Cool on long climbs', 'Larger vents and channels'], ['Comfortable all day', 'Adjustable fit system']];
  const bw = 232, gap = 16, x0 = (W - (bw * 3 + gap * 2)) / 2;
  const y2 = top + 128, y3 = y2 + 140;
  sup.forEach(([m, p], i) => {
    const x = x0 + i * (bw + gap);
    body += `<line x1="${W / 2}" y1="${top + 92}" x2="${x + bw / 2}" y2="${y2}" stroke="${C.cardLine}" stroke-width="3"/>`;
    body += `<rect x="${x}" y="${y2}" width="${bw}" height="104" rx="12" fill="${C.goldTint}"/>`;
    body += text(x + bw / 2, y2 + 28, 'Supporting', { size: 14, font: F.mono, fill: '#8A5A12', anchor: 'middle', spacing: 2, upper: true });
    body += wrap(m, 22, bw - 20, 0.62).map((l, k) => text(x + bw / 2, y2 + 58 + k * 26, l, { size: 22, font: F.display, weight: 700, anchor: 'middle', upper: true })).join('');
    body += `<line x1="${x + bw / 2}" y1="${y2 + 104}" x2="${x + bw / 2}" y2="${y3}" stroke="${C.cardLine}" stroke-width="3"/>`;
    body += `<rect x="${x}" y="${y3}" width="${bw}" height="84" rx="12" fill="${C.tealTint}"/>`;
    body += text(x + bw / 2, y3 + 26, 'Proof', { size: 14, font: F.mono, fill: '#3F6B5E', anchor: 'middle', spacing: 2, upper: true });
    body += wrap(p, 19, bw - 24).map((l, k) => text(x + bw / 2, y3 + 54 + k * 24, l, { size: 19, anchor: 'middle' })).join('');
  });
  // Channel depth.
  const y4 = y3 + 140;
  body += text(48, y4, 'How far down each channel goes', { size: 16, font: F.mono, fill: C.orange, spacing: 2.5, upper: true });
  const ch = [['Six-second video', 'Core message only', 0.25], ['Poster', 'Core message and one line', 0.45], ['Product page', 'The whole hierarchy', 1]];
  const barX = 290, barW = W - barX - 48;
  ch.forEach(([name, note, f], i) => {
    const y = y4 + 30 + i * 62;
    body += text(48, y + 31, name, { size: 22, weight: 600 });
    body += `<rect x="${barX}" y="${y + 6}" width="${barW}" height="38" rx="8" fill="${C.panel}" stroke="${C.cardLine}"/>`;
    body += `<rect x="${barX}" y="${y + 6}" width="${barW * f}" height="38" rx="8" fill="${f === 1 ? C.teal : f > 0.5 ? C.gold : C.orange}"/>`;
    body += f === 1 ? text(barX + 14, y + 32, note, { size: 18, weight: 600 }) : text(barX + barW * f + 12, y + 32, note, { size: 18, fill: C.sub, weight: 600 });
  });
  return frame('hierarchy', 'A communication hierarchy for the helmet, with one core message, three supporting messages and their proof, and how much of it each channel carries', 'Step 4 · Communication hierarchy', 'One message first, then the rest', body, y4 + 240);
}

// 5. The benefits ladder, climbed for one feature.
export function ladder() {
  const rungs = [
    ['Emotional resonance', 'You get home, and nobody at home has to worry', C.orange, '#fff'],
    ['Benefit', 'Drivers see you on dark evenings', C.gold, C.text],
    ['Feature', 'Integrated rear light', C.teal, C.text],
  ];
  const top = 168, railL = 210, railR = W - 90, rungH = 150;
  let body = '';
  body += `<rect x="${railL - 14}" y="${top - 10}" width="14" height="${rungH * 3 + 20}" rx="7" fill="${C.cardLine}"/>`;
  body += `<rect x="${railR}" y="${top - 10}" width="14" height="${rungH * 3 + 20}" rx="7" fill="${C.cardLine}"/>`;
  rungs.forEach(([label, line, fill, ink], i) => {
    const y = top + i * rungH;
    body += `<rect x="${railL}" y="${y}" width="${railR - railL}" height="${rungH - 28}" rx="12" fill="${fill}"/>`;
    body += text(railL + 22, y + 32, label, { size: 15, font: F.mono, fill: ink, spacing: 2.5, upper: true });
    body += wrap(line, 26, railR - railL - 44, 0.62).map((l, k) => text(railL + 22, y + 68 + k * 28, l, { size: 26, font: F.display, weight: 700, fill: ink, upper: true })).join('');
  });
  // Left-hand arrows: research climbs by asking why.
  body += `<line x1="120" y1="${top + rungH * 3 - 40}" x2="120" y2="${top + 20}" stroke="${C.sub}" stroke-width="3" marker-end="url(#ladder-arrow)"/>`;
  body += `<text transform="translate(96 ${top + rungH * 1.5}) rotate(-90)" font-family="${F.mono}" font-size="15" fill="${C.sub}" text-anchor="middle" letter-spacing="2">WHY DOES THAT MATTER?</text>`;
  const y2 = top + rungH * 3 + 30;
  body += para(48, y2, 'Research climbs the ladder by asking why that matters to you. Copy leads with the top rung, and the feature at the bottom proves it.', W - 96, { size: 21, fill: C.sub }).svg;
  return frame('ladder', 'The benefits ladder for the helmet’s integrated rear light, from feature to benefit to emotional resonance', 'Step 5 · Benefits ladder', 'Climb from feature to feeling', body, y2 + 100);
}

// 6. SOSTAC as a loop, filled in for the helmet launch.
export function sostac() {
  const stages = [
    ['S', 'Situation', 'Where are we now?', 'Product-market fit and the research findings'],
    ['O', 'Objectives', 'Where do we want to be?', 'Sales or new customers from the launch, by a date'],
    ['S', 'Strategy', 'How do we get there?', 'Year-round riders, the position, the hierarchy'],
    ['T', 'Tactics', 'The details of strategy', 'Price, stockists, benefit-led copy, channels'],
    ['A', 'Action', 'The details of tactics', 'Launch calendar, owners, budgets, briefs'],
    ['C', 'Control', 'How do we know we’re getting there?', 'Who is buying, message playback, sales and margin'],
  ];
  const top = 166, rowH = 112, x0 = 140;
  let body = '';
  stages.forEach(([letter, name, q, fill], i) => {
    const y = top + i * rowH;
    body += `<rect x="${x0}" y="${y}" width="${W - x0 - 40}" height="${rowH - 16}" rx="12" fill="${C.panel}" stroke="${C.cardLine}"/>`;
    body += `<rect x="${x0}" y="${y}" width="64" height="${rowH - 16}" rx="12" fill="${i === 0 || i === 5 ? C.teal : C.orange}"/>`;
    body += text(x0 + 32, y + 60, letter, { size: 36, font: F.display, weight: 700, fill: '#fff', anchor: 'middle' });
    body += text(x0 + 84, y + 36, name, { size: 26, font: F.display, weight: 700, upper: true });
    body += text(W - 60, y + 34, q, { size: 17, fill: C.muted, anchor: 'end' });
    body += text(x0 + 84, y + 72, fill, { size: 20 });
  });
  // The return path from Control back to Situation.
  const yTop = top + (rowH - 16) / 2, yBot = top + 5 * rowH + (rowH - 16) / 2;
  body += `<path d="M ${x0 - 6} ${yBot} C 56 ${yBot}, 56 ${yTop}, ${x0 - 10} ${yTop}" fill="none" stroke="${C.teal}" stroke-width="3.5" stroke-dasharray="8 7" marker-end="url(#sostac-arrow)"/>`;
  body += `<text transform="translate(62 ${(yTop + yBot) / 2}) rotate(-90)" font-family="${F.mono}" font-size="15" fill="#3F6B5E" text-anchor="middle" letter-spacing="2">CONTROL FEEDS THE NEXT SITUATION</text>`;
  return frame('sostac', 'SOSTAC filled in for the helmet launch, with Control feeding back into the next Situation analysis', 'Bringing it together · PR Smith’s SOSTAC', 'The plan is a loop', body, top + rowH * 6 + 30);
}

export const all = { chain, market, trace, hierarchy, ladder, sostac };
