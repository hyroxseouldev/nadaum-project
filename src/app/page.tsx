import { AnimationPhotoFeed } from "@/components/animation-photo-feed";
import MainLayout from "@/components/main-layout";
import { PlockPhotoFeed } from "@/components/plock-photo-feed";
import { getCafes } from "@/lib/actions";
import Link from "next/link";

// searchParams 타입 정의
interface HomeProps {
  searchParams: Promise<{ cafeValue: string }>;
}
export default async function Home({ searchParams }: HomeProps) {
  const { cafeValue } = await searchParams;
  const cafes = await getCafes();
  const noneHiddenCafe = cafes.filter((c) => c.isHidden === false);
  const cafeId =
    cafes.find((cafe) => cafe.value === Number(cafeValue))?.id || undefined;

  return (
    <MainLayout>
      {/* Sticky navigation header */}
      <div className="sticky top-0 bg-white z-10">
        <ul className="flex gap-4.5 px-2 pt-3 pb-1 overflow-x-auto">
          <li className="text-sm font-normal text-[#000000] whitespace-nowrap">
            <Link href={`/`}>ALL</Link>
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
              <Link href={`/?cafeValue=${cafe.value}`}>{cafe.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* <GuestPhotoFeed selectedCafeId={cafeId} /> */}
        <PlockPhotoFeed selectedCafeId={cafeId} />
        {/* <AnimationPhotoFeed selectedCafeId={cafeId} /> */}
      </div>
    </MainLayout>
  );
}
