"use client";

// Trevoga — fire button, confirm sheet, live SMS sending overlay.
// Ported from the Claude Design rebuild (siren.jsx).

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Droplet, Siren, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOgoh } from "@/components/ogoh/provider";
import {
  Kicker,
  OgAvatar,
  OgSheet,
  SirenGlyph,
  StatusTag,
  TickRing,
} from "@/components/ogoh/ui";
import { type AlertRecipient, type Person } from "@/lib/ogoh/data";

// ── Fire button (single tap → confirm step) ───────────────────
function FireButton({ onArmed, disabled }: { onArmed: () => void; disabled: boolean }) {
  const [press, setPress] = useState(false);
  const fire = () => {
    if (disabled) return;
    navigator.vibrate?.(12);
    onArmed();
  };
  const accent = "#FF4632";
  const g1 = "#ff7a68";
  const g3 = "#c41d10";

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex h-64 w-64 items-center justify-center ${disabled ? "opacity-40" : ""}`}
      >
        {/* idle pulse ring */}
        {!disabled && (
          <span
            className="animate-og-ring absolute h-[200px] w-[200px] rounded-full border-2"
            style={{ borderColor: accent }}
          />
        )}
        <TickRing size={256} count={72} color={accent} active={0} />
        <button
          type="button"
          onClick={fire}
          onPointerDown={() => !disabled && setPress(true)}
          onPointerUp={() => setPress(false)}
          onPointerLeave={() => setPress(false)}
          onPointerCancel={() => setPress(false)}
          aria-label="Trevoga yuborish"
          className="flex h-[178px] w-[178px] touch-manipulation flex-col items-center justify-center gap-[7px] rounded-full border-none p-0 text-white select-none"
          style={{
            cursor: disabled ? "default" : "pointer",
            background: `radial-gradient(circle at 40% 32%, ${g1}, ${accent} 60%, ${g3})`,
            boxShadow: `0 0 ${press ? 60 : 30}px ${accent}${press ? "cc" : "88"}, 0 0 0 1px ${g1}, inset 0 6px 22px rgba(255,255,255,0.4), inset 0 -12px 30px rgba(120,8,0,0.55)`,
            transform: press ? "scale(0.955)" : "scale(1)",
            transition: "transform .12s, box-shadow .15s",
          }}
        >
          <SirenGlyph size={56} color="#fff" stroke={5} />
          <span className="font-mono text-base leading-none font-bold tracking-[3px]">
            TREVOGA
          </span>
          <span className="font-mono text-[9.5px] font-medium tracking-[1.5px] text-white/80">
            BOSING
          </span>
        </button>
      </div>
      <div className="mt-4 text-center font-mono text-[10.5px] tracking-[0.13em] text-og-dim2">
        BOSIB OGOHLANTIRISHNI YUBORING
      </div>
    </div>
  );
}

// ── Sending overlay (streams per-person status) ───────────────
function SendingOverlay({
  open,
  recipients,
  onDone,
}: {
  open: boolean;
  recipients: Person[];
  onDone: (results: AlertRecipient[]) => void;
}) {
  const [statuses, setStatuses] = useState<
    Record<string, "sent" | "delivered" | "failed">
  >({});
  const [phase, setPhase] = useState<"send" | "done">("send");
  const resultsRef = useRef<AlertRecipient[]>([]);

  useEffect(() => {
    if (!open) {
      setStatuses({});
      setPhase("send");
      return;
    }
    let cancelled = false;
    const results: Record<string, "delivered" | "failed"> = {};
    const timers = recipients.flatMap((r, i) => [
      setTimeout(
        () => {
          if (!cancelled) setStatuses((s) => ({ ...s, [r.id]: "sent" }));
        },
        120 + i * 95,
      ),
      setTimeout(
        () => {
          if (cancelled) return;
          const failed = Math.random() < 0.07;
          results[r.id] = failed ? "failed" : "delivered";
          setStatuses((s) => ({ ...s, [r.id]: failed ? "failed" : "delivered" }));
        },
        520 + i * 95,
      ),
    ]);
    timers.push(
      setTimeout(
        () => {
          if (cancelled) return;
          resultsRef.current = recipients.map((r) => ({
            id: r.id,
            name: r.name,
            phone: r.phone,
            level: r.level,
            status: results[r.id] || "delivered",
          }));
          setPhase("done");
        },
        700 + recipients.length * 95,
      ),
    );
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [open, recipients]);

  if (!open) return null;
  const sentCount = Object.keys(statuses).length;
  const delivered = Object.values(statuses).filter((s) => s === "delivered").length;
  const failed = Object.values(statuses).filter((s) => s === "failed").length;

  const sIcon = (st?: string) => {
    if (st === "delivered")
      return <Check size={16} strokeWidth={2.4} className="text-og-green" />;
    if (st === "failed") return <X size={15} strokeWidth={2.4} className="text-og-red" />;
    if (st === "sent")
      return (
        <span className="font-mono text-[9.5px] tracking-[0.05em] text-og-amber">
          SMS…
        </span>
      );
    return <span className="h-3.5 w-3.5 rounded-full border-2 border-og-line" />;
  };

  return (
    <div className="animate-in fade-in absolute inset-0 z-50 flex flex-col bg-og-bg duration-200">
      <div className="px-5 pt-2 pb-3.5 text-center">
        {phase === "send" ? (
          <>
            <div className="mb-2 inline-flex">
              <span className="animate-og-pulse flex h-[46px] w-[46px] items-center justify-center rounded-full bg-og-red-soft">
                <Siren size={24} className="text-og-red" />
              </span>
            </div>
            <div className="text-[19px] font-bold text-og-ink">
              Ogohlantirish yuborilmoqda
            </div>
            <div className="mt-1 font-mono text-xs text-og-dim">
              {sentCount} / {recipients.length} abonent
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 inline-flex">
              <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-og-green-soft">
                <Check size={26} strokeWidth={2.6} className="text-og-green" />
              </span>
            </div>
            <div className="text-[19px] font-bold text-og-ink">
              Ogohlantirish yuborildi
            </div>
            <div className="mt-1 font-mono text-xs text-og-dim">
              <span className="text-og-green">{delivered} yetkazildi</span> ·{" "}
              {failed > 0 ? <span className="text-og-red">{failed} xato</span> : "0 xato"}
            </div>
          </>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3.5 py-1">
        {recipients.map((r) => {
          const st = statuses[r.id];
          return (
            <div
              key={r.id}
              className={`flex items-center gap-[11px] border-b border-og-line2 px-2.5 py-[9px] transition-opacity duration-200 ${st ? "opacity-100" : "opacity-40"}`}
            >
              <OgAvatar name={r.name} size={32} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-medium text-og-ink">
                  {r.name}
                </div>
                <div className="font-mono text-[10.5px] text-og-dim2">{r.phone}</div>
              </div>
              <div className="flex min-w-10 justify-end">{sIcon(st)}</div>
            </div>
          );
        })}
      </div>
      {phase === "done" && (
        <div className="border-t border-og-line px-4.5 pt-3 pb-6">
          <Button
            className="h-12 w-full rounded-[13px] bg-og-ink text-[15px] font-semibold text-og-bg hover:bg-og-ink/90"
            onClick={() => onDone(resultsRef.current)}
          >
            Tayyor
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Screen ────────────────────────────────────────────────────
export default function Page() {
  const router = useRouter();
  const { obj, objects, people, message, setObjId, addAlert } = useOgoh();
  const [confirm, setConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [pickObj, setPickObj] = useState(false);

  const recipients = people.filter((p) => p.objectId === obj.id && p.active);

  const fire = () => {
    setConfirm(false);
    setSending(true);
  };

  const finishSend = (results: AlertRecipient[]) => {
    setSending(false);
    addAlert({
      id: "a" + Date.now(),
      objectId: obj.id,
      objectName: obj.name,
      ts: Date.now(),
      level: "Qizil",
      kind: "crit",
      total: results.length,
      delivered: results.filter((r) => r.status === "delivered").length,
      failed: results.filter((r) => r.status === "failed").length,
      msg: message,
      operator: "A. Karimov",
      recipients: results,
    });
    router.push("/tarix");
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* header */}
      <div className="flex items-center justify-between border-b border-og-line2 px-4.5 py-5">
        <div className="flex items-center gap-[9px]">
          <SirenGlyph size={20} color="#FF4632" stroke={5} />
          <span className="font-mono text-[15px] font-bold tracking-[3px] text-og-ink">
            OGOH
          </span>
        </div>
        <StatusTag kind="ok">TIZIM ONLAYN</StatusTag>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* object selector */}
        <button
          type="button"
          onClick={() => setPickObj(true)}
          className="flex w-full items-center justify-between px-4.5 pt-3.5 pb-1 text-left"
        >
          <div className="flex items-center gap-[7px]">
            <span className="text-xl font-bold text-og-ink">{obj.name}</span>
            <ChevronDown size={17} className="translate-y-px text-og-dim2" />
          </div>
        </button>

        {/* siren */}
        <div className="flex flex-1 flex-col items-center justify-center px-4.5 py-3.5">
          <FireButton
            onArmed={() => setConfirm(true)}
            disabled={recipients.length === 0}
          />
        </div>

        {/* recipients readout */}
        <div className="mx-3.5 mb-3 flex items-center justify-between rounded-[14px] border border-og-line2 bg-og-panel p-3.5">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[28px] leading-none font-bold text-og-ink">
              {recipients.length}
            </span>
            <span className="text-[12.5px] text-og-dim">
              faol abonent ogohlantiriladi
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-5.5 w-1.5 rounded-[2px] ${i < Math.ceil(recipients.length / 5) ? "bg-og-green" : "bg-[#3a3f48]"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* confirm sheet */}
      <OgSheet
        open={confirm}
        onOpenChange={setConfirm}
        title="Ogohlantirishni tasdiqlash"
      >
        <div className="px-5.5 pt-1.5 pb-1">
          <div className="mb-3.5 flex items-center gap-[11px]">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-og-red-soft">
              <Siren size={24} className="text-og-red" />
            </span>
            <div className="text-lg font-bold text-og-ink">
              Ogohlantirish yuborilsinmi?
            </div>
          </div>
          <div className="mb-3 rounded-xl border border-og-line2 bg-og-bg2 p-[13px]">
            <Kicker className="mb-1.5">SMS MATNI</Kicker>
            <div className="text-[13px] leading-normal text-og-ink">{message}</div>
          </div>
          <div className="mb-4 flex items-center justify-between px-0.5">
            <span className="text-[13.5px] text-og-dim">Qabul qiluvchilar</span>
            <span className="font-mono text-[15px] font-bold text-og-ink">
              {recipients.length} abonent
            </span>
          </div>
          <div className="flex gap-2.5">
            <Button
              variant="secondary"
              className="h-12 flex-1 rounded-[13px] border border-og-line bg-og-panel2 text-[15px] font-semibold text-og-ink"
              onClick={() => setConfirm(false)}
            >
              Bekor qilish
            </Button>
            <Button
              className="h-12 flex-[1.4] rounded-[13px] bg-og-red text-[15px] font-semibold text-white hover:bg-og-red/90"
              onClick={fire}
            >
              <Siren className="size-[18px]" /> YUBORISH
            </Button>
          </div>
        </div>
      </OgSheet>

      {/* object picker */}
      <OgSheet open={pickObj} onOpenChange={setPickObj} title="Obyektni tanlang">
        <div className="px-4.5 pt-1.5 pb-1">
          <div className="mb-1 px-1 text-[17px] font-bold text-og-ink">
            Obyektni tanlang
          </div>
          {objects.map((o) => {
            const cnt = people.filter((p) => p.objectId === o.id && p.active).length;
            const sel = o.id === obj.id;
            return (
              <button
                type="button"
                key={o.id}
                onClick={() => {
                  setObjId(o.id);
                  setPickObj(false);
                }}
                className={`mt-1.5 flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                  sel
                    ? "border-og-line bg-og-panel2"
                    : "border-transparent bg-transparent"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-og-line2 bg-og-bg2">
                  <Droplet
                    size={19}
                    className={o.status === "warn" ? "text-og-amber" : "text-og-dim"}
                  />
                </span>
                <div className="flex-1">
                  <div className="text-[14.5px] font-semibold text-og-ink">{o.name}</div>
                  <div className="font-mono text-[10.5px] text-og-dim2">
                    {o.region} · {cnt} abonent
                  </div>
                </div>
                {sel && <Check size={18} strokeWidth={2.4} className="text-og-green" />}
              </button>
            );
          })}
        </div>
      </OgSheet>

      <SendingOverlay open={sending} recipients={recipients} onDone={finishSend} />
    </div>
  );
}
