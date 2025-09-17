"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // 배포환경에서 router.back() 문제 해결
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTitle className="sr-only">Modal</DialogTitle>
      <DialogContent
        className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-[460px] p-0 overflow-hidden sm:w-full sm:max-w-[460px] rounded-none"
        showCloseButton={true}
      >
        <div className="overflow-y-auto max-h-[90vh]">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
