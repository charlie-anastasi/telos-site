// Crops (and optionally upscales) a region of a capture for close inspection.
//
//   node tools/crop.mjs tools/out/live/home-1440.png 1300 4180 140 60 4 out.png
import fs from "node:fs";
import { PNG } from "pngjs";

const [, , file, xs, ys, ws, hs, scaleArg = "1", out = "crop.png"] = process.argv;
const [x, y, w, h, scale] = [xs, ys, ws, hs, scaleArg].map(Number);
const src = PNG.sync.read(fs.readFileSync(file));
const cw = Math.min(w, src.width - x);
const ch = Math.min(h, src.height - y);
const dst = new PNG({ width: cw * scale, height: ch * scale });
for (let j = 0; j < ch * scale; j++) {
  for (let i = 0; i < cw * scale; i++) {
    const si = ((y + Math.floor(j / scale)) * src.width + (x + Math.floor(i / scale))) * 4;
    const di = (j * dst.width + i) * 4;
    src.data.copy(dst.data, di, si, si + 4);
  }
}
fs.writeFileSync(out, PNG.sync.write(dst));
