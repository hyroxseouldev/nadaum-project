"use client";

import { motion } from "motion/react";
import type { EndOfContentProps } from "./types";

export function EndOfContent({ totalPhotos }: EndOfContentProps) {
  if (totalPhotos === 0) return null;

  return (
    <motion.div
      className="flex items-center justify-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-sm text-muted-foreground">
        모든 사진을 불러왔습니다 ✨
      </p>
    </motion.div>
  );
}