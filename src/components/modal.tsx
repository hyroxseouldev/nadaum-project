"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTitle className="sr-only">Modal</DialogTitle>
      <DialogContent
        className="max-h-[900px] w-full p-0 overflow-hidden mx-5 rounded-lg"
        showCloseButton={true}
      >
        <div className="overflow-y-auto max-h-[900px]">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
