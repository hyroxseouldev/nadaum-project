"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUploader } from "@/components/image-uploader";
import { UploadProgress } from "@/components/upload-progress";
import { TermsAgreement } from "@/components/terms-agreement";
import { uploadImages } from "@/lib/upload-utils";
import { Camera, Upload, AlertCircle } from "lucide-react";
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

interface UploadFormModalProps {
  selectedCafe: Cafe;
}

const UploadFormModal = ({ selectedCafe }: UploadFormModalProps) => {
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
          router.back(); // Close modal after successful upload
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

    // Close modal after successful upload
    if (
      uploadProgress.stage === "completed" &&
      uploadProgress.errors.length === 0
    ) {
      router.back();
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Terms Agreement */}
        <TermsAgreement
          agreed={agreed}
          onAgreeChange={setAgreed}
          disabled={uploading}
        />
        {/* Image Upload Section */}
        <ImageUploader
          maxFiles={10}
          maxFileSize={10}
          acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
          onImagesChange={setImages}
          disabled={uploading}
        />

        {/* Upload Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleUpload}
            disabled={!canUpload}
            className="flex-1"
            size="lg"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "업로드 중..." : `${images.length}개 이미지 업로드`}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            disabled={uploading}
          >
            취소
          </Button>
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

export default UploadFormModal;
