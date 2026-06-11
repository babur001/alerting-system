import { ImageResponse } from "next/og";

// Shared 1200×630 card for opengraph-image / twitter-image. Telegram and most
// messengers read og:image; Twitter/X reads twitter:image — same artwork.
// ASCII apostrophe in "to'siq": the default ImageResponse font has no U+02BB.

export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;

export function renderShareImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0C0D10",
          color: "#E7E9EC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", height: 10, width: "100%", background: "#FF4632" }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 64,
            padding: "0 96px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 220,
              height: 220,
              borderRadius: 48,
              background: "linear-gradient(180deg, #FF4632 0%, #C41D10 100%)",
              boxShadow: "0 0 120px rgba(255, 70, 50, 0.35)",
            }}
          >
            <svg width="148" height="148" viewBox="0 0 64 64" fill="none">
              <path
                d="M16 44 V40 a16 16 0 0 1 32 0 V44"
                stroke="#fff"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="11" y="44" width="42" height="8" rx="4" stroke="#fff" strokeWidth={5} />
              <line x1="32" y1="16" x2="32" y2="8" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
              <line x1="50" y1="24" x2="56" y2="19" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
              <line x1="14" y1="24" x2="8" y2="19" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 110, fontWeight: 700, letterSpacing: 6 }}>
              OGOH
            </div>
            <div style={{ display: "flex", fontSize: 40, color: "#9AA1AB", marginTop: 8 }}>
              Suv to'siq ogohlantirish tizimi
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
              <div
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: "2px solid rgba(255, 70, 50, 0.6)",
                  color: "#FF4632",
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: 2,
                }}
              >
                SMS + OVOZLI XABAR
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: "2px solid rgba(244, 167, 36, 0.6)",
                  color: "#F4A724",
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: 2,
                }}
              >
                REAL VAQT
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 96px 44px",
            fontSize: 24,
            color: "#6B7280",
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex" }}>FAVQULODDA OGOHLANTIRISH TIZIMI</div>
          <div style={{ display: "flex" }}>OPERATOR PULTI</div>
        </div>
      </div>
    ),
    { width: SHARE_IMAGE_WIDTH, height: SHARE_IMAGE_HEIGHT }
  );
}
