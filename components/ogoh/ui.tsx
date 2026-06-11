"use client";

// OGOH shared primitives — ported from the Claude Design rebuild (shared.jsx).
// Custom one-offs (siren glyph, tick ring) stay hand-rolled; everything with a
// shadcn equivalent (badge, avatar, bottom sheet) wraps the project's Base UI
// components instead.

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import type { Risk } from "@/lib/ogoh/data";

// ── Siren beacon glyph ────────────────────────────────────────
export function SirenGlyph({
  size = 56,
  color = "#fff",
  stroke = 5,
}: {
  size?: number;
  color?: string;
  stroke?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M16 44 V40 a16 16 0 0 1 32 0 V44"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="11" y="44" width="42" height="8" rx="4" stroke={color} strokeWidth={stroke} />
      <line x1="32" y1="16" x2="32" y2="8" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <line x1="50" y1="24" x2="56" y2="19" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <line x1="14" y1="24" x2="8" y2="19" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

// ── Tick ring (progress-aware instrument bezel) ───────────────
export function TickRing({
  size = 252,
  count = 72,
  color = "#FF4632",
  active = 0,
  idle = "#2B2F37",
}: {
  size?: number;
  count?: number;
  color?: string;
  active?: number;
  idle?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const rO = size / 2 - 4;
  const rI = size / 2 - 20;
  const ticks = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    const on = i / count < active;
    ticks.push(
      <line
        key={i}
        x1={cx + Math.cos(a) * rI}
        y1={cy + Math.sin(a) * rI}
        x2={cx + Math.cos(a) * rO}
        y2={cy + Math.sin(a) * rO}
        stroke={on ? color : idle}
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transition: "stroke 80ms linear" }}
      />
    );
  }
  return (
    <svg width={size} height={size} className="absolute inset-0">
      {ticks}
    </svg>
  );
}

// ── Status dot ────────────────────────────────────────────────
export function Dot({ color, size = 7 }: { color: string; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: color, boxShadow: `0 0 7px ${color}` }}
    />
  );
}

export const riskColor = (r: Risk) => (r === "crit" ? "#FF4632" : r === "warn" ? "#F4A724" : "#1FCB84");

// ── Status tag — Badge themed per severity ────────────────────
const TAG_STYLES = {
  ok: "bg-og-green-soft text-og-green",
  warn: "bg-og-amber-soft text-og-amber",
  crit: "bg-og-red-soft text-og-red",
  idle: "bg-white/5 text-og-dim",
} as const;

const TAG_DOT = { ok: "#1FCB84", warn: "#F4A724", crit: "#FF4632", idle: "#9AA1AB" } as const;

export function StatusTag({
  kind = "ok",
  className,
  children,
}: {
  kind?: keyof typeof TAG_STYLES;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto gap-1.5 rounded-[7px] px-2 py-1 font-mono text-[10.5px] font-semibold tracking-[0.05em] whitespace-nowrap",
        TAG_STYLES[kind],
        className
      )}
    >
      <Dot color={TAG_DOT[kind]} size={6} />
      {children}
    </Badge>
  );
}

// ── Section header (mono kicker) ──────────────────────────────
export function Kicker({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("font-mono text-[10.5px] tracking-[0.14em] text-og-dim2 uppercase", className)}>
      {children}
    </div>
  );
}

// ── Initials avatar — shadcn Avatar, squared like the design ──
export function OgAvatar({ name, size = 38 }: { name: string; size?: number }) {
  const ini = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <Avatar className="rounded-[10px] after:rounded-[10px] after:border-og-line" style={{ width: size, height: size }}>
      <AvatarFallback
        className="rounded-[10px] bg-og-panel2 font-mono font-semibold text-og-dim"
        style={{ fontSize: size * 0.34 }}
      >
        {ini}
      </AvatarFallback>
    </Avatar>
  );
}

// ── Bottom sheet — vaul Drawer with the OGOH panel look ───────
// Replaces the design's hand-rolled Sheet: adds drag-to-dismiss, focus
// trapping and scroll locking for free.
export function OgSheet({
  open,
  onOpenChange,
  title,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** accessible title; rendered visually unless you render your own header */
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={cn(
          "mx-auto max-w-md border-og-line bg-og-panel pb-[max(env(safe-area-inset-bottom),16px)] data-[vaul-drawer-direction=bottom]:max-h-[92dvh] data-[vaul-drawer-direction=bottom]:rounded-t-[26px]",
          className
        )}
      >
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
