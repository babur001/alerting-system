"use client";

import { X, CircleStop, TriangleAlert } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type Props = {
  pending: string;
  onConfirm: () => void;
};

export default function StopSending({ pending, onConfirm }: Props) {
  return (
    <Drawer>
      <DrawerTrigger className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-sharp border border-[#5a2a22] bg-surface text-[16px] font-semibold text-brand active:brightness-95">
        <CircleStop size={20} />
        Yuborishni to&apos;xtatish
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-w-md gap-3.5 rounded-t-[10px] border-x border-t border-border bg-surface px-5 pb-6 pt-1">
        {/* header */}
        <div className="flex items-center justify-between pt-1">
          <DrawerTitle className="text-[17px] font-bold text-tx">
            Yuborishni to&apos;xtatasizmi?
          </DrawerTitle>
          <DrawerClose
            aria-label="Yopish"
            className="flex h-8 w-8 items-center justify-center rounded-sharp bg-surface-2"
          >
            <X size={16} className="text-dim" />
          </DrawerClose>
        </div>
        <DrawerDescription className="sr-only">
          Yuborishni to&apos;xtatish tasdig&apos;i
        </DrawerDescription>

        {/* warning */}
        <div className="flex items-center gap-3.5 rounded-sharp border border-[#3a2018] bg-brand-bg p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sharp bg-brand">
            <TriangleAlert size={22} className="text-white" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-bold text-tx">
              {pending} aholiga hali yuborilmagan
            </span>
            <span className="text-[12.5px] font-medium text-dim">
              {"To'xtatilsa, ular ogohlantirishni olmaydi."}
            </span>
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-2.5">
          <DrawerClose className="flex h-[54px] w-[118px] items-center justify-center rounded-sharp border border-border text-[15px] font-semibold text-dim">
            Bekor
          </DrawerClose>
          <DrawerClose
            onClick={onConfirm}
            className="flex h-[54px] flex-1 items-center justify-center gap-2 rounded-sharp bg-brand text-[16px] font-bold text-white active:brightness-95"
          >
            <CircleStop size={19} />
            Ha, to&apos;xtatish
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
