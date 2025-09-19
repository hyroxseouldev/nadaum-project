import MainLayout from "@/components/main-layout";
import { RealtimePhotoFeed } from "@/components/realtime-photo-feed";
import { getCachedCafes } from "@/lib/cache";
import Link from "next/link";

// searchParams 타입 정의
interface ViewsProps {
  searchParams: Promise<{ cafeValue: string }>;
}

export default async function Views({ searchParams }: ViewsProps) {
  const { cafeValue } = await searchParams;
  const cafes = await getCachedCafes();
  const noneHiddenCafe = cafes.filter((c) => c.isHidden === false);
  const cafeId =
    cafes.find((cafe) => cafe.value === Number(cafeValue))?.id || undefined;

  return (
    <MainLayout>
      {/* Sticky navigation header */}
      <div className="sticky top-0 bg-white z-10">
        <ul className="flex gap-4.5 px-2 pt-3 pb-1 overflow-x-auto">
          <li className="text-sm font-normal text-[#000000] whitespace-nowrap">
            <Link href={`/views`}>ALL</Link>
          </li>
          {noneHiddenCafe.map((cafe) => (
            <li
              key={cafe.id}
              className={`text-sm font-normal text-[#2a1f1f] whitespace-nowrap ${
                cafeId === cafe.id
                  ? "border-b-[1px] border-solid border-black"
                  : ""
              }`}
            >
              <Link href={`/views?cafeValue=${cafe.value}`}>{cafe.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-20">
        <RealtimePhotoFeed selectedCafeId={cafeId} />
      </div>
    </MainLayout>
  );
}