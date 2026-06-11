"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Siren, Users, History, Settings, type LucideIcon } from "lucide-react";

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** routes that should light up this tab */
  match: string[];
};

const tabs: Tab[] = [
  { href: "/", label: "Boshqaruv", icon: Siren, match: ["/", "/buttons", "/jonli"] },
  { href: "/aholi", label: "Aholi", icon: Users, match: ["/aholi"] },
  { href: "/tarix", label: "Tarix", icon: History, match: ["/tarix"] },
  { href: "/sozlama", label: "Sozlama", icon: Settings, match: ["/sozlama"] },
];

export default function TabBar() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((t) => t.match.includes(pathname));

  return (
    // pointer-events-none so the transparent padding lets scroll/taps fall
    // through to the content scrolling behind the floating bar
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-4 pb-4 pt-2">
      <div className="pointer-events-auto relative flex rounded-[31px] border border-border bg-surface/95 p-1.5 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.55)] backdrop-blur-md">
        {/* sliding active background — animates to the current tab on click */}
        <span
          aria-hidden
          className={`absolute bottom-1.5 left-1.5 top-1.5 rounded-[20px] bg-brand-bg transition-transform duration-300 ease-out ${
            activeIndex < 0 ? "opacity-0" : "opacity-100"
          }`}
          style={{
            width: "calc((100% - 0.75rem) / 4)",
            transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
          }}
        />

        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match.includes(pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="relative z-10 flex flex-1 flex-col items-center gap-[3px] rounded-[20px] py-[9px]"
            >
              <Icon
                size={21}
                strokeWidth={2}
                className={`transition-colors ${
                  active ? "text-brand" : "text-faint"
                }`}
              />
              <span
                className={`text-[10px] leading-none transition-colors ${
                  active ? "font-semibold text-tx" : "font-medium text-faint"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
