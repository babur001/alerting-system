import Link from "next/link";
import {
  Timer,
  Siren,
  MessageSquareText,
  PhoneCall,
  CircleStop,
} from "lucide-react";

const RADIUS = 47;
const CIRC = 2 * Math.PI * RADIUS;
const PROGRESS = 0.86;

const STATS: { value: string; label: string; accent?: boolean }[] = [
  { value: "1 102", label: "Yetkazildi" },
  { value: "142", label: "Jarayonda" },
  { value: "40", label: "Javobsiz", accent: true },
];

const CHANNELS = [
  {
    icon: MessageSquareText,
    name: "SMS xabar",
    sub: "1 040 / 1 284 yetkazildi",
    pct: 81,
  },
  {
    icon: PhoneCall,
    name: "Ovozli qo'ng'iroq",
    sub: "712 / 1 284 javob berildi",
    pct: 55,
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-4 px-4 pb-5 pt-2.5">
      {/* header */}
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[20px] font-bold text-tx">Jonli holat</h1>
          <div className="flex items-center gap-1.5">
            <Timer size={14} className="text-dim" />
            <span className="text-[13px] font-medium text-dim">
              Yuborilmoqda · 01:23
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-sharp bg-brand-bg px-3 py-2">
          <span className="size-2 animate-pulse rounded-full bg-brand" />
          <span className="text-[11px] font-bold tracking-wide text-brand">
            JONLI
          </span>
        </div>
      </header>

      {/* alert context */}
      <div className="flex items-center gap-3 rounded-sharp border border-[#3a2018] bg-brand-bg p-[13px]">
        <div className="flex h-10 w-10 items-center justify-center rounded-sharp bg-brand">
          <Siren size={21} className="text-white" />
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-[14px] font-bold text-tx">
            Suv toshqini xavfi
          </span>
          <span className="text-[12px] font-medium text-dim">
            {"QIZIL daraja · 12-maktab tomon evakuatsiya"}
          </span>
        </div>
      </div>

      {/* radial live gauge */}
      <div className="flex justify-center py-1">
        <div className="relative h-[272px] w-[272px]">
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
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - PROGRESS)}
            />
          </svg>
          <div
            style={{ background: "var(--dome)" }}
            className="absolute left-1/2 top-1/2 flex h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full text-white shadow-[0_12px_30px_-6px_rgba(232,67,31,0.45),inset_0_-7px_14px_rgba(160,42,16,0.55),inset_0_5px_10px_rgba(255,255,255,0.22)]"
          >
            <span className="pointer-events-none absolute left-1/2 top-4 h-8 w-20 -translate-x-1/2 rounded-full bg-white/20 blur-[2px]" />
            <span className="text-[40px] font-extrabold leading-none">86%</span>
            <span className="text-[13px] font-semibold text-white/85">
              1 102 / 1 284
            </span>
          </div>
        </div>
      </div>

      {/* mini-stats */}
      <div className="flex gap-2">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-1 flex-col items-center gap-1 rounded-sharp border border-border bg-surface px-2 py-[13px]"
          >
            <span
              className={`text-[21px] font-extrabold leading-none ${
                s.accent ? "text-brand" : "text-tx"
              }`}
            >
              {s.value}
            </span>
            <span className="text-[11px] font-medium text-dim">{s.label}</span>
          </div>
        ))}
      </div>

      <p className="px-0.5 text-[11px] font-semibold tracking-[0.15em] text-faint">
        KANALLAR
      </p>

      {/* channels */}
      <div className="flex flex-col gap-2">
        {CHANNELS.map(({ icon: Icon, name, sub, pct }) => (
          <div
            key={name}
            className="flex flex-col gap-[11px] rounded-sharp border border-border bg-surface p-[13px]"
          >
            <div className="flex items-center gap-[11px]">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-sharp bg-surface-2">
                <Icon size={17} className="text-brand" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-semibold text-tx">{name}</span>
                <span className="text-[12px] text-dim">{sub}</span>
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
        ))}
      </div>

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
