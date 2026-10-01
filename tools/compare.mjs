// Compares tools/out/live against tools/out/local (both written by
// capture.mjs): page height, section boxes, every text run's box and font,
// images and controls. Also writes a side-by-side PNG and a pixel diff.
//
//   node tools/compare.mjs            -> summary for every page and width
//   node tools/compare.mjs home 1440  -> full detail for one capture
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { PAGES } from "./pages.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "out");
const [, , onlyPage, onlyWidth] = process.argv;
const TOL = Number(process.env.TOL ?? 1.5);
const detail = Boolean(onlyPage);

const load = (dir, stem) => {
  const file = path.join(out, dir, `${stem}.json`);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
};
const key = (s) => s.replace(/\s+/g, " ").trim();
const px = (v) => (v === "normal" ? "normal" : Math.round(parseFloat(v) * 10) / 10);

// Pair entries with the same key in document order (the nth "Submit" with the nth "Submit").
function pair(live, local, keyOf) {
  const buckets = new Map();
  for (const item of local) {
    const k = keyOf(item);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(item);
  }
  const pairs = [], missing = [];
  for (const item of live) {
    const match = buckets.get(keyOf(item))?.shift();
    if (match) pairs.push([item, match]);
    else missing.push(item);
  }
  return { pairs, missing, extra: [...buckets.values()].flat() };
}

function boxDiff(a, b) {
  const d = [];
  for (const f of ["x", "y", "w", "h"]) if (Math.abs(a[f] - b[f]) > TOL) d.push(`${f} ${a[f]}→${b[f]} (${(b[f] - a[f]).toFixed(1)})`);
  return d;
}
function fontDiff(a, b) {
  const d = [];
  if (a.family !== b.family && !b.family.startsWith(a.family)) d.push(`family ${a.family}→${b.family}`);
  for (const f of ["size", "lineHeight", "letterSpacing"]) {
    const x = px(a[f]), y = px(b[f]);
    if (x !== y && !(typeof x === "number" && typeof y === "number" && Math.abs(x - y) <= 0.15)) d.push(`${f} ${a[f]}→${b[f]}`);
  }
  for (const f of ["weight", "style", "transform", "color"]) if (a[f] !== b[f]) d.push(`${f} ${a[f]}→${b[f]}`);
  return d;
}

function comparePage(name, width) {
  const stem = `${name}-${width}`;
  const live = load("live", stem), local = load("local", stem);
  if (!live || !local) return null;
  const issues = [];
  const add = (kind, label, diffs) => diffs.length && issues.push({ kind, label, diffs });

  if (Math.abs(live.viewport.docH - local.viewport.docH) > TOL) issues.push({ kind: "page", label: "height", diffs: [`${live.viewport.docH}→${local.viewport.docH}`] });

  // regions in order: header, sections, footer sections
  const lr = live.regions.filter((r) => r.tag !== "header"), cr = local.regions;
  lr.forEach((r, i) => {
    const c = cr[i];
    if (!c) return issues.push({ kind: "section", label: `#${i}`, diffs: ["missing locally"] });
    const d = boxDiff(r, c);
    if (r.bg !== c.bg) d.push(`bg ${r.bg}→${c.bg}`);
    add("section", `#${i} ${r.id ?? ""}`, d);
  });

  // text: leaf-most runs only (skip wrappers that repeat a child's text), ignore offscreen
  const hidden = new Set(["Open Menu", "Close Menu", "Skip to Content", "Email Address", "Folder:"]);
  const onscreen = (t) => t.x > -1000 && t.x < live.viewport.w && t.w > 0 && !hidden.has(t.text);
  const lt = live.text.filter(onscreen), ct = local.text.filter(onscreen);
  const t = pair(lt, ct, (x) => key(x.text));
  for (const [a, b] of t.pairs) {
    const d = [...boxDiff(a, b), ...fontDiff(a.font, b.font)];
    if (a.lines !== b.lines) d.unshift(`lines ${a.lines}→${b.lines}`);
    add("text", `"${a.text.slice(0, 44)}"`, d);
  }
  for (const a of t.missing) issues.push({ kind: "text", label: `<${a.tag}> "${a.text.slice(0, 60)}"`, diffs: [`missing locally (live at ${a.x},${a.y})`] });
  for (const b of t.extra) issues.push({ kind: "text", label: `<${b.tag}> "${b.text.slice(0, 60)}"`, diffs: [`extra locally (at ${b.x},${b.y})`] });

  // images by position order within the same normalized file name
  const norm = (f) => f.replace(/\+/g, " ").trim().toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+\./, ".");
  const im = pair(live.images, local.images, (x) => norm(x.file));
  for (const [a, b] of im.pairs) {
    // a contained image draws the same whether the element or its box is sized to it
    const d = b.fit === "contain" ? [] : boxDiff(a, b);
    if (a.fit !== b.fit) d.push(`fit ${a.fit}→${b.fit}`);
    add("image", norm(a.file), d);
  }
  for (const a of im.missing) issues.push({ kind: "image", label: norm(a.file), diffs: ["missing locally"] });
  for (const b of im.extra) issues.push({ kind: "image", label: norm(b.file), diffs: ["extra locally"] });

  // controls: links/buttons/inputs with visible boxes
  const ctl = (c) => c.x > -1000 && c.w > 1 && c.h > 1 && !(c.tag === "a" && !c.text && !c.href);
  const ck = (c) => `${c.tag === "button" ? "a" : c.tag}|${c.tag === "input" ? c.type : ""}|${key(c.text).replace(/ /g, "")}`;
  // any fully transparent color is the same color
  const color = (v) => (/rgba\([^)]*, 0\)$/.test(v) ? "transparent" : v);
  const cc = pair(live.controls.filter(ctl), local.controls.filter(ctl), ck);
  for (const [a, b] of cc.pairs) {
    const d = boxDiff(a, b);
    if (color(a.box.bg) !== color(b.box.bg)) d.push(`bg ${a.box.bg}→${b.box.bg}`);
    if ((a.box.radius ?? "0px") !== (b.box.radius ?? "0px")) d.push(`radius ${a.box.radius}→${b.box.radius}`);
    if ((a.box.border ?? "") !== (b.box.border ?? "")) d.push(`border ${a.box.border}→${b.box.border}`);
    if (a.text && a.font.color !== b.font.color) d.push(`color ${a.font.color}→${b.font.color}`);
    add("control", `<${a.tag}> "${a.text.slice(0, 40)}"`, d);
  }
  for (const a of cc.missing) issues.push({ kind: "control", label: `<${a.tag}${a.type ? " " + a.type : ""}> "${a.text.slice(0, 40)}" ${a.href ?? ""}`, diffs: [`missing locally (live at ${a.x},${a.y} ${a.w}x${a.h})`] });
  for (const b of cc.extra) issues.push({ kind: "control", label: `<${b.tag}${b.type ? " " + b.type : ""}> "${b.text.slice(0, 40)}" ${b.href ?? ""}`, diffs: [`extra locally (at ${b.x},${b.y} ${b.w}x${b.h})`] });

  return { stem, issues, counts: { text: t.pairs.length, images: im.pairs.length, controls: cc.pairs.length } };
}

function pixelDiff(stem) {
  const a = PNG.sync.read(fs.readFileSync(path.join(out, "live", `${stem}.png`)));
  const b = PNG.sync.read(fs.readFileSync(path.join(out, "local", `${stem}.png`)));
  const w = Math.min(a.width, b.width), h = Math.max(a.height, b.height);
  const pad = (img) => {
    const p = new PNG({ width: w, height: h, fill: true });
    p.data.fill(255);
    PNG.bitblt(img, p, 0, 0, w, Math.min(img.height, h), 0, 0);
    return p;
  };
  const pa = pad(a), pb = pad(b);
  const diff = new PNG({ width: w, height: h });
  const n = pixelmatch(pa.data, pb.data, diff.data, w, h, { threshold: 0.2, includeAA: false });
  const dir = path.join(out, "diff");
  fs.mkdirSync(dir, { recursive: true });
  const side = new PNG({ width: w * 3 + 40, height: h });
  side.data.fill(255);
  PNG.bitblt(pa, side, 0, 0, w, h, 0, 0);
  PNG.bitblt(pb, side, 0, 0, w, h, w + 20, 0);
  PNG.bitblt(diff, side, 0, 0, w, h, w * 2 + 40, 0);
  fs.writeFileSync(path.join(dir, `${stem}.png`), PNG.sync.write(side));
  return ((n / (w * h)) * 100).toFixed(2);
}

for (const p of PAGES) {
  if (onlyPage && p.name !== onlyPage) continue;
  for (const width of (process.env.WIDTHS ?? "1440,390").split(",").map(Number)) {
    if (onlyWidth && Number(onlyWidth) !== width) continue;
    const r = comparePage(p.name, width);
    if (!r) continue;
    const by = {};
    for (const i of r.issues) by[i.kind] = (by[i.kind] ?? 0) + 1;
    const pct = process.env.NOPIX ? "-" : pixelDiff(r.stem);
    console.log(`${r.stem.padEnd(22)} ${r.issues.length ? "✗" : "✓"} issues=${r.issues.length} ${JSON.stringify(by)} matched=${JSON.stringify(r.counts)} pixels=${pct}%`);
    if (detail) for (const i of r.issues) console.log(`   [${i.kind}] ${i.label}: ${i.diffs.join("; ")}`);
  }
}
