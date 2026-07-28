import { useQuery } from '@tanstack/react-query';
import * as api from './api';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => api.getDashboardMetrics(),
  });
}

export function useOrdensEmAberto(limit = 5) {
  return useQuery({
    queryKey: ['dashboard-ordens-em-aberto', limit],
    queryFn: () => api.getOrdensEmAberto(limit),
  });
}

export function useEntregasAmanha() {
  return useQuery({
    queryKey: ['dashboard-entregas-amanha'],
    queryFn: () => api.getEntregasAmanha(),
  });
}
