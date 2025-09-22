"use client";

import { Masonry } from "react-plock";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import type { SkeletonGridProps } from "./types";

export function SkeletonGrid({ count = 20 }: SkeletonGridProps) {
  return (
    <Masonry
      items={Array.from({ length: count }, (_, i) => i)}
      config={{
        columns: [2, 3, 4], // 2 columns on mobile, 3 on tablet, 4 on lg+ screens
        gap: [4, 4, 4], // 4px gap across all breakpoints
        media: [768, 960, 1024], // breakpoints at 768px (md) and 960px (lg)
      }}
      render={(_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Skeleton
            className="w-full"
            style={{
              height: `${200 + (idx % 3) * 100}px`,
            }}
          />
        </motion.div>
      )}
    />
  );
}