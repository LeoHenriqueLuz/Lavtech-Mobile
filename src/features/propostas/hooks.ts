import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AjusteValorFormData } from '@/schemas/ajuste-valor';
import * as api from './api';
import type { ItemPropostaParaCriar } from './api';
import type { PropostaFormData } from './schema';
import type { StatusProposta } from './status';

export function usePropostas() {
  return useQuery({
    queryKey: ['propostas'],
    queryFn: () => api.listPropostas(),
  });
}

export function useProposta(id: string) {
  return useQuery({
    queryKey: ['proposta', id],
    queryFn: () => api.getProposta(id),
    enabled: Boolean(id),
  });
}

interface CreatePropostaInput {
  responsavelId: string;
  itens: ItemPropostaParaCriar[];
  form: PropostaFormData;
}

export function useCreateProposta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ responsavelId, itens, form }: CreatePropostaInput) =>
      api.createProposta(responsavelId, itens, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
    },
  });
}

export function useUpdateStatusProposta(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: StatusProposta) => api.updateStatusProposta(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      queryClient.invalidateQueries({ queryKey: ['proposta', id] });
    },
  });
}

export function useUpdateItemValorProposta(propostaId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, form }: { itemId: string; form: AjusteValorFormData }) =>
      api.updateItemValorProposta(itemId, propostaId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposta', propostaId] });
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
    },
  });
}

export function useDuplicateProposta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.duplicateProposta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
    },
  });
}

export function useDeleteProposta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteProposta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
    },
  });
}
