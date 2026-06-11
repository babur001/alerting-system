"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LoaderCircle,
  CircleCheck,
  CircleStop,
  Siren,
  MessageSquareText,
  PhoneCall,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import {
  liveCampaign as campaign,
  inFlight,
  fmt,
  type Channel,
} from "@/lib/data";
import StopSending from "@/components/stop-sending";

const CHANNEL_ICON: Record<Channel, LucideIcon> = {
  sms: MessageSquareText,
  voice: PhoneCall,
};

export default function Page() {
  const [stopped, setStopped] = useState(false);

  // Glint sweep driven by the Web Animations API rather than a CSS keyframe —
  // the dev server intermittently drops the generated @keyframes/utility, so
  // we define the animation in JS where nothing can strip it.
  const glintRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = glintRef.current;
    if (stopped || !el) return;
    const anim = el.animate(
      [
        { transform: "translateX(-120%) skewX(-14deg)" },
        { transform: "translateX(420%) skewX(-14deg)", offset: 0.45 },
        { transform: "translateX(420%) skewX(-14deg)" },
      ],
      { duration: 2400, iterations: Infinity, easing: "linear" },
    );
    return () => anim.cancel();
  }, [stopped]);

  // primary channel drives the headline numbers (SMS for now)
  const primary = campaign.channels[0];
  const frac = primary.delivered / campaign.total; // delivered → green
  const rFrac = primary.failed / campaign.total; // failed → red
  const sentPct = Math.round(frac * 100);
  const SEGMENTS = 16;
  const notReached = campaign.total - primary.delivered; // never got the alert

  // outcome once the broadcast is halted
  const outcome =
    primary.delivered === campaign.total
      ? { label: "Muvaffaqiyatli yakunlandi", ok: true }
      : primary.delivered === 0
        ? { label: "Yuborilmadi", ok: false }
        : { label: "Qisman yakunlandi", ok: true };

  return (
    <div className="flex flex-col gap-4 px-4 pb-5 pt-2.5">
      {/* header */}
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[20px] font-bold text-tx">Jonli holat</h1>
          <div className="flex items-center gap-1.5">
            {stopped ? (
              <CircleStop size={14} className="text-dim" />
            ) : (
              <LoaderCircle size={14} className="animate-spin text-brand" />
            )}
            <span className="text-[13px] font-medium text-dim">
              {stopped ? "To'xtatildi" : "Yuborilmoqda"} · {campaign.elapsed}
            </span>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 rounded-sharp px-3 py-2 ${
            stopped ? "bg-surface-2" : "bg-brand-bg"
          }`}
        >
          <span
            className={`size-2 rounded-full ${
              stopped ? "bg-faint" : "animate-pulse bg-brand"
            }`}
          />
          <span
            className={`text-[11px] font-bold tracking-wide ${
              stopped ? "text-dim" : "text-brand"
            }`}
          >
            {stopped ? "TO'XTATILDI" : "JONLI"}
          </span>
        </div>
      </header>

      {/* outcome summary — shown once stopped */}
      {stopped && (
        <div className="flex items-center gap-3 rounded-sharp border border-border bg-surface p-[13px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-sharp bg-surface-2">
            {outcome.ok ? (
              <CircleCheck size={21} className="text-ok" />
            ) : (
              <CircleStop size={21} className="text-bad" />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-[14px] font-bold text-tx">{outcome.label}</span>
            <span className="text-[12px] font-medium text-dim">
              {fmt(primary.delivered)} aholiga yetkazildi · {fmt(notReached)} taga
              yetkazilmadi
            </span>
          </div>
        </div>
      )}

      {/* alert context */}
      <div className="flex items-center gap-3 rounded-sharp border border-[#3a2018] bg-brand-bg p-[13px]">
        <div className="flex h-10 w-10 items-center justify-center rounded-sharp bg-brand">
          <Siren size={21} className="text-white" />
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-[14px] font-bold text-tx">{campaign.title}</span>
          <span className="text-[12px] font-medium text-dim">
            {campaign.level.toUpperCase()} daraja · {campaign.instruction}
          </span>
        </div>
      </div>

      {/* live send meter — green delivered · red failed · gray pending */}
      <div className="flex flex-col gap-3 rounded-sharp border border-border bg-surface p-[13px]">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] font-extrabold leading-none text-tx">
              {fmt(primary.delivered)}
            </span>
            <span className="text-[13px] font-medium text-dim">
              / {fmt(campaign.total)} yuborildi
            </span>
          </div>
          <span className="text-[15px] font-bold text-ok">{sentPct}%</span>
        </div>

        <div className="relative flex items-end gap-1 overflow-hidden">
          {Array.from({ length: SEGMENTS }, (_, i) => {
            const green = Math.max(0, Math.min(1, frac * SEGMENTS - i));
            const resolved = Math.max(0, Math.min(1, (frac + rFrac) * SEGMENTS - i));
            const red = resolved - green;
            return (
              <div
                key={i}
                className="relative h-9 flex-1 overflow-hidden rounded-[3px] bg-track"
              >
                {/* delivered */}
                <div
                  style={{ height: `${green * 100}%` }}
                  className="absolute inset-x-0 bottom-0 bg-ok"
                />
                {/* failed, stacked above delivered */}
                <div
                  style={{ bottom: `${green * 100}%`, height: `${red * 100}%` }}
                  className="absolute inset-x-0 bg-bad"
                />
              </div>
            );
          })}
          {/* sending glint — only while live (animated via WAAPI, see effect) */}
          {!stopped && (
            <span
              ref={glintRef}
              className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            />
          )}
        </div>

        {/* counts + colour key */}
        <div className="flex items-center justify-between text-[12px]">
          {[
            { dot: "bg-ok", n: primary.delivered, l: "Yetkazildi" },
            { dot: "bg-faint", n: inFlight(primary), l: "Jarayonda" },
            { dot: "bg-bad", n: primary.failed, l: "Javobsiz" },
          ].map((x) => (
            <span key={x.l} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${x.dot}`} />
              <span className="font-bold text-tx">{fmt(x.n)}</span>
              <span className="text-dim">{x.l}</span>
            </span>
          ))}
        </div>
      </div>

      {/* per-channel breakdown — only when there's more than one channel
          (with just SMS it would duplicate the meter above) */}
      {campaign.channels.length > 1 && (
        <>
          <p className="px-0.5 text-[11px] font-semibold tracking-[0.15em] text-faint">
            KANALLAR
          </p>

          <div className="flex flex-col gap-2">
            {campaign.channels.map((c) => {
              const Icon = CHANNEL_ICON[c.channel];
              const pct = Math.round((c.delivered / c.total) * 100);
              return (
                <div
                  key={c.channel}
                  className="flex flex-col gap-[11px] rounded-sharp border border-border bg-surface p-[13px]"
                >
                  <div className="flex items-center gap-[11px]">
                    <div className="flex h-[34px] w-[34px] items-center justify-center rounded-sharp bg-surface-2">
                      <Icon size={17} className="text-brand" />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="text-[14px] font-semibold text-tx">
                        {c.label}
                      </span>
                      <span className="text-[12px] text-dim">
                        {fmt(c.delivered)} / {fmt(c.total)} yetkazildi
                      </span>
                    </div>
                    <span className="text-[15px] font-bold text-tx">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-[2px] bg-track">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full rounded-[2px] bg-brand"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* bottom action — stop (live) or return home (stopped) */}
      {stopped ? (
        <Link
          href="/"
          className="flex h-[54px] items-center justify-center gap-2.5 rounded-sharp border border-border bg-surface text-[16px] font-semibold text-tx active:brightness-95"
        >
          <ArrowLeft size={20} />
          Bosh sahifaga qaytish
        </Link>
      ) : (
        <StopSending
          pending={fmt(inFlight(primary))}
          onConfirm={() => setStopped(true)}
        />
      )}
    </div>
  );
}
