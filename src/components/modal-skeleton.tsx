import { Skeleton } from "@/components/ui/skeleton";

export function ModalSkeleton() {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-col gap-y-4 w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-2 w-full">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex gap-4 w-full">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ContactModalSkeleton() {
  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center p-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}