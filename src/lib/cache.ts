import { unstable_cache } from 'next/cache';
import { getCafes as getOriginalCafes, getParticipants as getOriginalParticipants } from './actions';

// 카페 데이터 캐싱 (24시간)
export const getCachedCafes = unstable_cache(
  async () => {
    return await getOriginalCafes();
  },
  ['cafes'],
  {
    revalidate: 86400, // 24시간
    tags: ['cafes']
  }
);

// 참가자 데이터 캐싱 (1시간)
export const getCachedParticipants = unstable_cache(
  async () => {
    return await getOriginalParticipants();
  },
  ['participants'],
  {
    revalidate: 3600, // 1시간
    tags: ['participants']
  }
);

// 캐시 무효화 함수들
export async function revalidateCafes() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('cafes');
}

export async function revalidateParticipants() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('participants');
}