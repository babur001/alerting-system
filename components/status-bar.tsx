import { SignalHigh, Wifi, BatteryMedium } from "lucide-react";

export default function StatusBar() {
  return (
    <div className="flex h-[54px] shrink-0 items-center justify-between px-[22px] text-tx">
      <span className="text-[15px] font-bold tabular-nums">09:42</span>
      <div className="flex items-center gap-[7px]">
        <SignalHigh size={18} strokeWidth={2.25} />
        <Wifi size={18} strokeWidth={2.25} />
        <BatteryMedium size={18} strokeWidth={2.25} />
      </div>
    </div>
  );
}
