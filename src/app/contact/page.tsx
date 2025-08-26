'use client';

import { Button } from '@/components/ui/button';
import { ParticipantList } from '@/components/participant-list';
import { ArrowLeft, Users, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Users className="h-6 w-6 mr-2 text-primary" />
                참가자 정보
              </h1>
              <p className="text-muted-foreground mt-1">
                게스트 포토 플랫폼에 참여한 사용자들의 정보를 확인하세요
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/upload">
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                게스트 포토 업로드
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden mb-6 flex justify-center">
          <Link href="/upload">
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              게스트 포토 업로드
            </Button>
          </Link>
        </div>

        {/* Participant List */}
        <ParticipantList />
      </div>
    </div>
  );
}
