import Link from "next/link";
import {
  LoaderCircle,
  Siren,
  MessageSquareText,
  PhoneCall,
  CircleStop,
  type LucideIcon,
} from "lucide-react";
import {
  liveCampaign as campaign,
  inFlight,
  fmt,
  type Channel,
} from "@/lib/data";

const CHANNEL_ICON: Record<Channel, LucideIcon> = {
  sms: MessageSquareText,
  voice: PhoneCall,
};

export default function Page() {
  // primary channel drives the headline numbers (SMS for now)
  const primary = campaign.channels[0];
  const frac = primary.delivered / campaign.total; // delivered → green
  const rFrac = primary.failed / campaign.total; // failed → red
  const sentPct = Math.round(frac * 100);
  const SEGMENTS = 16;

  return (
    <div className="flex flex-col gap-4 px-4 pb-5 pt-2.5">
      {/* header */}
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[20px] font-bold text-tx">Jonli holat</h1>
          <div className="flex items-center gap-1.5">
            <LoaderCircle size={14} className="animate-spin text-brand" />
            <span className="text-[13px] font-medium text-dim">
              Yuborilmoqda · {campaign.elapsed}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-sharp bg-brand-bg px-3 py-2">
          <span className="size-2 animate-pulse rounded-full bg-brand" />
          <span className="text-[11px] font-bold tracking-wide text-brand">JONLI</span>
        </div>
      </header>

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

        <div className="flex items-end gap-1">
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
        </div>

        {/* counts + colour key (replaces the stat cards) */}
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

      {/* stop */}
      <Link
        href="/"
        className="flex h-[54px] items-center justify-center gap-2.5 rounded-sharp border border-[#5a2a22] bg-surface text-[16px] font-semibold text-brand active:brightness-95"
      >
        <CircleStop size={20} />
        Yuborishni to&apos;xtatish
      </Link>
    </div>
  );
}
