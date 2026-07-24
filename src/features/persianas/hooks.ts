import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { PersianaFormData } from './schema';

export function usePersianas(clienteId: string, includeInactive = false) {
  return useQuery({
    queryKey: ['persianas', clienteId, includeInactive],
    queryFn: () => api.listPersianasByCliente(clienteId, { includeInactive }),
    enabled: Boolean(clienteId),
  });
}

export function useCreatePersiana(clienteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: PersianaFormData) => api.createPersiana(clienteId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persianas', clienteId] });
    },
  });
}

export function useUpdatePersiana(clienteId: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: PersianaFormData) => api.updatePersiana(id, clienteId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persianas', clienteId] });
    },
  });
}

export function useSetPersianaAtivo(clienteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => api.setPersianaAtivo(id, ativo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persianas', clienteId] });
    },
  });
}
