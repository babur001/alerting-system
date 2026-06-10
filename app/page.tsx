import { Bell } from "lucide-react";
import Console from "@/components/console";

export default function Page() {
  return (
    <div className="flex flex-col justify-between h-full">
      <header className="flex items-center justify-between px-4 pb-2 pt-2.5">
        <h1 className="text-[20px] font-bold text-tx">{"Oqtepa qishlog'i"}</h1>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="text-sm font-medium text-dim">1 284 aholi</span>
        </div>
      </header>

      <Console />
    </div>
  );
}
