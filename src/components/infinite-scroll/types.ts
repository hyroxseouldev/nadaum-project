export interface GuestPhoto {
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

export interface InfiniteScrollProps {
  selectedCafeId?: string;
}

import type { AnimationControls } from "motion/react";

export interface PhotoGridProps {
  photos: GuestPhoto[];
  controls: AnimationControls;
}

export interface SkeletonGridProps {
  count?: number;
}

export interface LoadingIndicatorProps {
  isLoading: boolean;
  message?: string;
}

export interface EndOfContentProps {
  totalPhotos: number;
}