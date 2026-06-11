"use client";

// Aholi — directory by danger level, search, active toggle, add/edit.
// Ported from the Claude Design rebuild (people.jsx).

import { useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useOgoh } from "@/components/ogoh/provider";
import { Dot, Kicker, OgAvatar, OgSheet, riskColor } from "@/components/ogoh/ui";
import { LEVELS, levelInfo, type DangerLevel, type Person } from "@/lib/ogoh/data";

// selected-state styling per danger level (3 = red … 1 = green)
const LEVEL_SEL: Record<DangerLevel, string> = {
  3: "border-og-red bg-og-red-soft text-og-red",
  2: "border-og-amber bg-og-amber-soft text-og-amber",
  1: "border-og-green bg-og-green-soft text-og-green",
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  mono,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  type?: string;
}) {
  return (
    <label className="mb-3.5 block">
      <Kicker className="mb-1.5">{label}</Kicker>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        inputMode={mono ? "tel" : undefined}
        className={`h-12 rounded-[11px] border-og-line bg-og-bg2 px-[13px] text-[15px] text-og-ink ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}

type FormState = { mode: "add" } | { mode: "edit"; person: Person };

function PersonForm({
  initial,
  objName,
  onSave,
  onDelete,
  onClose,
}: {
  initial: Person | null;
  objName: string;
  onSave: (data: Omit<Person, "id" | "objectId">) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [phone, setPhone] = useState(initial?.phone || "+998 ");
  const [level, setLevel] = useState<DangerLevel>(initial?.level ?? 3);
  const [active, setActive] = useState(initial?.active ?? true);
  const editing = !!initial;
  const valid = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 9;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4.5 pt-1 pb-3">
        <div className="text-lg font-bold text-og-ink">
          {editing ? "Abonentni tahrirlash" : "Abonent qoʻshish"}
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
      <div className="overflow-y-auto px-4.5">
        <Field label="Ism familiya" value={name} onChange={setName} placeholder="Akmal Karimov" />
        <Field
          label="Telefon raqami"
          value={phone}
          onChange={setPhone}
          placeholder="+998 90 123 45 67"
          mono
          type="tel"
        />
        <Kicker className="mb-[7px]">XAVF DARAJASI</Kicker>
        <div className="mb-2 flex gap-2">
          {[...LEVELS].reverse().map((l) => {
            const sel = level === l.level;
            return (
              <button
                type="button"
                key={l.level}
                onClick={() => setLevel(l.level)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl border px-2 py-2.5 transition-colors ${
                  sel ? LEVEL_SEL[l.level] : "border-og-line bg-transparent text-og-dim2"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Dot color={riskColor(l.risk)} size={7} />
                  <span className="font-mono text-base font-bold">{l.level}</span>
                </span>
                <span className="text-[11px] font-semibold">{l.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mb-4 font-mono text-[10.5px] leading-relaxed text-og-dim2">
          {levelInfo(level).desc}
        </div>
        <div className="mb-3.5 flex items-center justify-between rounded-xl border border-og-line2 bg-og-bg2 p-3.5">
          <div>
            <div className="text-[14.5px] font-semibold text-og-ink">Faol holat</div>
            <div className="mt-0.5 font-mono text-[10.5px] text-og-dim2">
              {active ? "Ogohlantirish oladi" : "Ogohlantirishdan chiqarilgan"}
            </div>
          </div>
          <Switch
            checked={active}
            onCheckedChange={setActive}
            className="h-[26px] w-11 data-checked:bg-og-green data-unchecked:bg-[#3a3f48] [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:bg-white"
          />
        </div>
        <div className="mb-3.5 font-mono text-[10.5px] text-og-dim2">OBYEKT: {objName}</div>
      </div>
      <div className="flex gap-2.5 border-t border-og-line px-4.5 pt-3 pb-1">
        {editing && (
          <Button
            variant="secondary"
            className="h-12 shrink-0 rounded-[13px] border border-og-red/30 bg-og-panel2 px-[15px] text-og-red"
            onClick={onDelete}
            aria-label="Oʻchirish"
          >
            <Trash2 className="size-[18px]" />
          </Button>
        )}
        <Button
          disabled={!valid}
          className="h-12 flex-1 rounded-[13px] bg-og-ink text-[15px] font-semibold text-og-bg hover:bg-og-ink/90"
          onClick={() => onSave({ name: name.trim(), phone: phone.trim(), level, active })}
        >
          {editing ? "Saqlash" : "Qoʻshish"}
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  const { obj, people, addPerson, updatePerson, deletePerson, togglePerson } = useOgoh();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState<FormState | null>(null);

  const mine = people.filter((p) => p.objectId === obj.id);
  const filtered = mine.filter((p) => {
    if (filter === "active" && !p.active) return false;
    if (filter !== "all" && filter !== "active" && p.level !== Number(filter)) return false;
    if (q && !(p.name.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q))) return false;
    return true;
  });
  // most dangerous group first (LEVELS is ordered 3 → 1)
  const grouped = LEVELS.map((l) => ({
    info: l,
    items: filtered.filter((p) => p.level === l.level),
  })).filter((g) => g.items.length);
  const activeCount = mine.filter((p) => p.active).length;

  const chips: [string, string][] = [
    ["all", "Barchasi"],
    ["active", "Faol"],
    ...LEVELS.map((l) => [String(l.level), l.name] as [string, string]),
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="px-4.5 pt-2.5 pb-2.5">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[26px] font-bold tracking-[0.01em] text-og-ink">Aholi</div>
            <div className="mt-px font-mono text-[11px] text-og-dim2">
              {obj.name.split(" ")[0]} · {activeCount}/{mine.length} faol
            </div>
          </div>
          <Button
            size="icon-lg"
            className="size-10 rounded-[11px] bg-og-ink text-og-bg hover:bg-og-ink/90"
            onClick={() => setForm({ mode: "add" })}
            aria-label="Abonent qoʻshish"
          >
            <Plus className="size-[22px]" strokeWidth={2.4} />
          </Button>
        </div>
      </div>

      {/* search */}
      <div className="px-4.5 pb-2.5">
        <div className="flex items-center gap-[9px] rounded-[11px] border border-og-line2 bg-og-bg2 px-3 py-[9px]">
          <Search size={17} className="text-og-dim2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ism yoki raqam boʻyicha qidirish"
            className="flex-1 border-none bg-transparent text-sm text-og-ink outline-none placeholder:text-og-dim2"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} className="flex" aria-label="Tozalash">
              <X size={15} className="text-og-dim2" />
            </button>
          )}
        </div>
      </div>

      {/* filter chips */}
      <div className="flex gap-[7px] overflow-x-auto px-4.5 pb-2">
        {chips.map(([id, lbl]) => (
          <button
            type="button"
            key={id}
            onClick={() => setFilter(id)}
            className={`shrink-0 rounded-[18px] border px-[13px] py-[7px] text-[12.5px] font-semibold whitespace-nowrap ${
              filter === id
                ? "border-og-ink bg-og-ink text-og-bg"
                : "border-og-line bg-transparent text-og-dim"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-1 pb-3">
        {grouped.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-og-dim2">Hech narsa topilmadi</div>
        )}
        {grouped.map(({ info, items }) => (
          <div key={info.level} className="mb-2.5">
            <div className="flex items-center gap-[7px] px-2 pt-2.5 pb-[7px]">
              <Dot color={riskColor(info.risk)} size={7} />
              <Kicker>
                {info.name} · {info.label}
              </Kicker>
              <span className="font-mono text-[10.5px] text-og-dim2">· {items.length}</span>
            </div>
            <div className="overflow-hidden rounded-[14px] border border-og-line2 bg-og-panel">
              {items.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => setForm({ mode: "edit", person: p })}
                  className={`flex cursor-pointer items-center gap-[11px] px-[13px] py-[11px] ${
                    i < items.length - 1 ? "border-b border-og-line2" : ""
                  } ${p.active ? "opacity-100" : "opacity-50"}`}
                >
                  <OgAvatar name={p.name} size={38} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-semibold text-og-ink">{p.name}</div>
                    <div className="font-mono text-[11px] text-og-dim2">{p.phone}</div>
                  </div>
                  <span onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={p.active}
                      onCheckedChange={(v) => togglePerson(p.id, v)}
                      aria-label={`${p.name} faol holati`}
                      className="h-[26px] w-11 data-checked:bg-og-green data-unchecked:bg-[#3a3f48] [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:bg-white"
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <OgSheet
        open={!!form}
        onOpenChange={(o) => !o && setForm(null)}
        title={form?.mode === "edit" ? "Abonentni tahrirlash" : "Abonent qoʻshish"}
      >
        {form && (
          <PersonForm
            initial={form.mode === "edit" ? form.person : null}
            objName={obj.name}
            onSave={(data) => {
              if (form.mode === "edit") updatePerson(form.person.id, data);
              else addPerson({ ...data, objectId: obj.id });
              setForm(null);
            }}
            onDelete={() => {
              if (form.mode === "edit") deletePerson(form.person.id);
              setForm(null);
            }}
            onClose={() => setForm(null)}
          />
        )}
      </OgSheet>
    </div>
  );
}
