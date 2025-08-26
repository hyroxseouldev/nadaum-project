'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getGuestPhotos } from '@/lib/actions';
import { useIntersection } from '@/hooks/use-intersection';

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

  const loadPhotos = useCallback(async (pageNum: number, cafeId?: string, reset = false) => {
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
        setPhotos(prev => [...prev, ...result.data]);
      }
      
      setHasMore(result.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : '사진을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

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
    rootMargin: '100px',
  });

  // Load more photos when reaching bottom
  useEffect(() => {
    if (isIntersecting && hasMore && !loadingMore && !loading) {
      loadPhotos(page + 1, selectedCafeId);
    }
  }, [isIntersecting, hasMore, loadingMore, loading, page, selectedCafeId, loadPhotos]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => loadPhotos(0, selectedCafeId, true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">아직 게스트 포토가 없습니다.</p>
        <p className="text-sm text-muted-foreground">
          첫 번째 게스트 포토를 업로드해보세요!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative aspect-square">
              <Image
                src={photo.imageUrl}
                alt={`Guest photo at ${photo.cafe?.name || 'Unknown cafe'}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              {photo.cafe && (
                <>
                  <Badge variant="secondary" className="mb-2">
                    {photo.cafe.name}
                  </Badge>
                  <p className="text-xs text-muted-foreground truncate">
                    {photo.cafe.address}
                  </p>
                </>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(photo.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Loading more indicator */}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {loadingMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasMore && photos.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">모든 게스트 포토를 확인했습니다.</p>
        </div>
      )}
    </div>
  );
}