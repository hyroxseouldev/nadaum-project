"use client";

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import type { LoadingIndicatorProps } from "./types";

export function LoadingIndicator({
  isLoading,
  message = "더 많은 사진을 불러오는 중..."
}: LoadingIndicatorProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-8 space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground font-medium">
        {message}
      </p>
    </motion.div>
  );
}