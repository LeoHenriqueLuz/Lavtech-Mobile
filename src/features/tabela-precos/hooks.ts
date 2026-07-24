import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { PrecoFormData } from './schema';

export function usePrecosVigentes() {
  return useQuery({
    queryKey: ['precos-vigentes'],
    queryFn: () => api.listPrecosVigentes(),
  });
}

export function useHistoricoPrecos(tipoId: string) {
  return useQuery({
    queryKey: ['historico-precos', tipoId],
    queryFn: () => api.listHistoricoPorTipo(tipoId),
    enabled: Boolean(tipoId),
  });
}

export function useCreatePreco(tipoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: PrecoFormData) => api.createPreco(tipoId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico-precos', tipoId] });
      queryClient.invalidateQueries({ queryKey: ['precos-vigentes'] });
    },
  });
}

export function useSetPrecoAtivo(tipoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => api.setPrecoAtivo(id, ativo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico-precos', tipoId] });
      queryClient.invalidateQueries({ queryKey: ['precos-vigentes'] });
    },
  });
}
