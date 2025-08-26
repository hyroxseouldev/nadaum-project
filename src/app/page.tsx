'use client';

import { useState } from 'react';
import { GuestPhotoFeed } from '@/components/guest-photo-feed';
import { CafeFilter } from '@/components/cafe-filter';
import { UploadButton } from '@/components/upload-button';
import { Button } from '@/components/ui/button';
import { Camera, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [selectedCafeId, setSelectedCafeId] = useState<string | undefined>();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Camera className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-semibold">Guest Photo</h1>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/contact">
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  참가자 정보
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  관리자
                </Button>
              </Link>
              <UploadButton size="sm" />
            </nav>

            {/* Mobile menu */}
            <div className="md:hidden flex items-center space-x-2">
              <UploadButton variant="outline" size="sm" showIcon={false} />
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Description */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            카페별 게스트 포토
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            다양한 카페에서 촬영된 게스트 포토들을 감상하고, 나만의 추억을 공유해보세요.
          </p>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden mb-6 flex justify-center space-x-2">
          <Link href="/contact">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-1" />
              참가자
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-1" />
              관리자
            </Button>
          </Link>
        </div>

        {/* Cafe Filter */}
        <CafeFilter
          selectedCafeId={selectedCafeId}
          onCafeSelect={setSelectedCafeId}
        />

        {/* Guest Photo Feed */}
        <GuestPhotoFeed selectedCafeId={selectedCafeId} />

        {/* Empty state with upload CTA */}
        <div className="text-center mt-12 py-12">
          <div className="max-w-md mx-auto">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">더 많은 추억을 공유해주세요</h3>
            <p className="text-muted-foreground mb-6">
              카페에서의 특별한 순간들을 다른 사람들과 나눠보세요.
            </p>
            <UploadButton size="lg" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Guest Photo Platform. All rights reserved.</p>
            <p className="mt-1">카페별 게스트 포토를 공유하고 관리하는 플랫폼</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
