// Rasterizes the OGOH siren glyph (components/ogoh/ui.tsx SirenGlyph) into
// app/favicon.ico (16/32/48 PNG-in-ICO) and public/icon-{192,512}.png for the
// web manifest. No image deps — SDF rasterizer + hand-rolled PNG/ICO writers.
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const RED = [0xff, 0x46, 0x32];
const WHITE = [0xff, 0xff, 0xff];

// ── glyph geometry, in the 64×64 viewBox of SirenGlyph ─────────
const SEGMENTS = [
  [16, 44, 16, 40],
  [48, 40, 48, 44],
  [32, 16, 32, 8],
  [50, 24, 56, 19],
  [14, 24, 8, 19],
];
const ARC = { cx: 32, cy: 40, r: 16 }; // upper semicircle
const BASE = { cx: 32, cy: 48, hw: 21, hh: 4, r: 4 }; // rect 11,44 42×8 rx4 (outline)

const sdSeg = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1, dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
};
const sdArc = (px, py) => {
  const vx = px - ARC.cx, vy = py - ARC.cy;
  if (vy <= 0) return Math.abs(Math.hypot(vx, vy) - ARC.r);
  return Math.min(Math.hypot(px - 16, py - 40), Math.hypot(px - 48, py - 40));
};
const sdBase = (px, py) => {
  const qx = Math.abs(px - BASE.cx) - (BASE.hw - BASE.r);
  const qy = Math.abs(py - BASE.cy) - (BASE.hh - BASE.r);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  return Math.abs(outside + Math.min(Math.max(qx, qy), 0) - BASE.r);
};
const glyphDist = (px, py) => {
  let d = Math.min(sdArc(px, py), sdBase(px, py));
  for (const [x1, y1, x2, y2] of SEGMENTS) d = Math.min(d, sdSeg(px, py, x1, y1, x2, y2));
  return d;
};

// ── render one square icon as RGBA ─────────────────────────────
function render(size) {
  // chunkier stroke + slightly tighter glyph at tiny sizes so it survives 16px
  const strokeW = size <= 16 ? 8 : size <= 32 ? 6 : 5;
  const scale = size <= 16 ? 0.85 : 0.8;
  const cornerR = 14; // canvas units (64-space), matches app/icon.svg
  const aa = 64 / size; // one device pixel in canvas units
  const buf = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const ux = ((x + 0.5) / size) * 64;
      const uy = ((y + 0.5) / size) * 64;

      // rounded-square background coverage
      const bqx = Math.abs(ux - 32) - (32 - cornerR);
      const bqy = Math.abs(uy - 32) - (32 - cornerR);
      const bgD = Math.hypot(Math.max(bqx, 0), Math.max(bqy, 0)) + Math.min(Math.max(bqx, bqy), 0) - cornerR;
      const bgCov = Math.max(0, Math.min(1, 0.5 - bgD / aa));

      // glyph coverage (glyph space → canvas via scale about center (32,30))
      const gx = (ux - 32) / scale + 32;
      const gy = (uy - 32) / scale + 30;
      const gD = (glyphDist(gx, gy) - strokeW / 2) * scale;
      const gCov = Math.max(0, Math.min(1, 0.5 - gD / aa));

      const i = (y * size + x) * 4;
      for (let c = 0; c < 3; c++) buf[i + c] = Math.round(RED[c] + (WHITE[c] - RED[c]) * gCov);
      buf[i + 3] = Math.round(bgCov * 255);
    }
  }
  return buf;
}

// ── minimal PNG encoder ─────────────────────────────────────────
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
function encodePng(rgba, size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── ICO container (PNG-embedded entries) ───────────────────────
function encodeIco(sizes) {
  const pngs = sizes.map((s) => encodePng(render(s), s));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = sizes.map((s, i) => {
    const e = Buffer.alloc(16);
    e[0] = s === 256 ? 0 : s;
    e[1] = s === 256 ? 0 : s;
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(pngs[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += pngs[i].length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs]);
}

writeFileSync(join(root, "app/favicon.ico"), encodeIco([16, 32, 48]));
for (const s of [192, 512]) writeFileSync(join(root, `public/icon-${s}.png`), encodePng(render(s), s));
writeFileSync("/tmp/ogoh-favicon-preview.png", encodePng(render(256), 256));
console.log("wrote app/favicon.ico (16/32/48), public/icon-192.png, public/icon-512.png");
