'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getParticipants } from '@/lib/actions';
import { Search, Users, MapPin, Instagram, AlertCircle, Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export function ParticipantList() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCafeId, setSelectedCafeId] = useState<string>('all');

  // Load participants
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setLoading(true);
        const participantList = await getParticipants();
        setParticipants(participantList as unknown as Participant[]);
        setError(null);
      } catch (err) {
        console.error('Error loading participants:', err);
        setError(err instanceof Error ? err.message : '참가자 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, []);

  // Get unique cafes for filtering
  const uniqueCafes = useMemo(() => {
    const cafeMap = new Map();
    participants.forEach(participant => {
      if (participant.cafe) {
        cafeMap.set(participant.cafe.id, participant.cafe);
      }
    });
    return Array.from(cafeMap.values());
  }, [participants]);

  // Filter participants based on search term and cafe
  const filteredParticipants = useMemo(() => {
    let filtered = participants;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(participant =>
        participant.name.toLowerCase().includes(term) ||
        participant.instagram?.toLowerCase().includes(term) ||
        participant.cafe?.name.toLowerCase().includes(term) ||
        participant.cafe?.address.toLowerCase().includes(term)
      );
    }

    // Filter by cafe
    if (selectedCafeId !== 'all') {
      filtered = filtered.filter(participant => participant.cafeId === selectedCafeId);
    }

    return filtered;
  }, [participants, searchTerm, selectedCafeId]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCafeId('all');
  };

  const hasActiveFilters = searchTerm || selectedCafeId !== 'all';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="이름, 인스타그램, 카페명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Cafe Filter */}
          <Select value={selectedCafeId} onValueChange={setSelectedCafeId}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="카페 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카페</SelectItem>
              {uniqueCafes.map((cafe) => (
                <SelectItem key={cafe.id} value={cafe.id}>
                  {cafe.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters & Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-2"
              >
                <X className="h-3 w-3 mr-1" />
                필터 초기화
              </Button>
            )}
            
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                검색: {searchTerm}
              </Badge>
            )}
            
            {selectedCafeId !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                카페: {uniqueCafes.find(cafe => cafe.id === selectedCafeId)?.name}
              </Badge>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredParticipants.length}명의 참가자
            {filteredParticipants.length !== participants.length && (
              <span className="text-primary">
                {' '}(전체 {participants.length}명 중)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Participant Cards */}
      {filteredParticipants.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              {hasActiveFilters ? '검색 조건에 맞는 참가자가 없습니다.' : '아직 참가자가 없습니다.'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                필터 초기화
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredParticipants.map((participant) => (
            <Card key={participant.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    {/* Name */}
                    <div>
                      <h3 className="font-semibold text-lg">{participant.name}</h3>
                    </div>

                    {/* Instagram */}
                    {participant.instagram && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Instagram className="h-4 w-4 mr-2" />
                        <span className="font-mono">@{participant.instagram}</span>
                      </div>
                    )}

                    {/* Cafe Info */}
                    {participant.cafe && (
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {participant.cafe.name}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="text-xs">{participant.cafe.address}</span>
                        </div>
                      </div>
                    )}

                    {/* Join Date */}
                    <div className="text-xs text-muted-foreground">
                      참가일: {new Date(participant.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {participant.instagram && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(`https://instagram.com/${participant.instagram}`, '_blank')}
                      >
                        <Instagram className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {participants.length > 0 && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">참가자 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">총 참가자</p>
                <p className="text-2xl font-bold text-primary">{participants.length}명</p>
              </div>
              <div>
                <p className="font-medium">참여 카페</p>
                <p className="text-2xl font-bold text-primary">{uniqueCafes.length}개</p>
              </div>
              <div>
                <p className="font-medium">인스타그램 연동</p>
                <p className="text-2xl font-bold text-primary">
                  {participants.filter(p => p.instagram).length}명
                </p>
              </div>
              <div>
                <p className="font-medium">최근 참가</p>
                <p className="text-sm text-muted-foreground">
                  {participants.length > 0
                    ? new Date(Math.max(...participants.map(p => new Date(p.createdAt).getTime())))
                        .toLocaleDateString('ko-KR')
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}