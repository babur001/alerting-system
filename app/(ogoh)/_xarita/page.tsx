"use client";

// Xarita — schematic operational view of the selected object.
// Ported from the Claude Design rebuild (mapsettings.jsx).

import { useState } from "react";
import { useOgoh } from "@/components/ogoh/provider";
import { Dot, riskColor, StatusTag } from "@/components/ogoh/ui";
import { LEVELS, levelInfo, type DangerLevel } from "@/lib/ogoh/data";

// danger-level positions on the schematic (x%, y%):
// level 3 hugs the dam/river, level 1 sits furthest away
const LAYOUT: Record<DangerLevel, { x: number; y: number }> = {
  3: { x: 40, y: 40 },
  2: { x: 66, y: 58 },
  1: { x: 50, y: 82 },
};

export default function Page() {
  const { obj, people } = useOgoh();
  const [sel, setSel] = useState<DangerLevel | null>(null);
  const mine = people.filter((p) => p.objectId === obj.id);
  const selLevel = sel ? levelInfo(sel) : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-end justify-between px-4.5 pt-2.5 pb-2">
        <div>
          <div className="text-[26px] font-bold text-og-ink">Xarita</div>
          <div className="mt-px font-mono text-[11px] text-og-dim2">
            {obj.name.split(" ")[0]} · sxematik koʻrinish
          </div>
        </div>
        <StatusTag kind={obj.status === "warn" ? "warn" : "ok"}>
          {obj.status === "warn" ? "KUZATUVDA" : "BARQAROR"}
        </StatusTag>
      </div>

      {/* schematic */}
      <div className="og-hatch relative mx-3.5 my-2 flex-1 overflow-hidden rounded-2xl border border-og-line2 bg-og-bg2">
        {/* grid */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        {/* river */}
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="riv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1d6fa5" stopOpacity="0.55" />
              <stop offset="1" stopColor="#15171C" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M44 14 C 40 35, 26 48, 30 66 C 33 82, 50 88, 56 100 L 70 100 C 64 86, 52 80, 50 64 C 48 46, 60 34, 56 14 Z"
            fill="url(#riv)"
          />
          <path
            d="M50 14 C 46 36, 32 48, 36 68 C 39 84, 54 90, 60 100"
            fill="none"
            stroke="#3da0d8"
            strokeOpacity="0.5"
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />
        </svg>
        {/* dam */}
        <div className="absolute top-[7%] left-1/2 w-[52%] -translate-x-1/2">
          <div
            className="h-4 rounded-[3px] border border-og-line"
            style={{
              background: "repeating-linear-gradient(90deg, #22262E 0 7px, #15171C 7px 14px)",
            }}
          />
          <div className="mt-1 text-center font-mono text-[9px] tracking-[0.1em] text-og-dim2">
            TOʻGʻON · {obj.level}%
          </div>
        </div>
        {/* danger-level pins */}
        {LEVELS.map((z) => {
          const pos = LAYOUT[z.level];
          const cnt = mine.filter((p) => p.level === z.level).length;
          const act = mine.filter((p) => p.level === z.level && p.active).length;
          const c = riskColor(z.risk);
          const isSel = sel === z.level;
          const r = 18 + Math.min(cnt, 8) * 2;
          return (
            <button
              type="button"
              key={z.level}
              onClick={() => setSel(isSel ? null : z.level)}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-0"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: r * 2.4,
                  height: r * 2.4,
                  background: c,
                  opacity: isSel ? 0.16 : 0.08,
                }}
              />
              <span
                className="relative flex flex-col items-center justify-center rounded-full bg-og-panel"
                style={{
                  width: r * 2,
                  height: r * 2,
                  border: `2px solid ${c}`,
                  boxShadow: isSel ? `0 0 18px ${c}88` : "none",
                }}
              >
                <span className="font-mono text-[13px] leading-none font-bold text-og-ink">{act}</span>
                <span className="font-mono text-[7px] tracking-[0.03em] text-og-dim2">
                  {z.name.toUpperCase()}
                </span>
              </span>
            </button>
          );
        })}
        {/* selected level callout */}
        {selLevel && (
          <div className="absolute right-3 bottom-3 left-3 flex items-center gap-[11px] rounded-xl border border-og-line bg-og-panel p-[13px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <Dot color={riskColor(selLevel.risk)} size={9} />
            <div className="flex-1">
              <div className="text-[14.5px] font-semibold text-og-ink">
                {selLevel.name} · {selLevel.label}
              </div>
              <div className="font-mono text-[10.5px] text-og-dim2">{selLevel.desc}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-base font-bold text-og-ink">
                {mine.filter((p) => p.level === selLevel.level && p.active).length}
                <span className="text-[11px] text-og-dim2">
                  /{mine.filter((p) => p.level === selLevel.level).length}
                </span>
              </div>
              <div className="font-mono text-[8.5px] tracking-[0.05em] text-og-dim2">FAOL</div>
            </div>
          </div>
        )}
      </div>

      {/* legend */}
      <div className="flex gap-4 px-5 pt-1 pb-3.5 font-mono text-[10px] text-og-dim2">
        <span className="flex items-center gap-[5px]">
          <Dot color="#FF4632" size={7} /> 3 — Yuqori xavf
        </span>
        <span className="flex items-center gap-[5px]">
          <Dot color="#F4A724" size={7} /> 2 — Oʻrta
        </span>
        <span className="flex items-center gap-[5px]">
          <Dot color="#1FCB84" size={7} /> 1 — Xavfsiz
        </span>
      </div>
    </div>
  );
}
