"use client";

import { useRouter } from "next/navigation";
import {
  X,
  Siren,
  Users,
  MessageSquare,
  Phone,
  TriangleAlert,
  ArrowRight,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { Level } from "./console";

type Props = {
  open: boolean;
  onClose: () => void;
  level: Level;
  recipients: string;
};

export default function ConfirmSheet({
  open,
  onClose,
  level,
  recipients,
}: Props) {
  const router = useRouter();

  const rows = [
    { icon: Users, label: "Qabul qiluvchilar", value: `${recipients} aholi` },
    { icon: MessageSquare, label: "SMS xabar", value: `${recipients} ta` },
    { icon: Phone, label: "Ovozli qo'ng'iroq", value: `${recipients} ta` },
  ];

  function handleSend() {
    onClose();
    router.push("/jonli");
  }

  return (
    <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
      <DrawerContent className="mx-auto max-w-[420px] gap-3.5 rounded-t-[10px] border-x border-t border-border bg-surface px-5 pb-6 pt-1">
        {/* header */}
        <div className="flex items-center justify-between pt-1">
          <DrawerTitle className="text-[17px] font-bold text-tx">
            Ogohlantirishni tasdiqlang
          </DrawerTitle>
          <DrawerClose
            aria-label="Bekor qilish"
            className="flex h-8 w-8 items-center justify-center rounded-sharp bg-surface-2"
          >
            <X size={16} className="text-dim" />
          </DrawerClose>
        </div>
        <DrawerDescription className="sr-only">
          {`${level.name} daraja ogohlantirishni ${recipients} aholiga yuborish tasdig'i`}
        </DrawerDescription>

        {/* level block */}
        <div className="flex items-center gap-3.5 rounded-sharp border border-[#3a2018] bg-brand-bg p-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-sharp bg-brand">
            <Siren size={26} className="text-white" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[17px] font-extrabold tracking-wide text-white">
              {level.name.toUpperCase()} DARAJA
            </span>
            <span className="text-[12.5px] font-medium text-[#ffb9a8]">
              Favqulodda suv toshqini xavfi
            </span>
          </div>
        </div>

        {/* details */}
        <div className="flex flex-col">
          {rows.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className={`flex items-center gap-[11px] py-3 ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <Icon size={18} className="text-faint" />
              <span className="flex-1 text-[13.5px] font-medium text-dim">
                {label}
              </span>
              <span className="text-[14px] font-bold text-tx">{value}</span>
            </div>
          ))}
        </div>

        {/* caution */}
        <div className="flex items-center gap-2">
          <TriangleAlert size={16} className="shrink-0 text-brand" />
          <span className="text-[12.5px] font-medium text-dim">
            {"Yuborilgach ortga qaytarib bo'lmaydi."}
          </span>
        </div>

        {/* buttons */}
        <div className="flex gap-2.5">
          <DrawerClose className="flex h-[54px] w-[118px] items-center justify-center rounded-sharp border border-border text-[15px] font-semibold text-dim">
            Bekor
          </DrawerClose>
          <button
            type="button"
            onClick={handleSend}
            className="flex h-[54px] flex-1 items-center justify-center gap-2 rounded-sharp bg-brand text-[16px] font-bold text-white active:brightness-95"
          >
            <ArrowRight size={19} />
            Hozir yuborish
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
