"use client";

import { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { residents, type Zone } from "@/lib/data";

const FILTERS: (Zone | "Hammasi")[] = ["Hammasi", "Daryo bo'yi", "Markaz"];

export default function Page() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Hammasi");

  const list = residents.filter((r) => {
    const matchesZone = filter === "Hammasi" || r.zone === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      r.name.toLowerCase().includes(q) ||
      r.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""));
    return matchesZone && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-4 px-4 pb-5 pt-2.5">
      {/* header */}
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[20px] font-bold text-tx">Aholi</h1>
          <span className="text-[13px] font-medium text-dim">
            {"1 284 ro'yxatga olingan"}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Aholi qo'shish"
          className="h-11 w-11 rounded-sharp border border-[#3a2018] bg-brand-bg text-brand hover:bg-brand-bg"
        >
          <UserPlus className="size-5" />
        </Button>
      </header>

      {/* search */}
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ism yoki telefon raqami..."
          className="h-[46px] rounded-sharp border-border bg-surface pl-10 text-[14px] text-tx placeholder:text-faint focus-visible:border-brand focus-visible:ring-0"
        />
      </div>

      {/* filter chips */}
      <div className="flex items-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <Button
              key={f}
              variant="ghost"
              size="sm"
              onClick={() => setFilter(f)}
              className={`h-9 rounded-sharp border px-3.5 text-[13px] font-medium ${
                active
                  ? "border-brand bg-brand-bg text-brand hover:bg-brand-bg"
                  : "border-border bg-surface text-dim hover:bg-surface"
              }`}
            >
              {f}
            </Button>
          );
        })}
      </div>

      {/* list */}
      <div className="flex flex-col gap-2">
        {list.map((r) => (
          <div
            key={r.phone}
            className="flex items-center gap-3 rounded-sharp border border-border bg-surface p-[11px]"
          >
            {/* sharp avatar */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sharp bg-surface-2 text-[15px] font-bold text-[#aeb4be]">
              {r.initials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-[15px] font-semibold text-tx">{r.name}</span>
              <div className="flex items-center gap-1.5 text-[12px]">
                <span className="text-dim">{r.phone}</span>
                <span className="text-faint">·</span>
                <span
                  className={
                    r.zone === "Daryo bo'yi"
                      ? "font-semibold text-brand"
                      : "font-medium text-faint"
                  }
                >
                  {r.zone}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="gap-1.5 border-border px-2 py-1 font-medium text-dim"
            >
              <span
                className={`size-1.5 rounded-full ${r.active ? "bg-dim" : "bg-faint"}`}
              />
              {r.active ? "Faol" : "Nofaol"}
            </Badge>
          </div>
        ))}

        {list.length === 0 && (
          <p className="py-12 text-center text-[14px] text-faint">Hech kim topilmadi</p>
        )}
      </div>
    </div>
  );
}
