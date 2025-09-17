import { unstable_cache } from 'next/cache';
import { getGuestPhotos as getOriginalGuestPhotos } from './actions';

// 게스트 포토 데이터 캐싱 (5분)
export const getCachedGuestPhotos = unstable_cache(
  async (page = 0, cafeId?: string, limit = 20) => {
    return await getOriginalGuestPhotos(page, cafeId, limit);
  },
  ['guest-photos'],
  {
    revalidate: 300, // 5분
    tags: ['guest-photos']
  }
);

// 캐시 무효화 함수
export async function revalidateGuestPhotos() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('guest-photos');
}