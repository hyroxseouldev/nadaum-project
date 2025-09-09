import { getCafes } from "@/lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Modal from "@/components/modal";
import UploadFormModal from "@/components/upload-form-modal";

export default async function UploadModal({
  searchParams,
}: {
  searchParams: Promise<{ value: string }>;
}) {
  const cafeList = await getCafes();
  const { value } = await searchParams;
  const selectedCafe = cafeList.find((cafe) => cafe.value === Number(value));

  if (!selectedCafe) {
    return (
      <Modal>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>카페를 찾을 수 없습니다.</AlertDescription>
          </Alert>
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <UploadFormModal selectedCafe={selectedCafe} />
    </Modal>
  );
}