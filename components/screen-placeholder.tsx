import type { LucideIcon } from "lucide-react";

export default function ScreenPlaceholder({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col">
      <header className="px-4 pb-2 pt-2.5">
        <h1 className="text-[20px] font-bold text-tx">{title}</h1>
        <p className="mt-1.5 text-[13px] font-medium text-dim">{subtitle}</p>
      </header>
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-sharp border border-border bg-surface">
          <Icon size={24} className="text-faint" />
        </div>
        <p className="text-[14px] text-faint">Tez orada</p>
      </div>
    </div>
  );
}
