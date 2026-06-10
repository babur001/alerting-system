import {
  Archive,
  Calendar,
  BellRing,
  Target,
  Waves,
  CloudRainWind,
  TriangleAlert,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import { history, type AlertIcon } from "@/lib/data";

const ICONS: Record<AlertIcon, LucideIcon> = {
  waves: Waves,
  "cloud-rain-wind": CloudRainWind,
  "triangle-alert": TriangleAlert,
  "flask-conical": FlaskConical,
};

const SUMMARY: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: BellRing, value: "24", label: "Jami ogohlantirishlar" },
  { icon: Target, value: "96%", label: "O'rtacha qamrov" },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-4 px-4 pb-5 pt-2.5">
      {/* header */}
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[20px] font-bold text-tx">Tarix</h1>
          <div className="flex items-center gap-1.5">
            <Archive size={14} className="text-dim" />
            <span className="text-[13px] font-medium text-dim">
              Ogohlantirishlar arxivi
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-sharp border border-border bg-surface px-3 py-2">
          <Calendar size={15} className="text-dim" />
          <span className="text-[13px] font-semibold text-tx">2026</span>
        </div>
      </header>

      {/* summary */}
      <div className="flex gap-2.5">
        {SUMMARY.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-1 flex-col gap-2.5 rounded-sharp border border-border bg-surface p-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-sharp bg-surface-2">
              <Icon size={18} className="text-dim" />
            </div>
            <span className="text-[26px] font-extrabold leading-none text-tx">
              {value}
            </span>
            <span className="text-[12.5px] font-medium text-dim">{label}</span>
          </div>
        ))}
      </div>

      <p className="px-0.5 text-[11px] font-semibold tracking-[0.15em] text-faint">
        OGOHLANTIRISHLAR
      </p>

      {/* list */}
      <div className="flex flex-col gap-2">
        {history.map((a) => {
          const Icon = ICONS[a.icon];
          return (
            <div
              key={a.title}
              className="flex flex-col gap-[11px] rounded-sharp border border-border bg-surface p-[13px]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-sharp ${
                    a.critical ? "bg-brand-bg" : "bg-surface-2"
                  }`}
                >
                  <Icon
                    size={20}
                    className={a.critical ? "text-brand" : "text-dim"}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[14.5px] font-semibold text-tx">
                    {a.title}
                  </span>
                  <span className="text-[12px] text-dim">{a.date}</span>
                </div>
                <span className="text-[18px] font-extrabold text-tx">
                  {a.percent}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-[3px] px-2.5 py-1 text-[11.5px] font-bold ${
                    a.critical
                      ? "bg-brand-bg text-brand"
                      : "bg-surface-2 text-dim"
                  }`}
                >
                  {a.level}
                </span>
                <span className="text-[12.5px] font-medium text-dim">
                  {a.reach}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
