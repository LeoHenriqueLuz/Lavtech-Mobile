import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { ClienteFormData } from './schema';

interface UseClientesParams {
  search?: string;
  includeInactive?: boolean;
}

export function useClientes({ search, includeInactive }: UseClientesParams) {
  return useQuery({
    queryKey: ['clientes', search ?? '', includeInactive ?? false],
    queryFn: () => api.listClientes({ search, includeInactive }),
  });
}

export function useCliente(id: string) {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: () => api.getCliente(id),
    enabled: Boolean(id),
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: ClienteFormData) => api.createCliente(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

export function useUpdateCliente(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: ClienteFormData) => api.updateCliente(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['cliente', id] });
    },
  });
}

export function useSetClienteAtivo(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ativo: boolean) => api.setClienteAtivo(id, ativo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['cliente', id] });
    },
  });
}
