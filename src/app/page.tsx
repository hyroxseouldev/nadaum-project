import { GuestPhotoFeed } from "@/components/guest-photo-feed";
import MainLayout from "@/components/main-layout";
import { getCafes, getGuestPhotos } from "@/lib/actions";
import Link from "next/link";

// searchParams 타입 정의
interface HomeProps {
  searchParams: Promise<{ cafeValue: string }>;
}
export default async function Home({ searchParams }: HomeProps) {
  const { cafeValue } = await searchParams;
  const cafes = await getCafes();
  const cafeId =
    cafes.find((cafe) => cafe.value === Number(cafeValue))?.id || undefined;
  const photoList = await getGuestPhotos(0, cafeId);
  return (
    <MainLayout>
      {/* // 카페 목록 및 필터링 기능 추가 */}
      {/* {카페 아이디가 없으면 ALL 띄움 } */}
      <div>
        <ul className="flex gap-4.5 px-2 py-3">
          {/* // 크기 14px, 굵기 400, 색상 #000000 */}
          <li className="text-sm font-normal text-[#000000]">
            <Link href={`/`}>ALL</Link>
          </li>
          {cafes.map((cafe) => (
            <li key={cafe.id} className="text-sm font-normal text-[#000000]">
              <Link href={`/?cafeValue=${cafe.value}`}>{cafe.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <GuestPhotoFeed selectedCafeId={cafeId} />
    </MainLayout>
  );
}
