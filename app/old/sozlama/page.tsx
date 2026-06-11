"use client";

import { useState } from "react";
import {
  MessageSquareText,
  PhoneCall,
  BellRing,
  RefreshCw,
  FlaskConical,
  ChevronRight,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type Toggle = {
  id: string;
  icon: LucideIcon;
  label: string;
  desc: string;
  on: boolean;
};

const INITIAL: { section: string; rows: Toggle[] }[] = [
  {
    section: "OGOHLANTIRISH KANALLARI",
    rows: [
      { id: "sms", icon: MessageSquareText, label: "SMS xabar", desc: "Matnli ogohlantirish", on: true },
      { id: "voice", icon: PhoneCall, label: "Ovozli qo'ng'iroq", desc: "Avtomatik IVR qo'ng'iroq", on: true },
      { id: "push", icon: BellRing, label: "Push bildirishnoma", desc: "Ilova orqali", on: false },
    ],
  },
  {
    section: "TIZIM",
    rows: [
      { id: "repeat", icon: RefreshCw, label: "Avtomatik takrorlash", desc: "Javob bermaganlarga qayta yuborish", on: true },
      { id: "test", icon: FlaskConical, label: "Sinov rejimi", desc: "Haqiqiy xabar yuborilmaydi", on: false },
    ],
  },
];

export default function Page() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(
      INITIAL.flatMap((s) => s.rows.map((r) => [r.id, r.on]))
    )
  );

  return (
    <div className="flex flex-col gap-5 px-4 pb-5 pt-2.5">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-[20px] font-bold text-tx">Sozlamalar</h1>
        <span className="text-[13px] font-medium text-dim">
          Tizim va kanal sozlamalari
        </span>
      </header>

      {/* settlement row */}
      <div className="flex items-center gap-3 rounded-sharp border border-border bg-surface p-[13px]">
        <div className="flex h-10 w-10 items-center justify-center rounded-sharp bg-brand-bg">
          <MapPin size={20} className="text-brand" />
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-[14.5px] font-semibold text-tx">
            {"Oqtepa qishlog'i"}
          </span>
          <span className="text-[12px] text-dim">1 284 aholi · 1 hudud</span>
        </div>
        <ChevronRight size={18} className="text-faint" />
      </div>

      {INITIAL.map(({ section, rows }) => (
        <div key={section} className="flex flex-col gap-2.5">
          <p className="px-0.5 text-[11px] font-semibold tracking-[0.15em] text-faint">
            {section}
          </p>
          <div className="flex flex-col rounded-sharp border border-border bg-surface px-3.5">
            {rows.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={r.id}>
                  {i > 0 && <Separator className="bg-border" />}
                  <div className="flex items-center gap-3 py-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-sharp bg-surface-2">
                      <Icon size={18} className="text-dim" />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="text-[14px] font-semibold text-tx">
                        {r.label}
                      </span>
                      <span className="text-[12px] text-dim">{r.desc}</span>
                    </div>
                    <Switch
                      checked={state[r.id]}
                      onCheckedChange={(v) =>
                        setState((s) => ({ ...s, [r.id]: v }))
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="pt-1 text-center text-[12px] text-faint">
        Ogohlantirish tizimi · v0.1
      </p>
    </div>
  );
}
