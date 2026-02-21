import { useQuery } from "@tanstack/react-query";
import * as statsApi from "@/lib/api/stats";

export function useStats() {
  const statsQuery = useQuery({
    queryKey: ["stats"],
    queryFn: () => statsApi.getStats(),
  });

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,
    error: statsQuery.error,
  };
}
