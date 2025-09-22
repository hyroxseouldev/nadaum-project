"use client";

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface BackgroundLoadingProps {
  isVisible: boolean;
  message?: string;
}

export function BackgroundLoading({
  isVisible,
  message = "사진 업데이트 중..."
}: BackgroundLoadingProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 shadow-lg">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{message}</span>
      </div>
    </motion.div>
  );
}