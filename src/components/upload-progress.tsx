'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UploadProgressProps {
  open: boolean;
  onClose: () => void;
  progress: number;
  currentFile?: string;
  completed: number;
  total: number;
  errors: string[];
  stage: 'uploading' | 'processing' | 'completed' | 'error';
}

export function UploadProgress({
  open,
  onClose,
  progress,
  currentFile,
  completed,
  total,
  errors,
  stage,
}: UploadProgressProps) {
  const getStageMessage = () => {
    switch (stage) {
      case 'uploading':
        return '이미지를 업로드하는 중...';
      case 'processing':
        return '이미지를 처리하는 중...';
      case 'completed':
        return '업로드가 완료되었습니다!';
      case 'error':
        return '업로드 중 오류가 발생했습니다.';
      default:
        return '준비 중...';
    }
  };

  const getStageIcon = () => {
    switch (stage) {
      case 'uploading':
      case 'processing':
        return <Upload className="h-6 w-6 text-primary animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Upload className="h-6 w-6 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getStageIcon()}
            <span>이미지 업로드</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stage message */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {getStageMessage()}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>진행상황</span>
              <span>{completed}/{total}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {Math.round(progress)}% 완료
            </p>
          </div>

          {/* Current file */}
          {currentFile && stage !== 'completed' && (
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">현재 업로드 중</p>
              <p className="text-xs text-muted-foreground truncate" title={currentFile}>
                {currentFile}
              </p>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">다음 오류가 발생했습니다:</p>
                  <ul className="text-sm space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="list-disc list-inside">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Success message */}
          {stage === 'completed' && errors.length === 0 && (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-green-800">업로드 성공!</p>
              <p className="text-sm text-green-600 mt-1">
                {total}개의 이미지가 성공적으로 업로드되었습니다.
              </p>
            </div>
          )}

          {/* Partial success message */}
          {stage === 'completed' && errors.length > 0 && completed > 0 && (
            <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium text-orange-800">부분 성공</p>
              <p className="text-sm text-orange-600 mt-1">
                {completed}개의 이미지가 업로드되었습니다. (총 {total}개 중)
              </p>
            </div>
          )}

          {/* Close button */}
          {(stage === 'completed' || stage === 'error') && (
            <div className="flex justify-end">
              <Button onClick={onClose} variant={stage === 'completed' ? 'default' : 'outline'}>
                {stage === 'completed' ? '확인' : '닫기'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}