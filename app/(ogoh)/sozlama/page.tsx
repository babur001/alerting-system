"use client";

// Sozlama — SMS template, levels, objects, system rows.
// Ported from the Claude Design rebuild (mapsettings.jsx).

import { useState } from "react";
import {
  Check,
  ChevronRight,
  Droplet,
  Globe,
  MessageSquare,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useOgoh } from "@/components/ogoh/provider";
import { Kicker, OgSheet } from "@/components/ogoh/ui";
import type { Lang, WaterObject } from "@/lib/ogoh/data";

function ObjectForm({
  onSave,
  onClose,
}: {
  onSave: (data: Omit<WaterObject, "id">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const valid = name.trim().length > 1 && region.trim().length > 1;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4.5 pt-1 pb-3">
        <div className="text-lg font-bold text-og-ink">Obyekt qoʻshish</div>
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
      <div className="overflow-y-auto px-4.5">
        <label className="mb-3.5 block">
          <Kicker className="mb-1.5">NOMI</Kicker>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chorvoq suv ombori"
            className="h-12 rounded-[11px] border-og-line bg-og-bg2 px-[13px] text-[15px] text-og-ink"
          />
        </label>
        <label className="mb-3.5 block">
          <Kicker className="mb-1.5">HUDUD / VILOYAT</Kicker>
          <Input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Toshkent viloyati"
            className="h-12 rounded-[11px] border-og-line bg-og-bg2 px-[13px] text-[15px] text-og-ink"
          />
        </label>
        <div className="mb-3.5 font-mono text-[10.5px] leading-relaxed text-og-dim2">
          Qoʻshilgandan soʻng tizim shu obyektga oʻtadi — abonentlarni Aholi boʻlimida qoʻshing.
        </div>
      </div>
      <div className="border-t border-og-line px-4.5 pt-3 pb-1">
        <Button
          disabled={!valid}
          className="h-12 w-full rounded-[13px] bg-og-ink text-[15px] font-semibold text-og-bg hover:bg-og-ink/90"
          onClick={() => onSave({ name: name.trim(), region: region.trim(), level: 50, status: "ok" })}
        >
          Qoʻshish
        </Button>
      </div>
    </div>
  );
}

function MsgEditor({
  value,
  onSave,
  onClose,
}: {
  value: string;
  onSave: (t: string) => void;
  onClose: () => void;
}) {
  const [txt, setTxt] = useState(value);
  const segs = Math.max(1, Math.ceil(txt.length / 153));
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4.5 pt-1 pb-3">
        <div className="text-lg font-bold text-og-ink">SMS shabloni</div>
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
      <div className="flex flex-1 flex-col px-4.5">
        <Textarea
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          rows={6}
          className="min-h-36 resize-none rounded-xl border-og-line bg-og-bg2 p-3.5 text-sm leading-normal text-og-ink"
        />
        <div className="mt-2 flex justify-between font-mono text-[10.5px] text-og-dim2">
          <span>{txt.length} belgi</span>
          <span>{segs} SMS</span>
        </div>
        <div className="mt-3.5 font-mono text-[10.5px] leading-relaxed text-og-dim2">
          Bu matn QIZIL daraja ogohlantirishida barcha faol abonentlarga yuboriladi.
        </div>
      </div>
      <div className="border-t border-og-line px-4.5 pt-3 pb-1">
        <Button
          className="h-12 w-full rounded-[13px] bg-og-ink text-[15px] font-semibold text-og-bg hover:bg-og-ink/90"
          onClick={() => onSave(txt)}
        >
          Saqlash
        </Button>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  title,
  sub,
  right,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  sub?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3.5 py-[13px] text-left ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] border border-og-line2 bg-og-bg2">
        <Icon size={18} className="text-og-dim" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-medium text-og-ink">{title}</span>
        {sub && <span className="mt-0.5 block truncate font-mono text-[10.5px] text-og-dim2">{sub}</span>}
      </span>
      {right}
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <Kicker className="px-2 pb-2">{title}</Kicker>
      <div className="overflow-hidden rounded-[14px] border border-og-line2 bg-og-panel [&>*+*]:border-t [&>*+*]:border-og-line2">
        {children}
      </div>
    </div>
  );
}

const LANGS: [Lang, string][] = [
  ["lotin", "Oʻzbekcha (Lotin)"],
  ["kirill", "Ўзбекча (Кирилл)"],
  ["rus", "Русский"],
];

export default function Page() {
  const { message, setMessage, objects, people, lang, setLang, addObject } = useOgoh();
  const [editMsg, setEditMsg] = useState(false);
  const [pickLang, setPickLang] = useState(false);
  const [addObj, setAddObj] = useState(false);
  const chev = <ChevronRight size={16} className="shrink-0 text-og-dim2" />;
  const langLabel = LANGS.find((l) => l[0] === lang)?.[1] ?? LANGS[0][1];

  return (
    <div className="flex h-full flex-col">
      <div className="px-4.5 pt-2.5 pb-2">
        <div className="text-[26px] font-bold text-og-ink">Sozlamalar</div>
      </div>
      <div className="flex-1 overflow-y-auto px-3.5 pt-2 pb-4">
        <Group title="OGOHLANTIRISH">
          <Row icon={MessageSquare} title="SMS shabloni" sub={message} right={chev} onClick={() => setEditMsg(true)} />
        </Group>

        <Group title={`OBYEKTLAR · ${objects.length}`}>
          {objects.map((o) => {
            const cnt = people.filter((p) => p.objectId === o.id && p.active).length;
            return (
              <Row
                key={o.id}
                icon={Droplet}
                title={o.name}
                sub={`${o.region} · ${cnt} faol abonent`}
              />
            );
          })}
          <Row
            icon={Plus}
            title="Obyekt qoʻshish"
            sub="Yangi suv ombori / toʻgʻon"
            right={chev}
            onClick={() => setAddObj(true)}
          />
        </Group>

        {/* TIZIM group — hidden for now, un-comment to restore
        <Group title="TIZIM">
          <Row icon={Globe} title="Til / Language" sub={langLabel} right={chev} onClick={() => setPickLang(true)} />
          <Row icon={Settings} title="Operator" sub="A. Karimov · Toshkent FVB" right={chev} />
        </Group>
        */}
      </div>

      <OgSheet open={addObj} onOpenChange={setAddObj} title="Obyekt qoʻshish">
        {addObj && (
          <ObjectForm
            onSave={(data) => {
              addObject(data);
              setAddObj(false);
            }}
            onClose={() => setAddObj(false)}
          />
        )}
      </OgSheet>

      <OgSheet open={editMsg} onOpenChange={setEditMsg} title="SMS shabloni">
        {editMsg && (
          <MsgEditor
            value={message}
            onSave={(t) => {
              setMessage(t);
              setEditMsg(false);
            }}
            onClose={() => setEditMsg(false)}
          />
        )}
      </OgSheet>

      <OgSheet open={pickLang} onOpenChange={setPickLang} title="Til / Language">
        <div className="px-4.5 pt-1.5 pb-1">
          <div className="mb-1.5 px-1 text-[17px] font-bold text-og-ink">Til / Language</div>
          {LANGS.map(([id, lbl]) => (
            <button
              type="button"
              key={id}
              onClick={() => {
                setLang(id);
                setPickLang(false);
              }}
              className={`mt-1.5 flex w-full items-center justify-between rounded-xl border p-3 text-left ${
                lang === id ? "border-og-line bg-og-panel2" : "border-transparent bg-transparent"
              }`}
            >
              <span className="text-[15px] text-og-ink">{lbl}</span>
              {lang === id && <Check size={18} strokeWidth={2.4} className="text-og-green" />}
            </button>
          ))}
          <div className="px-1 pt-3 pb-1 font-mono text-[10px] leading-relaxed text-og-dim2">
            Interfeys tili. SMS matnini istalgan tilda yozish mumkin.
          </div>
        </div>
      </OgSheet>
    </div>
  );
}
