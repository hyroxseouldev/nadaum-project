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
        className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-[460px] p-0 overflow-hidden rounded-lg sm:w-full"
        showCloseButton={true}
      >
        <div className="overflow-y-auto max-h-[90vh]">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
