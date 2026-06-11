import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Full-bleed red tile — iOS applies its own corner mask.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #FF4632 0%, #C41D10 100%)",
        }}
      >
        <svg width="128" height="128" viewBox="0 0 64 64" fill="none">
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
    ),
    { ...size }
  );
}
