'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink } from 'lucide-react';

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
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-muted/30">
        <h3 className="font-semibold mb-3 flex items-center">
          약관 동의
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms-agreement"
              checked={agreed}
              onCheckedChange={onAgreeChange}
              disabled={disabled}
              required={required}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms-agreement"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                게스트 포토 업로드 및 이용약관에 동의합니다
              </Label>
              <p className="text-xs text-muted-foreground">
                아래의 약관을 읽고 동의해주세요. 동의하지 않으면 업로드할 수 없습니다.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 ml-6">
            <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="h-auto p-0 text-xs">
                  이용약관 보기
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>게스트 포토 업로드 이용약관</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4 text-sm">
                    <section>
                      <h4 className="font-semibold mb-2">제1조 (목적)</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        이 약관은 Guest Photo Platform(이하 &ldquo;플랫폼&rdquo;)에서 제공하는 게스트 포토 업로드 및 공유 서비스의 이용과 관련하여 플랫폼과 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">제2조 (서비스 내용)</h4>
                      <ul className="space-y-1 text-muted-foreground leading-relaxed">
                        <li>• 카페별 게스트 포토 업로드 및 공유</li>
                        <li>• 업로드된 이미지의 저장 및 관리</li>
                        <li>• 다른 사용자와의 포토 공유</li>
                        <li>• 카페별 필터링 및 검색 기능</li>
                      </ul>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">제3조 (이용자의 의무)</h4>
                      <ul className="space-y-1 text-muted-foreground leading-relaxed">
                        <li>• 타인의 저작권, 초상권을 침해하는 이미지 업로드 금지</li>
                        <li>• 음란물, 폭력적 콘텐츠 등 부적절한 내용 업로드 금지</li>
                        <li>• 허위 정보나 광고성 콘텐츠 업로드 금지</li>
                        <li>• 서비스의 정상적인 운영을 방해하는 행위 금지</li>
                      </ul>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">제4조 (콘텐츠 관리)</h4>
                      <ul className="space-y-1 text-muted-foreground leading-relaxed">
                        <li>• 업로드된 모든 이미지는 관리자 승인 후 공개됩니다</li>
                        <li>• 부적절한 콘텐츠는 사전 통지 없이 삭제될 수 있습니다</li>
                        <li>• 저작권 침해 신고 시 즉시 해당 콘텐츠를 검토합니다</li>
                      </ul>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">제5조 (면책조항)</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        플랫폼은 이용자가 업로드한 콘텐츠로 인해 발생하는 법적 문제에 대해 책임지지 않으며, 모든 법적 책임은 해당 이용자에게 있습니다.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">제6조 (약관의 효력)</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        이 약관은 서비스 이용과 동시에 효력이 발생하며, 약관에 동의하지 않을 경우 서비스를 이용할 수 없습니다.
                      </p>
                    </section>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="h-auto p-0 text-xs">
                  개인정보처리방침 보기
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>개인정보처리방침</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4 text-sm">
                    <section>
                      <h4 className="font-semibold mb-2">개인정보 수집 항목</h4>
                      <ul className="space-y-1 text-muted-foreground leading-relaxed">
                        <li>• 업로드 이미지의 메타데이터 (촬영 시간, 위치 등)</li>
                        <li>• IP 주소 및 접속 로그</li>
                        <li>• 쿠키를 통한 서비스 이용 기록</li>
                      </ul>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">수집 목적</h4>
                      <ul className="space-y-1 text-muted-foreground leading-relaxed">
                        <li>• 게스트 포토 서비스 제공</li>
                        <li>• 서비스 품질 개선</li>
                        <li>• 부정 이용 방지</li>
                      </ul>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">보유 기간</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        수집된 개인정보는 서비스 제공 기간 동안 보유하며, 이용자가 삭제를 요청하거나 서비스 종료 시 즉시 파기합니다.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">제3자 제공</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        수집된 개인정보는 법령에 의한 경우를 제외하고는 제3자에게 제공하지 않습니다.
                      </p>
                    </section>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {!agreed && required && (
        <p className="text-sm text-red-500 flex items-center">
          업로드하려면 약관에 동의해주세요.
        </p>
      )}
    </div>
  );
}