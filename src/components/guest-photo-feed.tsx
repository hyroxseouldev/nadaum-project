"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { getGuestPhotos } from "@/lib/actions";
import { useIntersection } from "@/hooks/use-intersection";

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

interface GuestPhotoFeedProps {
  selectedCafeId?: string;
}

export function GuestPhotoFeed({ selectedCafeId }: GuestPhotoFeedProps) {
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

  // Load initial photos
  useEffect(() => {
    setPhotos([]);
    setPage(0);
    setHasMore(true);
    loadPhotos(0, selectedCafeId, true);
  }, [selectedCafeId, loadPhotos]);

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

  // Skeleton grid component
  const SkeletonGrid = () => (
    <div className="columns-2 lg:columns-4 gap-1 p-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="break-inside-avoid mb-1">
          <Skeleton
            className="w-full"
            style={{
              height: `${200 + (i % 3) * 100}px`,
            }}
          />
        </div>
      ))}
    </div>
  );

  // Custom Masonry grid component
  const MasonryGrid = () => (
    <div className="columns-2 lg:columns-4 gap-1 p-1">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="break-inside-avoid mb-1 overflow-hidden group"
        >
          <Image
            src={photo.imageUrl}
            alt={`Guest photo at ${photo.cafe?.name || "Unknown cafe"}`}
            width={400}
            height={600}
            className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity duration-200"
            sizes="(max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            style={{
              aspectRatio: "auto",
            }}
          />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <SkeletonGrid />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => loadPhotos(0, selectedCafeId, true)}
          className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          아직 게스트 포토가 없습니다.
        </p>
        <p className="text-sm text-muted-foreground">
          첫 번째 게스트 포토를 업로드해보세요!
        </p>
      </div>
    );
  }

  return (
    <div>
      <MasonryGrid />

      {/* Loading more indicator */}
      {hasMore && (
        <div ref={ref} className="py-8">
          {loadingMore && (
            <div className="columns-2 lg:columns-4 gap-1 p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-1">
                  <Skeleton
                    className="w-full"
                    style={{
                      height: `${200 + (i % 3) * 100}px`,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
