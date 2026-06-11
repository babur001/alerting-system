"use client";

// Button design gallery for the main console — alternative takes on the
// hold-to-send trigger, all sharing the same UX contract: press AND hold
// 1.5s to fire. Demo only: firing flashes "Yuborildi" and resets instead
// of navigating to /jonli.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Siren, Check } from "lucide-react";

const HOLD_MS = 1500;

// 3px tick / 4px gap — the segmented bars from the reference
const TICKS =
  "repeating-linear-gradient(90deg, currentColor 0 3px, transparent 3px 7px)";

type Phase = "idle" | "holding" | "fired";

/* Shared hold engine: drives paint(p) at 60fps while held, springs back on
   release, and auto-resets ~1.2s after firing. paint must only touch refs. */
function useHold(paint: (p: number) => void) {
  const [phase, setPhase] = useState<Phase>("idle");
  const pRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const holdingRef = useRef(false);
  const startRef = useRef(0);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function set(p: number) {
    pRef.current = p;
    paint(p);
  }

  // animate p back to 0 (used on release and after the fired flash)
  function springBack() {
    const from = pRef.current;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min((now - t0) / 240, 1);
      set(from * (1 - k));
      if (k < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }

  function fire() {
    holdingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase("fired");
    set(1);
    resetRef.current = setTimeout(() => {
      setPhase("idle");
      springBack();
    }, 1200);
  }

  function tick(now: number) {
    if (!holdingRef.current) return;
    const p = Math.min((now - startRef.current) / HOLD_MS, 1);
    set(p);
    if (p >= 1) {
      fire();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function start(e: React.PointerEvent<HTMLButtonElement>) {
    if (phase === "fired" || holdingRef.current) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    holdingRef.current = true;
    setPhase("holding");
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }

  function cancel() {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    springBack();
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resetRef.current) clearTimeout(resetRef.current);
    };
  }, []);

  return {
    phase,
    props: {
      onPointerDown: start,
      onPointerUp: cancel,
      onPointerCancel: cancel,
      onLostPointerCapture: cancel,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    },
  };
}

/* ── 01 · KLAVISH — square mechanical keycap with an LED progress strip ── */
function KeycapButton() {
  const ledRef = useRef<HTMLSpanElement>(null);
  const { phase, props } = useHold((p) => {
    if (ledRef.current) ledRef.current.style.width = `${p * 100}%`;
  });
  const fired = phase === "fired";

  return (
    <button
      type="button"
      aria-label="Ogohlantirishni yuborish uchun bosib turing"
      {...props}
      style={{ background: "var(--dome)" }}
      className="flex h-[148px] w-[148px] touch-none select-none flex-col items-center justify-center gap-3 rounded-[30px] text-white shadow-[inset_0_5px_10px_rgba(255,255,255,0.30),inset_0_-11px_18px_rgba(138,30,12,0.55),0_8px_0_0_#9a2710,0_17px_24px_-6px_rgba(176,44,20,0.50)] duration-200 ease-out active:translate-y-[5px] active:shadow-[inset_0_4px_8px_rgba(255,255,255,0.22),inset_0_-7px_12px_rgba(138,30,12,0.55),0_3px_0_0_#9a2710,0_8px_12px_-6px_rgba(176,44,20,0.42)] active:duration-150"
    >
      {fired ? (
        <Check size={44} strokeWidth={2.2} className="drop-shadow" />
      ) : (
        <Siren size={44} strokeWidth={1.9} className="drop-shadow" />
      )}
      <span className="text-[12px] font-semibold text-white/85">
        {fired ? "Yuborildi" : "Bosib turing"}
      </span>
      {/* LED progress strip on the cap face */}
      <span className="relative h-[6px] w-20 overflow-hidden">
        <span
          className="absolute inset-0 text-white/25"
          style={{ backgroundImage: TICKS }}
        />
        <span
          ref={ledRef}
          className="absolute inset-y-0 left-0 w-0 text-white"
          style={{ backgroundImage: TICKS }}
        />
      </span>
    </button>
  );
}

/* ── 02 · SHTRIX PANEL — full-width pad; ticks sweep across like a barcode ── */
function TickPadButton() {
  const fillRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const { phase, props } = useHold((p) => {
    if (fillRef.current) fillRef.current.style.width = `${p * 100}%`;
    if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
  });
  const fired = phase === "fired";
  const holding = phase === "holding";

  return (
    <button
      type="button"
      aria-label="Ogohlantirishni yuborish uchun bosib turing"
      {...props}
      className={`relative h-[112px] w-full touch-none select-none overflow-hidden rounded-[18px] border transition-colors duration-200 active:scale-[0.99] ${
        holding || fired ? "border-brand/70 bg-bg/60" : "border-border bg-bg/40"
      }`}
    >
      {/* sweeping full-height ticks */}
      <span
        ref={fillRef}
        className={`absolute inset-y-0 left-0 w-0 ${
          fired ? "text-ok/40" : "text-brand/45"
        }`}
        style={{ backgroundImage: TICKS }}
      />
      <span className="relative z-10 flex h-full items-center justify-between px-5">
        <span className="flex flex-col items-start gap-1.5">
          <span className="flex items-center gap-2 text-[15px] font-semibold text-tx">
            <Siren size={18} className={fired ? "text-ok" : "text-brand"} />
            {fired ? "Yuborildi" : "Bosib turing"}
          </span>
          <span className="font-mono text-[10px] tracking-[0.14em] text-faint">
            USHLAB TURISH: 1,5 SONIYA
          </span>
        </span>
        <span
          ref={pctRef}
          className="font-mono text-[24px] font-bold tabular-nums text-tx"
        >
          0%
        </span>
      </span>
    </button>
  );
}

/* ── 03 · SHKALA — flat instrument dial; tick ring lights up around it ── */
const DIAL_R = 46;
const DIAL_CIRC = 2 * Math.PI * DIAL_R;

function DialButton() {
  const maskRef = useRef<SVGCircleElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const { phase, props } = useHold((p) => {
    if (maskRef.current)
      maskRef.current.style.strokeDashoffset = String(DIAL_CIRC * (1 - p));
    if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
  });
  const fired = phase === "fired";

  return (
    <div className="relative flex h-[210px] w-[210px] items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
        <defs>
          {/* growing arc that reveals the lit ticks */}
          <mask id="dial-arc">
            <circle
              ref={maskRef}
              cx="50"
              cy="50"
              r={DIAL_R}
              fill="none"
              stroke="white"
              strokeWidth="9"
              strokeDasharray={DIAL_CIRC}
              strokeDashoffset={DIAL_CIRC}
            />
          </mask>
        </defs>
        {/* tick ring: dash pattern = radial tick marks */}
        <circle
          cx="50"
          cy="50"
          r={DIAL_R}
          fill="none"
          stroke="var(--track)"
          strokeWidth="6"
          strokeDasharray="1.2 2.5"
        />
        <circle
          cx="50"
          cy="50"
          r={DIAL_R}
          fill="none"
          stroke={fired ? "var(--ok)" : "var(--brand)"}
          strokeWidth="6"
          strokeDasharray="1.2 2.5"
          mask="url(#dial-arc)"
        />
      </svg>

      <button
        type="button"
        aria-label="Ogohlantirishni yuborish uchun bosib turing"
        {...props}
        className={`z-10 flex h-[150px] w-[150px] touch-none select-none flex-col items-center justify-center gap-2 rounded-full border bg-surface-2 transition-all duration-200 active:scale-95 ${
          fired ? "border-ok/60" : "border-border"
        }`}
      >
        {fired ? (
          <Check size={40} strokeWidth={2.2} className="text-ok" />
        ) : (
          <Siren size={40} strokeWidth={1.9} className="text-brand" />
        )}
        <span
          ref={pctRef}
          className="font-mono text-[15px] font-bold tabular-nums text-tx"
        >
          0%
        </span>
        <span className="font-mono text-[9px] tracking-[0.16em] text-faint">
          {fired ? "YUBORILDI" : "BOSIB TURING"}
        </span>
      </button>
    </div>
  );
}

/* ── 03B · SHKALA 3D — same tick-ring dial, but the center is the 3D
   hardware press button: it sinks into the bezel while the scale lights ── */
function Dial3DButton() {
  const maskRef = useRef<SVGCircleElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const { phase, props } = useHold((p) => {
    if (maskRef.current)
      maskRef.current.style.strokeDashoffset = String(DIAL_CIRC * (1 - p));
    if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
  });
  const fired = phase === "fired";

  return (
    <div className="relative flex h-[216px] w-[216px] items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
        <defs>
          {/* growing arc that reveals the lit ticks */}
          <mask id="dial-arc-3d">
            <circle
              ref={maskRef}
              cx="50"
              cy="50"
              r={DIAL_R}
              fill="none"
              stroke="white"
              strokeWidth="9"
              strokeDasharray={DIAL_CIRC}
              strokeDashoffset={DIAL_CIRC}
            />
          </mask>
        </defs>
        {/* tick ring: dash pattern = radial tick marks */}
        <circle
          cx="50"
          cy="50"
          r={DIAL_R}
          fill="none"
          stroke="var(--track)"
          strokeWidth="6"
          strokeDasharray="1.2 2.5"
        />
        <circle
          cx="50"
          cy="50"
          r={DIAL_R}
          fill="none"
          stroke={fired ? "var(--ok)" : "var(--brand)"}
          strokeWidth="6"
          strokeDasharray="1.2 2.5"
          mask="url(#dial-arc-3d)"
        />
      </svg>

      <button
        type="button"
        aria-label="Ogohlantirishni yuborish uchun bosib turing"
        {...props}
        style={{ background: "var(--dome)" }}
        className="relative z-10 flex h-[148px] w-[148px] touch-none select-none flex-col items-center justify-center gap-1.5 rounded-full text-white shadow-[inset_0_5px_10px_rgba(255,255,255,0.30),inset_0_-11px_18px_rgba(138,30,12,0.55),0_8px_0_0_#9a2710,0_17px_24px_-6px_rgba(176,44,20,0.50)] duration-200 ease-out active:translate-y-[5px] active:shadow-[inset_0_4px_8px_rgba(255,255,255,0.22),inset_0_-7px_12px_rgba(138,30,12,0.55),0_3px_0_0_#9a2710,0_8px_12px_-6px_rgba(176,44,20,0.42)] active:duration-150"
      >
        {/* gloss highlight */}
        <span className="pointer-events-none absolute left-1/2 top-4 h-8 w-20 -translate-x-1/2 rounded-full bg-white/20 blur-[3px]" />
        {fired ? (
          <Check size={38} strokeWidth={2.2} className="drop-shadow" />
        ) : (
          <Siren size={38} strokeWidth={1.9} className="drop-shadow" />
        )}
        <span
          ref={pctRef}
          className="font-mono text-[15px] font-bold tabular-nums text-white drop-shadow"
        >
          0%
        </span>
        <span className="font-mono text-[9px] tracking-[0.16em] text-white/75">
          {fired ? "YUBORILDI" : "BOSIB TURING"}
        </span>
      </button>
    </div>
  );
}

/* ── 04 · SLAYDER — pill that floods with striped brand fill while held ── */
function SweepPillButton() {
  const fillRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const { phase, props } = useHold((p) => {
    if (fillRef.current) fillRef.current.style.width = `${p * 100}%`;
    if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
  });
  const fired = phase === "fired";

  return (
    <button
      type="button"
      aria-label="Ogohlantirishni yuborish uchun bosib turing"
      {...props}
      className={`relative h-[62px] w-full touch-none select-none overflow-hidden rounded-full border transition-colors duration-200 active:scale-[0.99] ${
        fired ? "border-ok/60" : "border-border"
      } bg-surface-2`}
    >
      {/* striped flood fill */}
      <span
        ref={fillRef}
        className={`absolute inset-y-0 left-0 w-0 ${fired ? "bg-ok" : "bg-brand"}`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.16) 0 8px, transparent 8px 16px)",
        }}
      />
      <span className="relative z-10 flex h-full items-center justify-between px-5">
        <span className="flex items-center gap-2.5">
          {fired ? (
            <Check size={19} strokeWidth={2.4} className="text-white" />
          ) : (
            <Siren size={19} className="text-brand" />
          )}
          <span className="text-[14px] font-semibold text-tx">
            {fired ? "Yuborildi" : "Bosib turing"}
          </span>
        </span>
        <span
          ref={pctRef}
          className="font-mono text-[13px] font-bold tabular-nums text-tx"
        >
          0%
        </span>
      </span>
    </button>
  );
}

/* ── gallery page ─────────────────────────────────────────────────────── */
const VARIANTS = [
  {
    tag: "VARIANT 01 · KLAVISH",
    desc: "3D klavish saqlanadi — halqa o'rniga LED chiziq yuzada to'ladi",
    body: <KeycapButton />,
  },
  {
    tag: "VARIANT 02 · SHTRIX PANEL",
    desc: "Butun panel tugma — shtrix to'ldirish chapdan o'ngga suriladi",
    body: <TickPadButton />,
  },
  {
    tag: "VARIANT 03 · SHKALA",
    desc: "Yassi asbob-uskuna uslubi — shkala belgilari aylana bo'ylab yonadi",
    body: <DialButton />,
  },
  {
    tag: "VARIANT 03B · SHKALA 3D",
    desc: "Shkala halqasi + 3D bosiladigan tugma — klavish bezel ichiga botadi",
    body: <Dial3DButton />,
  },
  {
    tag: "VARIANT 04 · SLAYDER",
    desc: "Past bo'yli pill — ushlab turganda chiziqli to'lqin bosib o'tadi",
    body: <SweepPillButton />,
  },
];

export default function Page() {
  return (
    <div className="relative isolate flex min-h-full flex-col gap-4 px-4 pb-5 pt-2.5">
      {/* hatched backdrop — wide-set diagonal hairlines */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 18px)",
        }}
      />

      <header className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="Orqaga"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-2 text-dim active:brightness-90"
        >
          <ArrowLeft size={17} />
        </Link>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[18px] font-bold text-tx">Tugma variantlari</h1>
          <span className="font-mono text-[10px] tracking-[0.14em] text-faint">
            UX BIR XIL: 1,5 SONIYA USHLAB TURING
          </span>
        </div>
      </header>

      {VARIANTS.map((v) => (
        <section
          key={v.tag}
          className="flex flex-col items-center gap-4 rounded-[18px] border border-border bg-surface/60 p-5"
        >
          <div className="flex w-full items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.16em] text-brand">
              {v.tag}
            </span>
          </div>
          {v.body}
          <p className="text-center text-[12px] leading-relaxed text-dim">{v.desc}</p>
        </section>
      ))}
    </div>
  );
}
