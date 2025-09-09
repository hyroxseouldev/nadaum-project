"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
    setOpen(open);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTitle>Modal</DialogTitle>
      {/* <DialogOverlay className="bg-transparent" /> */}
      <DialogContent
        className="max-h-[640px] w-full p-0 overflow-hidden mx-5 rounded-lg"
        showCloseButton={true}
      >
        <div className="overflow-y-auto max-h-[640px]">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
