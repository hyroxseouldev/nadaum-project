'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCafes } from '@/lib/actions';
import { MapPin, Filter } from 'lucide-react';

interface Cafe {
  id: string;
  name: string;
  address: string;
  value: number | null;
}

interface CafeFilterProps {
  selectedCafeId?: string;
  onCafeSelect: (cafeId?: string) => void;
}

export function CafeFilter({ selectedCafeId, onCafeSelect }: CafeFilterProps) {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCafes = async () => {
      try {
        const cafeList = await getCafes();
        setCafes(cafeList);
      } catch (err) {
        setError(err instanceof Error ? err.message : '카페 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadCafes();
  }, []);

  const selectedCafe = cafes.find(cafe => cafe.id === selectedCafeId);

  if (loading) {
    return (
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">카페별 필터</span>
        </div>
        <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">카페별 필터</span>
          </div>
          
          {/* Desktop: Select dropdown */}
          <div className="hidden sm:block">
            <Select
              value={selectedCafeId || 'all'}
              onValueChange={(value) => onCafeSelect(value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="카페 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카페</SelectItem>
                {cafes.map((cafe) => (
                  <SelectItem key={cafe.id} value={cafe.id}>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{cafe.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile: Button grid */}
          <div className="sm:hidden w-full">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedCafeId ? 'outline' : 'default'}
                size="sm"
                onClick={() => onCafeSelect(undefined)}
                className="justify-start"
              >
                전체 카페
              </Button>
              {cafes.slice(0, 7).map((cafe) => (
                <Button
                  key={cafe.id}
                  variant={selectedCafeId === cafe.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onCafeSelect(cafe.id)}
                  className="justify-start text-xs"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{cafe.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Current selection indicator */}
        {selectedCafe && (
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{selectedCafe.name}</span>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCafeSelect(undefined)}
              className="text-muted-foreground hover:text-foreground"
            >
              필터 해제
            </Button>
          </div>
        )}
      </div>

      {/* Cafe count info */}
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {selectedCafe
            ? `${selectedCafe.name}의 게스트 포토`
            : `총 ${cafes.length}개의 카페`}
        </p>
        {selectedCafe && (
          <p className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-48">{selectedCafe.address}</span>
          </p>
        )}
      </div>
    </div>
  );
}