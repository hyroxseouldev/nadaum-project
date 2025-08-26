'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X, Upload, Camera, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageFile {
  file: File;
  id: string;
  preview: string;
  error?: string;
}

interface ImageUploaderProps {
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  onImagesChange: (images: ImageFile[]) => void;
  disabled?: boolean;
}

export function ImageUploader({
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  onImagesChange,
  disabled = false,
}: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `지원하지 않는 파일 형식입니다. (${acceptedTypes.map(t => t.split('/')[1]).join(', ')} 파일만 업로드 가능)`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `파일 크기가 ${maxFileSize}MB를 초과합니다.`;
    }
    
    return null;
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newImages: ImageFile[] = [];
    let hasError = false;

    if (images.length + fileArray.length > maxFiles) {
      setError(`최대 ${maxFiles}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    for (const file of fileArray) {
      const validationError = validateFile(file);
      
      if (validationError) {
        hasError = true;
        newImages.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          preview: '',
          error: validationError,
        });
        continue;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      newImages.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview,
      });
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages.filter(img => !img.error));
    
    if (hasError) {
      setError('일부 파일에 문제가 있습니다.');
    } else {
      setError(null);
    }
  }, [images, maxFiles, onImagesChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [disabled, processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [disabled, processFiles]);

  const removeImage = useCallback((id: string) => {
    if (disabled) return;
    
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages.filter(img => !img.error));
    
    if (updatedImages.length === 0) {
      setError(null);
    }
  }, [images, disabled, onImagesChange]);

  const openFileDialog = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-muted rounded-full">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          
          <div>
            <p className="text-lg font-medium mb-2">이미지를 업로드하세요</p>
            <p className="text-sm text-muted-foreground mb-4">
              파일을 드래그하거나 클릭하여 선택하세요
            </p>
            <Button variant="outline" type="button" disabled={disabled}>
              <Upload className="h-4 w-4 mr-2" />
              파일 선택
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>지원 형식: {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}</p>
            <p>최대 파일 크기: {maxFileSize}MB</p>
            <p>최대 {maxFiles}개 파일</p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-3 block">
            업로드할 이미지 ({images.filter(img => !img.error).length}/{maxFiles})
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="relative group overflow-hidden">
                {image.error ? (
                  <div className="aspect-square bg-red-50 border border-red-200 rounded-lg flex items-center justify-center p-4">
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-xs text-red-600 break-words">
                        {image.error}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square relative">
                    <Image
                      src={image.preview}
                      alt={`Preview ${image.id}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  </div>
                )}
                
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                  <p className="truncate" title={image.file.name}>
                    {image.file.name}
                  </p>
                  <p>{(image.file.size / (1024 * 1024)).toFixed(1)}MB</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}