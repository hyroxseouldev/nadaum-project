"use client";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUploader } from "@/components/image-uploader";
import { UploadProgress } from "@/components/upload-progress";
import { TermsAgreement } from "@/components/terms-agreement";
import { getCafes } from "@/lib/actions";
import { uploadImages, ensureStorageBucket } from "@/lib/upload-utils";
import { Camera, ArrowLeft, Upload, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ImageFile {
  file: File;
  id: string;
  preview: string;
}

interface Cafe {
  id: string;
  name: string;
  address: string;
  value: number | null;
}

interface UploadProgressState {
  stage: "uploading" | "processing" | "completed" | "error";
  progress: number;
  currentFile?: string;
  completed: number;
  total: number;
  errors: string[];
}

interface UploadFormProps {
  selectedCafe: Cafe;
}

const UploadForm = ({ selectedCafe }: UploadFormProps) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({
    stage: "uploading",
    progress: 0,
    completed: 0,
    total: 0,
    errors: [],
  });
  const [showProgress, setShowProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const canUpload = images.length > 0 && selectedCafe && agreed && !uploading;

  const handleUpload = async () => {
    if (!canUpload) return;

    setUploading(true);
    setShowProgress(true);
    setError(null);

    try {
      if (!selectedCafe) {
        toast.error("카페 정보를 찾을 수 없습니다.");
        return;
      }

      const result = await uploadImages(
        images,
        selectedCafe.id,
        setUploadProgress
      );

      if (result.success) {
        toast.success(`${result.uploadedCount}개의 이미지가 업로드되었습니다!`);

        // Clear form after successful upload
        setTimeout(() => {
          setImages([]);
          setAgreed(false);
          setShowProgress(false);
          setUploading(false);
        }, 2000);
      } else {
        toast.error("업로드에 실패했습니다.");
        setError("업로드 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("업로드 중 예상치 못한 오류가 발생했습니다.");
      setError(
        err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다."
      );
      setUploading(false);
      setShowProgress(false);
    }
  };

  const handleProgressClose = () => {
    setShowProgress(false);
    setUploading(false);

    // Redirect to home page after successful upload
    if (
      uploadProgress.stage === "completed" &&
      uploadProgress.errors.length === 0
    ) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Camera className="h-6 w-6 mr-2 text-primary" />
              게스트 포토 업로드
            </h1>
            <p className="text-muted-foreground mt-1">
              {selectedCafe
                ? `${selectedCafe.name}에서의 특별한 순간을 공유해보세요`
                : "카페에서의 특별한 순간을 다른 사람들과 공유해보세요"}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>이미지 선택</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                maxFiles={10}
                maxFileSize={10}
                acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
                onImagesChange={setImages}
                disabled={uploading}
              />
            </CardContent>
          </Card>

          {/* Selected Cafe Info */}
          <Card>
            <CardHeader>
              <CardTitle>선택된 카페</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="font-medium">{selectedCafe.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedCafe.address}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms Agreement */}
          <Card>
            <CardHeader>
              <CardTitle>약관 동의</CardTitle>
            </CardHeader>
            <CardContent>
              <TermsAgreement
                agreed={agreed}
                onAgreeChange={setAgreed}
                disabled={uploading}
              />
            </CardContent>
          </Card>

          {/* Upload Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleUpload}
              disabled={!canUpload}
              className="flex-1"
              size="lg"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "업로드 중..." : `${images.length}개 이미지 업로드`}
            </Button>

            <Link href="/" className="sm:flex-none">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                취소
              </Button>
            </Link>
          </div>

          {/* Upload Requirements */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">업로드 전 확인사항</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    타인의 초상권을 침해하지 않는 이미지인지 확인해주세요
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>부적절한 내용이 포함되지 않았는지 확인해주세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>업로드된 이미지는 관리자 검토 후 공개됩니다</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>이미지는 자동으로 최적화되어 저장됩니다</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Progress Modal */}
      <UploadProgress
        open={showProgress}
        onClose={handleProgressClose}
        progress={uploadProgress.progress}
        currentFile={uploadProgress.currentFile}
        completed={uploadProgress.completed}
        total={uploadProgress.total}
        errors={uploadProgress.errors}
        stage={uploadProgress.stage}
      />
    </div>
  );
};

export default UploadForm;
