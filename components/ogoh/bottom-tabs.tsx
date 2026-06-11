"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Siren, Users, History, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = { href: string; label: string; icon: LucideIcon };

const TABS: Tab[] = [
  { href: "/", label: "Trevoga", icon: Siren },
  { href: "/aholi", label: "Aholi", icon: Users },
  { href: "/tarix", label: "Tarix", icon: History },
  // Xarita hidden for now — route lives at app/(ogoh)/_xarita
  { href: "/sozlama", label: "Sozlama", icon: Settings },
];

export default function BottomTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex shrink-0 items-start justify-around border-t border-og-line bg-og-bg2 px-1.5 pt-2 pb-[max(env(safe-area-inset-bottom),22px)]">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-1 px-1 py-0.5"
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.1 : 1.8}
              className={active ? "text-og-red" : "text-og-dim2"}
            />
            <span
              className={cn(
                "font-mono text-[9px] tracking-[0.04em]",
                active ? "font-semibold text-og-ink" : "text-og-dim2"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
