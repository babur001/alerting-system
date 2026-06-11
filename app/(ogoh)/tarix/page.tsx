"use client";

// Tarix — alert log + per-person delivery status detail.
// Ported from the Claude Design rebuild (history.jsx).

import { useState } from "react";
import { ChevronRight, Siren, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOgoh } from "@/components/ogoh/provider";
import { Kicker, OgAvatar, OgSheet, StatusTag } from "@/components/ogoh/ui";
import { fmtDateTime, type AlertRecord, type DeliveryStatus } from "@/lib/ogoh/data";

function AlertDetail({ alert, onClose }: { alert: AlertRecord; onClose: () => void }) {
  const recips = alert.recipients;
  const sTag = (st: DeliveryStatus) => {
    if (st === "delivered") return <StatusTag kind="ok">Yetkazildi</StatusTag>;
    if (st === "failed") return <StatusTag kind="crit">Xato</StatusTag>;
    return <StatusTag kind="warn">Yuborildi</StatusTag>;
  };
  const stats: [number, string, string][] = [
    [alert.total, "YUBORILDI", "text-og-ink"],
    [alert.delivered, "YETKAZILDI", "text-og-green"],
    [alert.failed, "XATO", alert.failed ? "text-og-red" : "text-og-dim"],
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-start justify-between px-4.5 pt-1 pb-3">
        <div>
          <StatusTag kind={alert.kind}>
            {alert.test ? "SINOV" : "DARAJA: " + alert.level.toUpperCase()}
          </StatusTag>
          <div className="mt-2 text-lg font-bold text-og-ink">{alert.objectName}</div>
          <div className="mt-0.5 font-mono text-[11px] text-og-dim2">
            {fmtDateTime(alert.ts)} · operator {alert.operator}
          </div>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-[9px] bg-og-panel2 text-og-dim"
          onClick={onClose}
          aria-label="Yopish"
        >
          <X className="size-[17px]" />
        </Button>
      </div>

      <div className="overflow-y-auto px-4.5 pb-1">
        {/* summary stats */}
        <div className="mb-3.5 flex gap-2">
          {stats.map(([n, l, c], i) => (
            <div
              key={i}
              className="flex-1 rounded-xl border border-og-line2 bg-og-bg2 px-2.5 py-3 text-center"
            >
              <div className={`font-mono text-[22px] font-bold ${c}`}>{n}</div>
              <div className="mt-[3px] font-mono text-[8.5px] tracking-[0.08em] text-og-dim2">{l}</div>
            </div>
          ))}
        </div>
        <div className="mb-3.5 rounded-xl border border-og-line2 bg-og-bg2 p-[13px]">
          <Kicker className="mb-1.5">YUBORILGAN MATN</Kicker>
          <div className="text-[13px] leading-normal text-og-ink">{alert.msg}</div>
        </div>

        {recips ? (
          <>
            <Kicker className="mb-2 px-0.5">QABUL QILUVCHILAR · {recips.length}</Kicker>
            <div className="mb-2 overflow-hidden rounded-[14px] border border-og-line2 bg-og-panel">
              {recips.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-[11px] px-[13px] py-2.5 ${
                    i < recips.length - 1 ? "border-b border-og-line2" : ""
                  }`}
                >
                  <OgAvatar name={r.name} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium text-og-ink">{r.name}</div>
                    <div className="font-mono text-[10.5px] text-og-dim2">{r.phone}</div>
                  </div>
                  {sTag(r.status)}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-4 text-center font-mono text-[11px] text-og-dim2">
            Qabul qiluvchilar tafsiloti arxivlangan
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const { alerts } = useOgoh();
  const [open, setOpen] = useState<AlertRecord | null>(null);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4.5 pt-2.5 pb-2">
        <div className="text-[26px] font-bold text-og-ink">Tarix</div>
        <div className="mt-px font-mono text-[11px] text-og-dim2">
          {alerts.length} ta ogohlantirish qaydi
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3.5 pt-1.5 pb-3">
        {alerts.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-og-dim2">
            Hali ogohlantirishlar yoʻq
          </div>
        )}
        {alerts.map((a) => (
          <button
            type="button"
            key={a.id}
            onClick={() => a.recipients !== undefined && setOpen(a)}
            className={`mb-2.5 block w-full rounded-[14px] border border-og-line2 bg-og-panel p-3.5 text-left ${
              a.recipients ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <div className="mb-2.5 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] ${
                    a.kind === "crit" ? "bg-og-red-soft" : "bg-og-amber-soft"
                  }`}
                >
                  <Siren size={20} className={a.kind === "crit" ? "text-og-red" : "text-og-amber"} />
                </span>
                <div>
                  <div className="text-[15px] font-semibold text-og-ink">
                    {a.objectName.split(" suv")[0]}
                  </div>
                  <div className="mt-px font-mono text-[10.5px] text-og-dim2">{fmtDateTime(a.ts)}</div>
                </div>
              </div>
              <StatusTag kind={a.kind}>{a.test ? "SINOV" : a.level.toUpperCase()}</StatusTag>
            </div>
            <div className="flex gap-4 border-t border-og-line2 pt-2.5 font-mono text-[11px] text-og-dim">
              <span>{a.total} yuborildi</span>
              <span className="text-og-green">{a.delivered} yetkazildi</span>
              {a.failed > 0 && <span className="text-og-red">{a.failed} xato</span>}
              {a.recipients && (
                <span className="ml-auto flex items-center gap-[3px] text-og-dim2">
                  Tafsilot <ChevronRight size={13} />
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      <OgSheet
        open={!!open}
        onOpenChange={(o) => !o && setOpen(null)}
        title="Ogohlantirish tafsiloti"
      >
        {open && <AlertDetail alert={open} onClose={() => setOpen(null)} />}
      </OgSheet>
    </div>
  );
}
