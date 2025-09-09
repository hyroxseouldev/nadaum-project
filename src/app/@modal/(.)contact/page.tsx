'use client';

import Modal from '@/components/modal';
import { ParticipantList } from '@/components/participant-list';
import { Users, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ContactModal() {
  return (
    <Modal>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
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
        <div className="mb-6 flex justify-center">
          <Link href="/upload">
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              게스트 포토 업로드
            </Button>
          </Link>
        </div>

        {/* Participant List */}
        <ParticipantList />
      </div>
    </Modal>
  );
}