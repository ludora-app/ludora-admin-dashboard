import { useQuery } from "@tanstack/react-query";

export interface PrometheusResponse {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      metric: Record<string, string>;
      value: [number, string];
    }>;
  };
}

export function usePrometheusMetric(type: string) {
  return useQuery<PrometheusResponse>({
    queryKey: ["prometheus", type],
    queryFn: async () => {
      const response = await fetch(`/api/metrics/prometheus?type=${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch metric");
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30s
  });
}
