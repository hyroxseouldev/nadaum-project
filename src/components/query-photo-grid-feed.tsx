"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Masonry } from "react-plock";
import { motion, useAnimation } from "motion/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getGuestPhotos } from "@/lib/actions";
import { useIntersection } from "@/hooks/use-intersection";
import { Loader2 } from "lucide-react";

interface GuestPhoto {
  id: string;
  imageUrl: string;
  cafeId: string;
  createdAt: Date;
  adminApproval: boolean;
  cafe: {
    id: string;
    name: string;
    address: string;
  } | null;
}

interface QueryPhotoGridFeedProps {
  selectedCafeId?: string;
}

export function QueryPhotoGridFeed({
  selectedCafeId,
}: QueryPhotoGridFeedProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [preserveScroll, setPreserveScroll] = useState(false);

  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);
  const scrollPositionRef = useRef<number>(0);
  const controls = useAnimation();

  // React Query infinite query for photos
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["guest-photos", selectedCafeId],
    queryFn: ({ pageParam = 0 }) => {
      return getGuestPhotos(pageParam, selectedCafeId, 30);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 0,
    refetchInterval: false, // Disable automatic refetch to prevent scroll jump
    staleTime: 1000 * 60 * 5, // Increase stale time to 5 minutes
    refetchOnWindowFocus: false, // Disable refetch on window focus to prevent scroll jump
    refetchOnMount: false, // Only refetch on mount if data is stale
  });

  // Flatten all pages into a single array of photos
  const photos = data?.pages.flatMap((page) => page.data) ?? [];

  // Scroll detection and position preservation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      // Only save scroll position if we're not at the very bottom
      // and if there are more pages to load
      if (hasNextPage && window.scrollY > 0) {
        scrollPositionRef.current = window.scrollY;
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // 150ms after scrolling stops
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hasNextPage]);

  // Restore scroll position after data changes
  useEffect(() => {
    if (preserveScroll && scrollPositionRef.current > 0 && hasNextPage) {
      // Only restore scroll if we're fetching more pages, not at the end
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'instant'
        });
        setPreserveScroll(false);
      });
    } else if (preserveScroll && !hasNextPage) {
      // If we've reached the end, just reset the flag without scrolling
      setPreserveScroll(false);
    }
  }, [photos.length, preserveScroll, hasNextPage]);

  // Animation control - disable floating animation to prevent scroll issues
  useEffect(() => {
    // Disable floating animation to prevent scroll position changes
    controls.set({ y: 0 });
  }, [controls]);

  // Intersection observer for infinite scroll
  const { ref, isIntersecting } = useIntersection({
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Load more photos when reaching bottom
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      // Only preserve scroll when actually fetching more content
      if (hasNextPage) {
        setPreserveScroll(true);
        fetchNextPage();
      }
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);


  // Skeleton grid component for loading state
  const SkeletonGrid = () => (
    <Masonry
      items={Array.from({ length: 20 }, (_, i) => i)}
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

  // Photo grid using Plock masonry layout with animation
  const PhotoGrid = () => (
    <motion.div animate={controls}>
      <Masonry
        items={photos}
        config={{
          columns: [2, 3, 4], // 2 columns on mobile, 3 on tablet, 4 on lg+ screens
          gap: [4, 4, 4], // 4px gap across all breakpoints
          media: [768, 960, 1024], // breakpoints at 768px (md) and 960px (lg)
        }}
        render={(photo) => (
          <motion.div
            key={photo.id}
            className="overflow-hidden group relative"
            initial={false} // Disable initial animation to prevent scroll jump
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3, // Reduce animation duration
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
          >
            {/* New photo indicator
            {new Date(photo.createdAt) > new Date(Date.now() - 60000) && (
              <div className="absolute top-2 right-2 z-10">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  NEW
                </span>
              </div>
            )} */}

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

  if (status === "pending") {
    return (
      <div className="p-1">
        <SkeletonGrid />
      </div>
    );
  }

  if (status === "error") {
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
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          다시 시도
        </motion.button>
      </motion.div>
    );
  }

  if (photos.length === 0) {
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

  return (
    <div>
      <div className="p-1">
        <PhotoGrid />
      </div>

      {/* Intersection observer trigger - always rendered for infinite scroll */}
      <div ref={ref} className="h-4 w-full" />

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <motion.div
          className="flex flex-col items-center justify-center py-8 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            더 많은 사진을 불러오는 중...
          </p>
        </motion.div>
      )}

      {/* End of content indicator */}
      {!hasNextPage && photos.length > 0 && (
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
      )}

      {/* Background loading indicator */}
      {isFetching && !isFetchingNextPage && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>사진 업데이트 중...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
