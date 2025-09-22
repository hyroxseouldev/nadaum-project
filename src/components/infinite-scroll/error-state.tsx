"use client";

import { motion } from "motion/react";

interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-red-500 mb-4">
        {error instanceof Error
          ? error.message
          : "사진을 불러오는 중 오류가 발생했습니다."}
      </p>
      <motion.button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        다시 시도
      </motion.button>
    </motion.div>
  );
}