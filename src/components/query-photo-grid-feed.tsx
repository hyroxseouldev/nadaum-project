"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useAnimation } from "motion/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getGuestPhotos } from "@/lib/actions";
import {
  PhotoGrid,
  SkeletonGrid,
  LoadingIndicator,
  BackgroundLoading,
  EndOfContent,
  EmptyState,
  ErrorState,
  type InfiniteScrollProps,
} from "@/components/infinite-scroll";

export function QueryPhotoGridFeed({ selectedCafeId }: InfiniteScrollProps) {
  const controls = useAnimation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      return getGuestPhotos(pageParam, selectedCafeId, 20);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 0,
    refetchInterval: 3 * 60 * 1000, // 3분마다 자동 refetch
    staleTime: 3 * 60 * 1000, // 3분 (180,000ms),
    refetchOnWindowFocus: false, // Disable refetch on window focus to prevent scroll jump
    refetchOnMount: false, // Only refetch on mount if data is stale
    notifyOnChangeProps: ["data", "error"], // Only notify on data/error changes
  });

  // Flatten all pages into a single array of photos
  const photos = data?.pages.flatMap((page) => page.data) ?? [];

  // Handle loading more photos with intersection observer
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    // Start observing
    observerRef.current.observe(currentRef);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleLoadMore]);

  // Scroll detection for better UX
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
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
      controls.start({
        y: [0, -8, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      });
    } else {
      controls.stop();
      controls.set({ y: 0 });
    }
  }, [isScrolling, photos.length, controls]);

  if (status === "pending") {
    return (
      <div className="p-1">
        <SkeletonGrid count={20} />
      </div>
    );
  }

  if (status === "error") {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (photos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Photo Grid */}
      <div className="p-1">
        <PhotoGrid
          photos={photos}
          controls={controls}
        />
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {hasNextPage && isFetchingNextPage && (
          <LoadingIndicator isLoading={true} />
        )}
      </div>

      {/* End of content indicator */}
      {!hasNextPage && photos.length > 0 && (
        <EndOfContent totalPhotos={photos.length} />
      )}

      {/* Background loading indicator */}
      <BackgroundLoading isVisible={isFetching && !isFetchingNextPage} />
    </div>
  );
}
