// Renders the OGOH share card (public/og.png, 1200×630) and the apple touch
// icon (public/apple-icon.png, 180×180) as static assets, using the same
// satori renderer Next.js uses for ImageResponse. Plain-object element trees
// instead of JSX so this runs under node directly:
//   node scripts/generate-share-images.mjs
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
});

const sirenSvg = (px) =>
  h(
    "svg",
    { width: px, height: px, viewBox: "0 0 64 64", fill: "none" },
    h("path", {
      d: "M16 44 V40 a16 16 0 0 1 32 0 V44",
      stroke: "#fff",
      strokeWidth: 5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
    h("rect", { x: 11, y: 44, width: 42, height: 8, rx: 4, stroke: "#fff", strokeWidth: 5 }),
    h("line", { x1: 32, y1: 16, x2: 32, y2: 8, stroke: "#fff", strokeWidth: 5, strokeLinecap: "round" }),
    h("line", { x1: 50, y1: 24, x2: 56, y2: 19, stroke: "#fff", strokeWidth: 5, strokeLinecap: "round" }),
    h("line", { x1: 14, y1: 24, x2: 8, y2: 19, stroke: "#fff", strokeWidth: 5, strokeLinecap: "round" })
  );

const badge = (text, color, borderColor) =>
  h(
    "div",
    {
      style: {
        display: "flex",
        padding: "10px 22px",
        borderRadius: 10,
        border: `2px solid ${borderColor}`,
        color,
        fontSize: 26,
        fontWeight: 600,
        letterSpacing: 2,
      },
    },
    text
  );

// ASCII apostrophe in "to'siq": the bundled satori font has no U+02BB.
const shareCard = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#0C0D10",
      color: "#E7E9EC",
      fontFamily: "sans-serif",
    },
  },
  h("div", { style: { display: "flex", height: 10, width: "100%", background: "#FF4632" } }),
  h(
    "div",
    { style: { flex: 1, display: "flex", alignItems: "center", gap: 64, padding: "0 96px" } },
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 220,
          height: 220,
          borderRadius: 48,
          background: "linear-gradient(180deg, #FF4632 0%, #C41D10 100%)",
          boxShadow: "0 0 120px rgba(255, 70, 50, 0.35)",
        },
      },
      sirenSvg(148)
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", flex: 1 } },
      h("div", { style: { display: "flex", fontSize: 110, fontWeight: 700, letterSpacing: 6 } }, "OGOH"),
      h(
        "div",
        { style: { display: "flex", fontSize: 40, color: "#9AA1AB", marginTop: 8 } },
        "Suv to'siq ogohlantirish tizimi"
      ),
      h(
        "div",
        { style: { display: "flex", gap: 16, marginTop: 40 } },
        badge("OMMAVIY SMS XABAR", "#FF4632", "rgba(255, 70, 50, 0.6)"),
        badge("REAL VAQT", "#F4A724", "rgba(244, 167, 36, 0.6)")
      )
    )
  ),
  h(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "0 96px 44px",
        fontSize: 24,
        color: "#6B7280",
        letterSpacing: 2,
      },
    },
    h("div", { style: { display: "flex" } }, "FAVQULODDA OGOHLANTIRISH TIZIMI"),
    h("div", { style: { display: "flex" } }, "OPERATOR PULTI")
  )
);

// Full-bleed red tile — iOS applies its own corner mask.
const appleIcon = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, #FF4632 0%, #C41D10 100%)",
    },
  },
  sirenSvg(128)
);

async function save(element, width, height, file) {
  const res = new ImageResponse(element, { width, height });
  writeFileSync(join(root, "public", file), Buffer.from(await res.arrayBuffer()));
  console.log(`wrote public/${file} (${width}x${height})`);
}

await save(shareCard, 1200, 630, "og.png");
await save(appleIcon, 180, 180, "apple-icon.png");
