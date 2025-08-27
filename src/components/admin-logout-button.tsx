'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/auth-actions';
import { useState } from 'react';
import { toast } from 'sonner';

export function AdminLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutAction();
      toast.success('로그아웃 되었습니다.');
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다.');
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
    </Button>
  );
}