"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
interface TermsAgreementProps {
  agreed: boolean;
  onAgreeChange: (agreed: boolean) => void;
  required?: boolean;
  disabled?: boolean;
}

export function TermsAgreement({
  agreed,
  onAgreeChange,
  required = true,
  disabled = false,
}: TermsAgreementProps) {
  const term1 =
    "1.(필수) 개인정보 수집·이용 동의\n 수집·이용 목적: 게스트 포토 업로드·게시 및 서비스 운영\n 수집 항목: 사진 파일(이미지 자체 및 포함 메타데이터(EXIF)), 업로드 일시\n ※ EXIF에 위치·기기 정보가 포함될 수 있습니다. 업로드 시 메타데이터를 제거하도록 권장/처리합니다.\n 보유·이용 기간: 게시·운영 기간 동안 보관하며, 동의 철회 또는 삭제 요청 시 지체 없이 파기합니다.\n 다만 관계 법령에 따라 보존이 필요한 경우 해당 기간 보관 후 즉시 파기합니다.\n 동의를 거부할 권리: 동의를 거부할 수 있으나, 거부 시 사진 업로드 기능 이용이 제한됩니다.";
  const term2 =
    "2.(필수) 사진의 2차 활용(홍보·전시) 동의\n행사 소개, 도록 제작 등 사이트 외부 채널에서 귀하의 업로드 사진을 활용하여\n2차 콘텐츠를 제작할 수 있습니다.\n(민감정보·초상권 침해 방지 기준 준수)\n 보유·이용 기간: 업로드 후 2년";

  return (
    <div className="space-y-4">
      <div className="p-4">
        <div className="flex flex-col gap-y-2 mb-4">
          <p className="text-[7px] font-normal text-[#000000] text-center whitespace-pre-line">
            {term1}
          </p>
          <p className="text-[7px] font-normal text-[#000000] text-center whitespace-pre-line">
            {term2}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-3">
            <Checkbox
              id="terms-agreement"
              checked={agreed}
              onCheckedChange={onAgreeChange}
              disabled={disabled}
              required={required}
              className="border-black"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms-agreement"
                className="text-[7px] font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                위 약관에 동의합니다
              </Label>
            </div>
          </div>
        </div>
        {!agreed && required && (
          <p className="text-[7px] font-normal text-red-500 flex items-center justify-center text-center mt-3">
            업로드하려면 약관에 동의해주세요.
          </p>
        )}
      </div>
    </div>
  );
}
