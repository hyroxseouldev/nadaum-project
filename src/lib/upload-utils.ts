'use client';

import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import { createGuestPhoto } from '@/lib/actions';
import { optimizeImage, generateThumbnail, removeExifData } from '@/lib/image-utils';

export interface UploadProgress {
  stage: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  currentFile?: string;
  completed: number;
  total: number;
  errors: string[];
}

export interface ImageFile {
  file: File;
  id: string;
  preview: string;
}

/**
 * Uploads images to Supabase Storage and creates database records
 */
export async function uploadImages(
  images: ImageFile[],
  cafeId: string,
  onProgress: (progress: UploadProgress) => void
): Promise<{ success: boolean; uploadedCount: number; errors: string[] }> {
  const total = images.length;
  let completed = 0;
  const errors: string[] = [];

  // Initial progress
  onProgress({
    stage: 'processing',
    progress: 0,
    completed: 0,
    total,
    errors: [],
  });

  for (let i = 0; i < images.length; i++) {
    const imageFile = images[i];
    
    try {
      // Update progress - processing stage
      onProgress({
        stage: 'processing',
        progress: (i / total) * 50, // First 50% for processing
        currentFile: imageFile.file.name,
        completed,
        total,
        errors: [...errors],
      });

      // Step 1: Remove EXIF data for privacy
      const cleanedFile = await removeExifData(imageFile.file);
      
      // Step 2: Optimize image
      const optimized = await optimizeImage(cleanedFile, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.8,
        format: 'webp',
      });

      // Step 3: Generate thumbnail
      const thumbnail = await generateThumbnail(optimized.file, 300);

      // Update progress - uploading stage
      onProgress({
        stage: 'uploading',
        progress: 50 + (i / total) * 40, // Next 40% for uploading
        currentFile: imageFile.file.name,
        completed,
        total,
        errors: [...errors],
      });

      // Step 4: Upload to Supabase Storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const mainImagePath = `images/${fileName}.webp`;
      const thumbnailPath = `thumbnails/${fileName}.webp`;

      // Upload main image
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(mainImagePath, optimized.file, {
          contentType: 'image/webp',
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`메인 이미지 업로드 실패: ${uploadError.message}`);
      }

      // Upload thumbnail
      const { error: thumbError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(thumbnailPath, thumbnail, {
          contentType: 'image/webp',
          cacheControl: '3600',
          upsert: false,
        });

      if (thumbError) {
        // Thumbnail upload failure is not critical, log but continue
        console.warn('Thumbnail upload failed:', thumbError);
      }

      // Step 5: Get public URLs
      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(mainImagePath);

      const { data: thumbUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(thumbnailPath);

      // Step 6: Create database record
      await createGuestPhoto(publicUrlData.publicUrl, cafeId, {
        thumbnailUrl: thumbUrlData.publicUrl,
        originalFileName: imageFile.file.name,
        fileSize: optimized.file.size,
        dimensions: optimized.dimensions,
        sizeReduction: optimized.sizeReduction,
        uploadedAt: new Date().toISOString(),
      });

      completed++;

      // Update progress
      onProgress({
        stage: 'uploading',
        progress: 50 + ((i + 1) / total) * 40,
        currentFile: imageFile.file.name,
        completed,
        total,
        errors: [...errors],
      });

    } catch (error) {
      console.error(`Error uploading ${imageFile.file.name}:`, error);
      errors.push(
        `${imageFile.file.name}: ${
          error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        }`
      );
    }
  }

  // Final progress
  const finalStage = errors.length > 0 && completed === 0 ? 'error' : 'completed';
  onProgress({
    stage: finalStage,
    progress: 100,
    completed,
    total,
    errors: [...errors],
  });

  return {
    success: completed > 0,
    uploadedCount: completed,
    errors,
  };
}

/**
 * Creates storage bucket if it doesn't exist
 */
export async function ensureStorageBucket(): Promise<void> {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.warn('Could not list buckets:', listError);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
      });

      if (createError) {
        console.error('Failed to create storage bucket:', createError);
      }
    }
  } catch (error) {
    console.error('Storage bucket check failed:', error);
  }
}