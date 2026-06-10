"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Siren, Fingerprint, Check } from "lucide-react";

export type Level = {
  id: string;
  idx: string;
  name: string;
  desc: string;
  bars: number;
};

const LEVELS: Level[] = [
  { id: "toq", idx: "01", name: "To'q sariq", desc: "Tayyorgarlik ko'ring", bars: 2 },
  { id: "qizil", idx: "02", name: "Qizil", desc: "Darhol evakuatsiya", bars: 3 },
];

const RADIUS = 47;
const CIRC = 2 * Math.PI * RADIUS;
const HOLD_MS = 1500; // how long to hold before the alert fires

type Phase = "idle" | "holding" | "sending";

export default function Console() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("qizil");
  const [phase, setPhase] = useState<Phase>("idle");
  const level = LEVELS.find((l) => l.id === selectedId)!;

  const arcRef = useRef<SVGCircleElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const holdingRef = useRef(false);
  const doneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickRef = useRef<HTMLAudioElement | null>(null);

  // paint the fill ring directly (avoids a React render every frame)
  function setArc(p: number) {
    const c = arcRef.current;
    if (c) c.style.strokeDashoffset = String(CIRC * (1 - p));
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
    setArc(p);
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
    const c = arcRef.current;
    if (c) c.style.transition = "none"; // fill follows the finger 1:1
    rafRef.current = requestAnimationFrame(tick);
  }

  function cancelHold() {
    if (!holdingRef.current) return; // ignore release after it already fired
    holdingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    const c = arcRef.current;
    if (c) {
      c.style.transition = "stroke-dashoffset 300ms ease-out"; // spring back
      setArc(0);
    }
  }

  function finishSend() {
    holdingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase("sending");
    const c = arcRef.current;
    if (c) c.style.transition = "none";
    setArc(1);
    // let the full ring + "sent" state register before navigating
    doneTimerRef.current = setTimeout(() => router.push("/jonli"), 260);
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
    <div className="h-full flex flex-col justify-between gap-4 px-4 py-5">
      {/* ── Level selector ───────────────────────────── */}
      <p className="px-0.5 text-[11px] font-semibold tracking-[0.15em] text-faint">
        DARAJANI TANLANG
      </p>
      <div className="flex flex-col gap-2">
        {LEVELS.map((l) => {
          const sel = l.id === selectedId;
          return (
            <button
              type="button"
              key={l.id}
              onClick={() => setSelectedId(l.id)}
              className={`flex items-center gap-[13px] rounded-sharp border p-[13px] text-left transition-colors ${
                sel ? "border-brand bg-surface-2" : "border-border bg-surface"
              }`}
            >
              <span
                className={`text-[13px] font-bold tabular-nums ${
                  sel ? "text-brand" : "text-faint"
                }`}
              >
                {l.idx}
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-semibold text-tx">{l.name}</span>
                <span className="text-[12px] text-dim">{l.desc}</span>
              </div>
              {/* escalation meter */}
              <div className="flex h-4 items-end gap-[3px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{ height: 6 + i * 5 }}
                    className={`w-[4px] rounded-[1px] ${
                      i < l.bars ? "bg-brand" : "bg-track"
                    }`}
                  />
                ))}
              </div>
              {/* checkbox */}
              <div
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-sharp border ${
                  sel ? "border-brand bg-brand" : "border-[#3a4350]"
                }`}
              >
                {sel && <Check size={14} strokeWidth={3} className="text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Radial console ───────────────────────────── */}
      <div className="flex justify-center pt-3">
        <div className="relative flex h-[280px] w-[280px] items-center justify-center">
          {/* hold-to-send progress ring */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full -rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="var(--track)"
              strokeWidth="3.5"
            />
            <circle
              ref={arcRef}
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC}
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
            className="group relative z-10 flex h-[200px] w-[200px] touch-none select-none flex-col items-center justify-center gap-3 rounded-full text-white shadow-[inset_0_6px_11px_rgba(255,255,255,0.30),inset_0_-13px_20px_rgba(138,30,12,0.55),0_9px_0_0_#9a2710,0_19px_26px_-6px_rgba(176,44,20,0.50)] duration-200 ease-out active:translate-y-[6px] active:shadow-[inset_0_4px_8px_rgba(255,255,255,0.22),inset_0_-8px_14px_rgba(138,30,12,0.55),0_3px_0_0_#9a2710,0_8px_14px_-6px_rgba(176,44,20,0.42)] active:duration-150"
          >
            {/* gloss highlight */}
            <span className="pointer-events-none absolute left-1/2 top-6 h-10 w-28 -translate-x-1/2 rounded-full bg-white/20 blur-[3px]" />
            <Siren size={64} strokeWidth={1.9} className="drop-shadow" />
            <span className="text-[13px] font-semibold text-white/85">{sub}</span>
          </button>
        </div>
      </div>

      {/* caption */}
      <div className="flex items-center justify-center gap-2 text-center text-[12px] text-dim">
        <Fingerprint size={14} className="text-brand" />
        <span>
          {sending
            ? "Yuborildi · jonli holatga o'tilmoqda…"
            : "Yuborish uchun tugmani bosib turing"}
        </span>
      </div>
    </div>
  );
}
