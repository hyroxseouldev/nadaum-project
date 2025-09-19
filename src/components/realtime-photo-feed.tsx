"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Masonry } from "react-plock";
import { motion, useAnimation } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { getGuestPhotos } from "@/lib/actions";
import { useIntersection } from "@/hooks/use-intersection";
import { useAuth } from "@/hooks/use-auth";

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

interface RealtimePhotoFeedProps {
  selectedCafeId?: string;
}

export function RealtimePhotoFeed({ selectedCafeId }: RealtimePhotoFeedProps) {
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);
  const [newPhotosCount, setNewPhotosCount] = useState(0);

  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);
  const realtimeIntervalRef = useRef<NodeJS.Timeout>(null);
  const lastCheckTimeRef = useRef<Date>(new Date());
  const controls = useAnimation();

  const { isAuthenticated } = useAuth();

  const loadPhotos = useCallback(
    async (pageNum: number, cafeId?: string, reset = false) => {
      try {
        if (reset) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        const result = await getGuestPhotos(pageNum, cafeId);

        if (reset) {
          setPhotos(result.data);
          lastCheckTimeRef.current = new Date();
        } else {
          setPhotos((prev) => [...prev, ...result.data]);
        }

        setHasMore(result.hasMore);
        setPage(pageNum);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "사진을 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Real-time photo checking
  const checkForNewPhotos = useCallback(async () => {
    if (!isRealTimeActive) return;

    try {
      // Get the latest photos (first page only)
      const result = await getGuestPhotos(0, selectedCafeId, 10);
      const latestPhotos = result.data;

      if (latestPhotos.length > 0) {
        // Check if there are any photos newer than our last check
        const newestPhotoTime = new Date(latestPhotos[0].createdAt);

        if (newestPhotoTime > lastCheckTimeRef.current) {
          // Find new photos
          const newPhotos = latestPhotos.filter(
            (photo) => new Date(photo.createdAt) > lastCheckTimeRef.current
          );

          if (newPhotos.length > 0) {
            setPhotos((prev) => {
              // Remove duplicates and add new photos at the beginning
              const existingIds = new Set(prev.map((p) => p.id));
              const uniqueNewPhotos = newPhotos.filter(
                (p) => !existingIds.has(p.id)
              );

              if (uniqueNewPhotos.length > 0) {
                setNewPhotosCount((prev) => prev + uniqueNewPhotos.length);
                return [...uniqueNewPhotos, ...prev];
              }
              return prev;
            });

            lastCheckTimeRef.current = newestPhotoTime;
          }
        }
      }
    } catch (err) {
      console.error("Error checking for new photos:", err);
    }
  }, [selectedCafeId, isRealTimeActive]);

  // Load initial photos
  useEffect(() => {
    setPhotos([]);
    setPage(0);
    setHasMore(true);
    setNewPhotosCount(0);
    loadPhotos(0, selectedCafeId, true);
  }, [selectedCafeId, loadPhotos]);

  // Set up real-time checking
  useEffect(() => {
    if (isRealTimeActive) {
      // Check for new photos every 10 seconds
      realtimeIntervalRef.current = setInterval(checkForNewPhotos, 10000);
    } else {
      if (realtimeIntervalRef.current) {
        clearInterval(realtimeIntervalRef.current);
      }
    }

    return () => {
      if (realtimeIntervalRef.current) {
        clearInterval(realtimeIntervalRef.current);
      }
    };
  }, [checkForNewPhotos, isRealTimeActive]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

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
  }, []);

  // Animation control
  useEffect(() => {
    if (!isScrolling && photos.length > 0) {
      // Start floating animation when not scrolling
      controls.start({
        y: [0, -8, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      });
    } else {
      // Stop animation when scrolling
      controls.stop();
      controls.set({ y: 0 });
    }
  }, [isScrolling, photos.length, controls]);

  // Intersection observer for infinite scroll
  const { ref, isIntersecting } = useIntersection({
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Load more photos when reaching bottom
  useEffect(() => {
    if (isIntersecting && hasMore && !loadingMore && !loading) {
      loadPhotos(page + 1, selectedCafeId);
    }
  }, [
    isIntersecting,
    hasMore,
    loadingMore,
    loading,
    page,
    selectedCafeId,
    loadPhotos,
  ]);

  // Reset new photos count when user scrolls to top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100 && newPhotosCount > 0) {
        setNewPhotosCount(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [newPhotosCount]);

  // Skeleton grid component for loading state
  const SkeletonGrid = () => (
    <Masonry
      items={Array.from({ length: 8 }, (_, i) => i)}
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

  if (loading) {
    return (
      <div className="p-1">
        <SkeletonGrid />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-red-500 mb-4">{error}</p>
        <motion.button
          onClick={() => loadPhotos(0, selectedCafeId, true)}
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
      {/* Real-time status indicator - only show when authenticated */}
      {/* {isAuthenticated && (
        <div className="absolute top-12 z-20 mx-2 mb-2 w-1/2 right-1">
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-sm ">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isRealTimeActive
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-400"
                }`}
              />
              <span className="text-xs font-medium text-gray-700">
                실시간 업데이트 {isRealTimeActive ? "활성" : "비활성"}
              </span>
            </div>

            {newPhotosCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                +{newPhotosCount} 새 사진
              </motion.span>
            )}

            <button
              onClick={() => setIsRealTimeActive(!isRealTimeActive)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {isRealTimeActive ? "중지" : "시작"}
            </button>
          </div>
        </div>
      )} */}
      <div className="p-1">
        <PhotoGrid />
      </div>

      {/* Loading more indicator */}
      {hasMore && (
        <div ref={ref} className="py-8">
          {loadingMore && (
            <div className="p-1">
              <Masonry
                items={Array.from({ length: 4 }, (_, i) => i)}
                config={{
                  columns: [2, 3, 4], // 2 columns on mobile, 3 on tablet, 4 on lg+ screens
                  gap: [4, 4, 4], // 4px gap across all breakpoints
                  media: [768, 960, 1024], // breakpoints at 768px (md) and 960px (lg)
                }}
                render={(_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
