"use client";

import Image from "next/image";
import { Masonry } from "react-plock";
import { motion } from "motion/react";
import type { PhotoGridProps } from "./types";

export function PhotoGrid({ photos, controls }: PhotoGridProps) {
  return (
    <motion.div animate={controls}>
      <Masonry
        items={photos}
        config={{
          columns: [2, 3, 4], // 2 columns on mobile, 3 on tablet, 4 on lg+ screens
          gap: [4, 4, 4], // 4px gap across all breakpoints
          media: [768, 960, 1024], // breakpoints at 768px (md) and 960px (lg)
        }}
        render={(photo, idx) => (
          <motion.div
            key={photo.id}
            className="overflow-hidden group relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: idx * 0.05,
              duration: 0.6,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
          >
            <Image
              src={photo.imageUrl}
              alt={`Guest photo at ${photo.cafe?.name || "Unknown cafe"}`}
              width={400}
              height={600}
              className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity duration-200"
              sizes="(max-width: 768px) 50vw, (max-width: 960px) 33vw, (max-width: 1024px) 25vw, 25vw"
              loading="lazy"
              style={{
                aspectRatio: "auto",
              }}
            />
          </motion.div>
        )}
      />
    </motion.div>
  );
}