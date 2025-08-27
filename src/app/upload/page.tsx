import { getCafes } from "@/lib/actions";
import UploadForm from "@/components/upload-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ value: string }>;
}) {
  const cafeList = await getCafes();
  const { value } = await searchParams;
  const selectedCafe = cafeList.find((cafe) => cafe.value === Number(value));
  if (!selectedCafe) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>카페를 찾을 수 없습니다.</AlertDescription>
      </Alert>
    );
  }
  return <UploadForm selectedCafe={selectedCafe} />;
}
