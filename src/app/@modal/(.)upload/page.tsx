import { getCachedCafes } from "@/lib/cache";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Modal from "@/components/modal";
import UploadFormModal from "@/components/upload-form-modal";
import ModalPageLayout from "@/components/modal-page-layout";
import { ModalSkeleton } from "@/components/modal-skeleton";
import { Suspense } from "react";

// 정적 생성으로 성능 최적화
export const dynamic = "auto";

async function UploadContent({
  uploadValue,
}: {
  uploadValue: string;
}) {
  const text1 =
    "나다움 행사장에서 찍은 사진을 공유해주세요!\n친구들과 찍은 사진, 종이에 적은 메모, 내가 좋아하는 사진 등\n나를 표현하는 다양한 콘텐츠를 업로드할 수 있습니다.";
  const text2 =
    "올려주신 사진은 추후 나다움 프로젝트 콘텐츠로\n재가공되어 사용될 수 있습니다.";

  const cafeList = await getCachedCafes();
  const selectedCafe = cafeList.find(
    (cafe) => cafe.value === Number(uploadValue)
  );

  if (!selectedCafe) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>카페를 찾을 수 없습니다.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ModalPageLayout subTitle="PHOTO UPLOAD">
      <div className="flex flex-col items-center">
        <div className="flex flex-col px-12 gap-y-4">
          <p className="text-[10px] font-normal text-[#000000] text-center whitespace-pre-line">
            {text1}
          </p>
          <p className="text-[10px] font-normal text-[#000000] text-center whitespace-pre-line">
            {text2}
          </p>
        </div>
      </div>
      <UploadFormModal selectedCafe={selectedCafe} />
    </ModalPageLayout>
  );
}

export default async function UploadModal({
  searchParams,
}: {
  searchParams: Promise<{ uploadValue: string }>;
}) {
  const { uploadValue } = await searchParams;

  return (
    <Modal>
      <Suspense fallback={<ModalSkeleton />}>
        <UploadContent uploadValue={uploadValue} />
      </Suspense>
    </Modal>
  );
}
