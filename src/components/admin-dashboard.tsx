'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  getAllGuestPhotos, 
  deleteGuestPhoto, 
  getCafes, 
  createCafe,
  updateCafe,
  getParticipants,
  createParticipant,
  updateParticipant,
  updateGuestPhoto
} from '@/lib/actions';
import {
  Camera,
  Check,
  Trash2,
  Plus,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  X,
  Edit,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface GuestPhoto {
  id: string;
  imageUrl: string;
  cafeId: string;
  createdAt: Date;
  adminApproval: boolean;
  cafe: {
    id: string;
    name: string;
    address: string;
  } | null;
}

interface Cafe {
  id: string;
  name: string;
  address: string;
  value: number | null;
}

interface Participant {
  id: string;
  name: string;
  instagram: string | null;
  cafeId: string;
  createdAt: Date;
  cafe: {
    id: string;
    name: string;
    address: string;
  } | null;
}

export function AdminDashboard() {
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  
  // Form states
  const [newCafe, setNewCafe] = useState({ name: '', address: '', value: '' });
  const [newParticipant, setNewParticipant] = useState({ name: '', instagram: '', cafeId: '' });
  const [showCafeDialog, setShowCafeDialog] = useState(false);
  const [showParticipantDialog, setShowParticipantDialog] = useState(false);
  
  // Edit states
  const [editingCafe, setEditingCafe] = useState<{id: string, name: string, address: string, value: number | null} | null>(null);
  const [editingParticipant, setEditingParticipant] = useState<{id: string, name: string, instagram: string, cafeId: string} | null>(null);
  const [updatingPhotos, setUpdatingPhotos] = useState<Set<string>>(new Set());

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const [photosData, cafesData, participantsData] = await Promise.all([
        getAllGuestPhotos(),
        getCafes(),
        getParticipants(),
      ]);
      
      setPhotos(photosData.data);
      setCafes(cafesData);
      setParticipants(participantsData as unknown as Participant[]);
      setError(null);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const handleDeletePhoto = async (photoId: string) => {
    try {
      await deleteGuestPhoto(photoId);
      setPhotos(photos.filter(photo => photo.id !== photoId));
      setSelectedPhotos(selectedPhotos.filter(id => id !== photoId));
      toast.success('게스트 포토가 삭제되었습니다.');
    } catch (error) {
      toast.error('삭제 처리 중 오류가 발생했습니다.');
    }
  };

  const handleBulkApprove = async () => {
    try {
      await Promise.all(selectedPhotos.map(id => updateGuestPhoto(id, { adminApproval: true })));
      loadData(); // Reload data to reflect changes
      setSelectedPhotos([]);
      toast.success(`${selectedPhotos.length}개의 게스트 포토가 승인되었습니다.`);
    } catch (error) {
      toast.error('일괄 승인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedPhotos.map(id => deleteGuestPhoto(id)));
      setPhotos(photos.filter(photo => !selectedPhotos.includes(photo.id)));
      setSelectedPhotos([]);
      toast.success(`${selectedPhotos.length}개의 게스트 포토가 삭제되었습니다.`);
    } catch (error) {
      toast.error('일괄 삭제 처리 중 오류가 발생했습니다.');
    }
  };

  const handleCreateCafe = async () => {
    try {
      const value = newCafe.value ? parseInt(newCafe.value) : undefined;
      const cafe = await createCafe(newCafe.name, newCafe.address, value);
      setCafes([...cafes, cafe]);
      setNewCafe({ name: '', address: '', value: '' });
      setShowCafeDialog(false);
      toast.success('새 카페가 추가되었습니다.');
    } catch (error) {
      toast.error('카페 추가 중 오류가 발생했습니다.');
    }
  };

  const handleCreateParticipant = async () => {
    try {
      await createParticipant(newParticipant.name, newParticipant.instagram, newParticipant.cafeId);
      loadData(); // Reload to get participant with cafe info
      setNewParticipant({ name: '', instagram: '', cafeId: '' });
      setShowParticipantDialog(false);
      toast.success('새 참가자가 추가되었습니다.');
    } catch (error) {
      toast.error('참가자 추가 중 오류가 발생했습니다.');
    }
  };

  // Edit handlers
  const handleUpdateCafe = async (id: string, name: string, address: string, value: number | null) => {
    try {
      await updateCafe(id, name, address, value || undefined);
      loadData();
      setEditingCafe(null);
      toast.success('카페 정보가 수정되었습니다.');
    } catch (error) {
      toast.error('카페 수정 중 오류가 발생했습니다.');
    }
  };

  const handleUpdateParticipant = async (id: string, name: string, instagram: string, cafeId: string) => {
    try {
      await updateParticipant(id, name, instagram, cafeId);
      loadData();
      setEditingParticipant(null);
      toast.success('참가자 정보가 수정되었습니다.');
    } catch (error) {
      toast.error('참가자 수정 중 오류가 발생했습니다.');
    }
  };

  const handleTogglePhotoApproval = async (id: string, currentStatus: boolean) => {
    try {
      setUpdatingPhotos(prev => new Set(prev).add(id));
      await updateGuestPhoto(id, { adminApproval: !currentStatus });
      loadData();
      toast.success(`게스트 포토가 ${!currentStatus ? '승인' : '승인 취소'}되었습니다.`);
    } catch (error) {
      toast.error('게스트 포토 상태 변경 중 오류가 발생했습니다.');
    } finally {
      setUpdatingPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const filteredPhotos = photos.filter(photo => {
    switch (filterStatus) {
      case 'pending':
        return !photo.adminApproval;
      case 'approved':
        return photo.adminApproval;
      default:
        return true;
    }
  });

  const stats = {
    totalPhotos: photos.length,
    pendingPhotos: photos.filter(p => !p.adminApproval).length,
    approvedPhotos: photos.filter(p => p.adminApproval).length,
    totalCafes: cafes.length,
    totalParticipants: participants.length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" className="ml-4" onClick={loadData}>
            다시 시도
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">총 게스트 포토</p>
                <p className="text-lg font-bold">{stats.totalPhotos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">승인 대기</p>
                <p className="text-lg font-bold text-orange-600">{stats.pendingPhotos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">승인됨</p>
                <p className="text-lg font-bold text-green-600">{stats.approvedPhotos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">카페</p>
                <p className="text-lg font-bold">{stats.totalCafes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">참가자</p>
                <p className="text-lg font-bold">{stats.totalParticipants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="photos">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="photos">게스트 포토 관리</TabsTrigger>
          <TabsTrigger value="cafes">카페 관리</TabsTrigger>
          <TabsTrigger value="participants">참가자 관리</TabsTrigger>
        </TabsList>

        {/* Guest Photos Tab */}
        <TabsContent value="photos" className="space-y-4">
          {/* Photo Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={filterStatus} onValueChange={(value: 'all' | 'pending' | 'approved') => setFilterStatus(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">승인 대기</SelectItem>
                  <SelectItem value="approved">승인됨</SelectItem>
                </SelectContent>
              </Select>
              
              {selectedPhotos.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedPhotos.length}개 선택됨
                  </span>
                  <Button size="sm" onClick={handleBulkApprove}>
                    <Check className="h-4 w-4 mr-1" />
                    일괄 승인
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        일괄 삭제
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          선택된 {selectedPhotos.length}개의 게스트 포토가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>삭제</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedPhotos.includes(photo.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPhotos([...selectedPhotos, photo.id]);
                        } else {
                          setSelectedPhotos(selectedPhotos.filter(id => id !== photo.id));
                        }
                      }}
                      className="bg-white/80 backdrop-blur"
                    />
                  </div>
                  
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant={photo.adminApproval ? 'default' : 'secondary'}>
                      {photo.adminApproval ? '승인됨' : '대기중'}
                    </Badge>
                  </div>

                  <div className="aspect-square relative">
                    <Image
                      src={photo.imageUrl}
                      alt="Guest photo"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    {photo.cafe && (
                      <Badge variant="outline" className="text-xs">
                        {photo.cafe.name}
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground">
                      업로드: {new Date(photo.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      variant={photo.adminApproval ? "secondary" : "default"}
                      onClick={() => handleTogglePhotoApproval(photo.id, photo.adminApproval)}
                      disabled={updatingPhotos.has(photo.id)}
                    >
                      {updatingPhotos.has(photo.id) ? (
                        <>...</>
                      ) : photo.adminApproval ? (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          승인 취소
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          승인
                        </>
                      )}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3 mr-1" />
                          삭제
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>게스트 포토 삭제</AlertDialogTitle>
                          <AlertDialogDescription>
                            이 게스트 포토를 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePhoto(photo.id)}>
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {filterStatus === 'all' ? '게스트 포토가 없습니다.' : 
                   filterStatus === 'pending' ? '승인 대기 중인 포토가 없습니다.' :
                   '승인된 포토가 없습니다.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Cafes Tab */}
        <TabsContent value="cafes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">카페 관리</h3>
            <Dialog open={showCafeDialog} onOpenChange={setShowCafeDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  새 카페 추가
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 카페 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cafe-name">카페명 *</Label>
                    <Input
                      id="cafe-name"
                      value={newCafe.name}
                      onChange={(e) => setNewCafe({ ...newCafe, name: e.target.value })}
                      placeholder="카페명을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cafe-address">주소 *</Label>
                    <Textarea
                      id="cafe-address"
                      value={newCafe.address}
                      onChange={(e) => setNewCafe({ ...newCafe, address: e.target.value })}
                      placeholder="카페 주소를 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cafe-value">가격대</Label>
                    <Input
                      id="cafe-value"
                      type="number"
                      value={newCafe.value}
                      onChange={(e) => setNewCafe({ ...newCafe, value: e.target.value })}
                      placeholder="가격대를 입력하세요 (선택사항)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCafeDialog(false)}>
                    취소
                  </Button>
                  <Button 
                    onClick={handleCreateCafe}
                    disabled={!newCafe.name || !newCafe.address}
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {cafes.map((cafe) => (
              <Card key={cafe.id}>
                <CardContent className="p-4">
                  {editingCafe?.id === cafe.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`edit-cafe-name-${cafe.id}`}>카페명</Label>
                        <Input
                          id={`edit-cafe-name-${cafe.id}`}
                          value={editingCafe.name}
                          onChange={(e) => setEditingCafe({ ...editingCafe, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-cafe-address-${cafe.id}`}>주소</Label>
                        <Input
                          id={`edit-cafe-address-${cafe.id}`}
                          value={editingCafe.address}
                          onChange={(e) => setEditingCafe({ ...editingCafe, address: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-cafe-value-${cafe.id}`}>가격대</Label>
                        <Input
                          id={`edit-cafe-value-${cafe.id}`}
                          type="number"
                          value={editingCafe.value || ''}
                          onChange={(e) => setEditingCafe({ ...editingCafe, value: e.target.value ? Number(e.target.value) : null })}
                          placeholder="원"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateCafe(editingCafe.id, editingCafe.name, editingCafe.address, editingCafe.value)}
                          disabled={!editingCafe.name || !editingCafe.address}
                        >
                          저장
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCafe(null)}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{cafe.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {cafe.address}
                        </p>
                        {cafe.value && (
                          <Badge variant="outline" className="text-xs">
                            가격대: {cafe.value?.toLocaleString()}원
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCafe({ id: cafe.id, name: cafe.name, address: cafe.address, value: cafe.value })}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        편집
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">참가자 관리</h3>
            <Dialog open={showParticipantDialog} onOpenChange={setShowParticipantDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  새 참가자 추가
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 참가자 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="participant-name">이름 *</Label>
                    <Input
                      id="participant-name"
                      value={newParticipant.name}
                      onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                      placeholder="참가자 이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="participant-instagram">인스타그램 ID</Label>
                    <Input
                      id="participant-instagram"
                      value={newParticipant.instagram}
                      onChange={(e) => setNewParticipant({ ...newParticipant, instagram: e.target.value })}
                      placeholder="@없이 입력하세요 (선택사항)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="participant-cafe">카페 *</Label>
                    <Select
                      value={newParticipant.cafeId}
                      onValueChange={(value) => setNewParticipant({ ...newParticipant, cafeId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카페를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {cafes.map((cafe) => (
                          <SelectItem key={cafe.id} value={cafe.id}>
                            {cafe.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowParticipantDialog(false)}>
                    취소
                  </Button>
                  <Button 
                    onClick={handleCreateParticipant}
                    disabled={!newParticipant.name || !newParticipant.cafeId}
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {participants.map((participant) => (
              <Card key={participant.id}>
                <CardContent className="p-4">
                  {editingParticipant?.id === participant.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`edit-participant-name-${participant.id}`}>이름</Label>
                        <Input
                          id={`edit-participant-name-${participant.id}`}
                          value={editingParticipant.name}
                          onChange={(e) => setEditingParticipant({ ...editingParticipant, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-participant-instagram-${participant.id}`}>인스타그램 ID</Label>
                        <Input
                          id={`edit-participant-instagram-${participant.id}`}
                          value={editingParticipant.instagram || ''}
                          onChange={(e) => setEditingParticipant({ ...editingParticipant, instagram: e.target.value })}
                          placeholder="@없이 입력하세요"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-participant-cafe-${participant.id}`}>카페</Label>
                        <Select
                          value={editingParticipant.cafeId}
                          onValueChange={(value) => setEditingParticipant({ ...editingParticipant, cafeId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="카페를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            {cafes.map((cafe) => (
                              <SelectItem key={cafe.id} value={cafe.id}>
                                {cafe.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateParticipant(editingParticipant.id, editingParticipant.name, editingParticipant.instagram, editingParticipant.cafeId)}
                          disabled={!editingParticipant.name || !editingParticipant.cafeId}
                        >
                          저장
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingParticipant(null)}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{participant.name}</h4>
                        {participant.instagram && (
                          <p className="text-sm text-muted-foreground">
                            @{participant.instagram}
                          </p>
                        )}
                        {participant.cafe && (
                          <Badge variant="outline" className="text-xs">
                            {participant.cafe.name}
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground">
                          가입일: {new Date(participant.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingParticipant({ 
                          id: participant.id, 
                          name: participant.name, 
                          instagram: participant.instagram || '', 
                          cafeId: participant.cafeId 
                        })}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        편집
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}