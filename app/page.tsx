"use client";

// Main screen — pick a level, press-and-hold the dome button to send.
// Hatched backdrop, soft corners, mono micro-labels, and the SHKALA 3D
// trigger (3D dome sunk in an instrument tick-ring bezel, live % on the
// dome face). Alternative trigger designs live at /buttons.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Siren, Check } from "lucide-react";
import { settlement } from "@/lib/data";

type Level = {
  id: string;
  idx: string;
  name: string;
  desc: string;
  bars: number; // escalation meter (of 3)
};

const LEVELS: Level[] = [
  { id: "toq", idx: "01", name: "To'q sariq", desc: "TAYYORGARLIK KO'RING", bars: 2 },
  { id: "qizil", idx: "02", name: "Qizil", desc: "DARHOL EVAKUATSIYA", bars: 3 },
];

const RADIUS = 47;
const CIRC = 2 * Math.PI * RADIUS;
const HOLD_MS = 1500; // how long to hold before the alert fires

type Phase = "idle" | "holding" | "sending";

export default function Page() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("qizil");
  const [phase, setPhase] = useState<Phase>("idle");
  const level = LEVELS.find((l) => l.id === selectedId)!;

  const arcRef = useRef<SVGCircleElement>(null); // mask arc revealing lit ticks
  const domePctRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const holdingRef = useRef(false);
  const doneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickRef = useRef<HTMLAudioElement | null>(null);

  // paint dial ring + % readout directly (no React render per frame)
  function paint(p: number) {
    if (arcRef.current) arcRef.current.style.strokeDashoffset = String(CIRC * (1 - p));
    if (domePctRef.current) domePctRef.current.textContent = `${Math.round(p * 100)}%`;
  }

  function setTransitions(on: boolean) {
    if (arcRef.current)
      arcRef.current.style.transition = on ? "stroke-dashoffset 300ms ease-out" : "none";
  }

  function playClick() {
    if (typeof Audio === "undefined") return;
    let a = clickRef.current;
    if (!a) {
      a = new Audio("/click.mp3");
      a.preload = "auto";
      clickRef.current = a;
    }
    a.currentTime = 0;
    a.play().catch(() => {});
  }

  function tick(now: number) {
    if (!holdingRef.current) return;
    const p = Math.min((now - startRef.current) / HOLD_MS, 1);
    paint(p);
    if (p >= 1) {
      finishSend();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function startHold(e: React.PointerEvent<HTMLButtonElement>) {
    if (phase === "sending" || holdingRef.current) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    playClick();
    holdingRef.current = true;
    setPhase("holding");
    startRef.current = performance.now();
    setTransitions(false); // fill follows the finger 1:1
    rafRef.current = requestAnimationFrame(tick);
  }

  function cancelHold() {
    if (!holdingRef.current) return; // ignore release after it already fired
    holdingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    setTransitions(true); // spring back
    paint(0);
  }

  function finishSend() {
    holdingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase("sending");
    setTransitions(false);
    paint(1);
    // let the full ring + "sent" state register before navigating
    doneTimerRef.current = setTimeout(() => router.push("/jonli"), 300);
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
    };
  }, []);

  const holding = phase === "holding";
  const sending = phase === "sending";
  const sub = sending ? "Yuborilmoqda…" : holding ? "Ushlab turing…" : "Bosib turing";

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

      {/* header */}
      <header className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-tx">{settlement.name}</h1>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1">
          <span className="size-1.5 animate-pulse rounded-full bg-ok" />
          <span className="font-mono text-[10px] tracking-[0.14em] text-dim">ONLAYN</span>
        </div>
      </header>

      {/* ── Level selector ───────────────────────────── */}
      <p className="px-0.5 font-mono text-[10px] tracking-[0.16em] text-faint">
        DARAJANI TANLANG
      </p>
      <div className="-mt-1.5 flex flex-col gap-2">
        {LEVELS.map((l) => {
          const sel = l.id === selectedId;
          return (
            <button
              type="button"
              key={l.id}
              onClick={() => setSelectedId(l.id)}
              className={`flex items-center gap-[13px] rounded-[14px] border p-[13px] text-left transition-colors ${
                sel ? "border-brand/70 bg-surface-2" : "border-border bg-surface"
              }`}
            >
              <span
                className={`font-mono text-[13px] font-bold tabular-nums ${
                  sel ? "text-brand" : "text-faint"
                }`}
              >
                {l.idx}
              </span>
              <span className="flex flex-1 flex-col gap-1">
                <span className="text-[14px] font-semibold text-tx">{l.name}</span>
                <span className="font-mono text-[10px] tracking-[0.1em] text-faint">
                  {l.desc}
                </span>
              </span>
              {/* escalation meter */}
              <span className="flex h-4 items-end gap-[3px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{ height: 6 + i * 5 }}
                    className={`w-[4px] rounded-[1px] ${
                      i < l.bars ? "bg-brand" : "bg-track"
                    }`}
                  />
                ))}
              </span>
              {/* checkbox */}
              <span
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-[7px] border transition-colors ${
                  sel ? "border-brand bg-brand" : "border-[#3a4350]"
                }`}
              >
                {sel && <Check size={14} strokeWidth={3} className="text-white" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Trigger zone — the dome console in a dashed drop zone ── */}
      <div
        className={`flex flex-1 flex-col items-center justify-center gap-4 rounded-[18px] border border-dashed px-3 pb-5 pt-6 transition-colors duration-200 ${
          holding || sending
            ? "border-brand/70 bg-brand-bg/40"
            : "border-[#3a4350] bg-bg/40"
        }`}
      >
        <div className="relative flex h-[248px] w-[248px] items-center justify-center">
          {/* instrument bezel — tick marks light up as the hold progresses */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full -rotate-90"
          >
            <defs>
              {/* growing arc that reveals the lit ticks */}
              <mask id="dial-arc">
                <circle
                  ref={arcRef}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke="white"
                  strokeWidth="9"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC}
                />
              </mask>
            </defs>
            {/* tick ring: dash pattern = radial tick marks */}
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="var(--track)"
              strokeWidth="6"
              strokeDasharray="1.2 2.5"
            />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="6"
              strokeDasharray="1.2 2.5"
              mask="url(#dial-arc)"
            />
          </svg>

          {/* 3D hardware press button — press AND HOLD to arm + send.
              A hard dark-red bottom edge is the side wall; on press the face
              drops by exactly the wall's shrink (9px→3px) so it compresses */}
          <button
            type="button"
            aria-label={`${level.name} ogohlantirishni yuborish uchun bosib turing`}
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerCancel={cancelHold}
            onLostPointerCapture={cancelHold}
            onContextMenu={(e) => e.preventDefault()}
            style={{ background: "var(--dome)" }}
            className="group relative z-10 flex h-[178px] w-[178px] touch-none select-none flex-col items-center justify-center gap-1.5 rounded-full text-white shadow-[inset_0_6px_11px_rgba(255,255,255,0.30),inset_0_-13px_20px_rgba(138,30,12,0.55),0_9px_0_0_#9a2710,0_19px_26px_-6px_rgba(176,44,20,0.50)] duration-200 ease-out active:translate-y-[6px] active:shadow-[inset_0_4px_8px_rgba(255,255,255,0.22),inset_0_-8px_14px_rgba(138,30,12,0.55),0_3px_0_0_#9a2710,0_8px_14px_-6px_rgba(176,44,20,0.42)] active:duration-150"
          >
            {/* gloss highlight */}
            <span className="pointer-events-none absolute left-1/2 top-5 h-9 w-24 -translate-x-1/2 rounded-full bg-white/20 blur-[3px]" />
            <Siren size={46} strokeWidth={1.9} className="drop-shadow" />
            <span
              ref={domePctRef}
              className="font-mono text-[16px] font-bold tabular-nums text-white drop-shadow"
            >
              0%
            </span>
            <span className="font-mono text-[9px] tracking-[0.16em] text-white/75">
              {sub.toUpperCase()}
            </span>
          </button>
        </div>

        <span className="font-mono text-[10px] tracking-[0.14em] text-faint">
          {sending
            ? `DARAJA: ${level.name.toUpperCase()} · YO'LGA CHIQDI`
            : `USHLAB TURISH: 1,5 SONIYA · DARAJA: ${level.name.toUpperCase()}`}
        </span>
      </div>

      {/* page footer — corners, like the reference */}
      <footer className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-2 font-mono text-[9px] font-bold text-dim">
            OQ
          </span>
          <span className="text-[12px] text-faint">{settlement.name}</span>
        </div>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="font-mono text-[10px] tracking-[0.14em] text-dim">
            {settlement.population} AHOLI
          </span>
        </span>
      </footer>
    </div>
  );
}
