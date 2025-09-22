"use client";

import { motion } from "motion/react";

export function EmptyState() {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <p className="text-muted-foreground mb-4">
        아직 게스트 포토가 없습니다.
      </p>
      <p className="text-sm text-muted-foreground">
        첫 번째 게스트 포토를 업로드해보세요!
      </p>
    </motion.div>
  );
}