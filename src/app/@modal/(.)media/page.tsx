import Modal from '@/components/modal';
import { Film } from 'lucide-react';

export default function MediaModal() {
  return (
    <Modal>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center">
            <Film className="h-6 w-6 mr-2 text-primary" />
            미디어
          </h1>
          <p className="text-muted-foreground mt-1">
            업로드된 미디어 파일들을 확인하고 관리하세요
          </p>
        </div>
        
        <div className="text-center py-12">
          <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">미디어 기능 개발 중</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            곧 다양한 미디어 파일들을 확인하고 관리할 수 있는 기능이 추가될 예정입니다.
          </p>
        </div>
      </div>
    </Modal>
  );
}