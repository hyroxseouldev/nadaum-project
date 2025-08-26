'use client';

import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';
import Link from 'next/link';

interface UploadButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  className?: string;
}

export function UploadButton({
  variant = 'default',
  size = 'default',
  showIcon = true,
  className,
}: UploadButtonProps) {
  return (
    <Link href="/upload">
      <Button
        variant={variant}
        size={size}
        className={`flex items-center space-x-2 ${className || ''}`}
      >
        {showIcon && (
          <>
            <Camera className="h-4 w-4 sm:hidden" />
            <Upload className="h-4 w-4 hidden sm:inline" />
          </>
        )}
        <span className="hidden sm:inline">게스트 포토 업로드</span>
        <span className="sm:hidden">업로드</span>
      </Button>
    </Link>
  );
}