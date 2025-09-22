"use client";

import { useState, useEffect, useRef } from "react";
import { useAnimation } from "motion/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
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

export function QueryPhotoGridFeed({
  selectedCafeId,
}: InfiniteScrollProps) {
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);
  const controls = useAnimation();

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

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

  // Scroll detection for animation control
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


  // Load more photos when reaching bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);




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
      <div className="p-1">
        <PhotoGrid
          photos={photos}
          controls={controls}
        />
      </div>

      {/* Intersection observer trigger - always rendered for infinite scroll */}
      <div ref={ref} className="h-4 w-full" />

      {/* Loading more indicator */}
      <LoadingIndicator isLoading={isFetchingNextPage} />

      {/* End of content indicator */}
      {!hasNextPage && <EndOfContent totalPhotos={photos.length} />}

      {/* Background loading indicator */}
      <BackgroundLoading
        isVisible={isFetching && !isFetchingNextPage}
      />
    </div>
  );
}
