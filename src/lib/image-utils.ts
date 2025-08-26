/**
 * Image optimization utilities for the upload process
 */

export interface ImageOptimizationConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: 'webp' | 'jpeg' | 'png';
}

export const DEFAULT_OPTIMIZATION_CONFIG: ImageOptimizationConfig = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  format: 'webp',
};

export interface OptimizedImage {
  file: File;
  originalFile: File;
  sizeReduction: number; // percentage
  dimensions: { width: number; height: number };
}

/**
 * Optimizes an image file by resizing and compressing
 */
export async function optimizeImage(
  file: File,
  config: Partial<ImageOptimizationConfig> = {}
): Promise<OptimizedImage> {
  const finalConfig = { ...DEFAULT_OPTIMIZATION_CONFIG, ...config };
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > finalConfig.maxWidth || height > finalConfig.maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = Math.min(width, finalConfig.maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, finalConfig.maxHeight);
          width = height * aspectRatio;
        }
      }

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          const optimizedFile = new File(
            [blob],
            `optimized_${file.name.replace(/\.[^/.]+$/, '')}.${finalConfig.format}`,
            {
              type: `image/${finalConfig.format}`,
              lastModified: Date.now(),
            }
          );

          const sizeReduction = ((file.size - optimizedFile.size) / file.size) * 100;

          resolve({
            file: optimizedFile,
            originalFile: file,
            sizeReduction: Math.max(0, sizeReduction),
            dimensions: { width: Math.round(width), height: Math.round(height) },
          });
        },
        `image/${finalConfig.format}`,
        finalConfig.quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generates a thumbnail from an image file
 */
export async function generateThumbnail(
  file: File,
  size: number = 300
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      // Square thumbnail
      canvas.width = size;
      canvas.height = size;

      // Calculate crop dimensions for center crop
      const { width, height } = img;
      const minDim = Math.min(width, height);
      const x = (width - minDim) / 2;
      const y = (height - minDim) / 2;

      // Draw center-cropped square
      ctx.drawImage(img, x, y, minDim, minDim, 0, 0, size, size);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to generate thumbnail'));
            return;
          }

          const thumbnailFile = new File(
            [blob],
            `thumb_${file.name.replace(/\.[^/.]+$/, '')}.webp`,
            {
              type: 'image/webp',
              lastModified: Date.now(),
            }
          );

          resolve(thumbnailFile);
        },
        'image/webp',
        0.8
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for thumbnail'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validates image file
 */
export function validateImageFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    minWidth?: number;
    minHeight?: number;
  } = {}
): Promise<{ valid: boolean; error?: string; dimensions?: { width: number; height: number } }> {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    minWidth = 100,
    minHeight = 100,
  } = options;

  return new Promise((resolve) => {
    // Check file size
    if (file.size > maxSize) {
      resolve({
        valid: false,
        error: `파일 크기가 ${(maxSize / (1024 * 1024)).toFixed(1)}MB를 초과합니다.`,
      });
      return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      resolve({
        valid: false,
        error: `지원하지 않는 파일 형식입니다. (${allowedTypes.map(t => t.split('/')[1]).join(', ')} 파일만 업로드 가능)`,
      });
      return;
    }

    // Check dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width < minWidth || img.height < minHeight) {
        resolve({
          valid: false,
          error: `이미지 크기가 너무 작습니다. (최소 ${minWidth}x${minHeight}px)`,
          dimensions: { width: img.width, height: img.height },
        });
        return;
      }

      resolve({
        valid: true,
        dimensions: { width: img.width, height: img.height },
      });
    };

    img.onerror = () => {
      resolve({
        valid: false,
        error: '이미지 파일이 손상되었습니다.',
      });
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Removes EXIF data from image
 */
export async function removeExifData(file: File): Promise<File> {
  const optimized = await optimizeImage(file, {
    maxWidth: 4000,
    maxHeight: 4000,
    quality: 0.9,
    format: file.type.includes('png') ? 'png' : 'webp',
  });
  
  return optimized.file;
}