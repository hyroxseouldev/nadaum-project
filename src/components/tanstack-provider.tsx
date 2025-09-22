"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

export default function TanStackProvider({
  children,
}: {
  children: ReactNode;
}) {
  // QueryClient를 state로 관리하여 리렌더링 시에도 같은 인스턴스 유지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분
            gcTime: 1000 * 60 * 30, // 30분 (이전 cacheTime)
            refetchOnWindowFocus: false,
            retry: 3,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
