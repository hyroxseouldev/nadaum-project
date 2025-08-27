'use client';

import { Button } from '@/components/ui/button';
import { AdminDashboard } from '@/components/admin-dashboard';
import { ArrowLeft, Shield, AlertTriangle, LogOut, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success('로그아웃 되었습니다.');
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다.');
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <Shield className="h-6 w-6 mr-2 text-primary" />
                관리자 대시보드
              </h1>
              <p className="text-muted-foreground mt-1">
                게스트 포토, 카페, 참가자를 관리하세요
              </p>
            </div>
          </div>
          
          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <User className="h-4 w-4 mr-2" />
              {user?.email}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </Button>
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
