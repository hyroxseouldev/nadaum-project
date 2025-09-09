'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useRef, useEffect, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="relative bg-background rounded-lg shadow-lg max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden"
        onClick={onClick}
      >
        <Button
          onClick={onDismiss}
          className="absolute top-4 right-4 z-10"
          variant="ghost"
          size="icon"
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="overflow-y-auto max-h-[90vh]">
          {children}
        </div>
      </div>
    </div>
  );
}