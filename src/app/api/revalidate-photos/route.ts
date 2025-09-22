import { revalidateTag, revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 게스트 포토 캐시 무효화
    revalidateTag('guest-photos');

    // 메인 페이지 재검증
    revalidatePath('/');

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}