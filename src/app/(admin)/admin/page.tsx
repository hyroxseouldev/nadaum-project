'use client';

import { Button } from '@/components/ui/button';
import { AdminDashboard } from '@/components/admin-dashboard';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary" />
              관리자 대시보드
            </h1>
            <p className="text-muted-foreground mt-1">
              게스트 포토, 카페, 참가자를 관리하세요
            </p>
          </div>
        </div>

        {/* Admin Warning */}
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>관리자 권한이 필요합니다.</strong> 이 페이지의 기능을 사용하면 시스템 데이터가 변경됩니다. 
            신중하게 사용해주세요.
          </AlertDescription>
        </Alert>

        {/* Admin Dashboard */}
        <AdminDashboard />
      </div>
    </div>
  );
}
