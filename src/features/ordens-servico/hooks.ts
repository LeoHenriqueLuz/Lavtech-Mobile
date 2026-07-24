import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { ItemParaCriar } from './api';
import type { AjusteValorFormData, OrdemServicoFormData } from './schema';
import type { StatusOS } from './status';

export function useOrdensServico() {
  return useQuery({
    queryKey: ['ordens-servico'],
    queryFn: () => api.listOrdensServico(),
  });
}

export function useOrdemServico(id: string) {
  return useQuery({
    queryKey: ['ordem-servico', id],
    queryFn: () => api.getOrdemServico(id),
    enabled: Boolean(id),
  });
}

export function useOrdemAbertaDoCliente(clienteId: string) {
  return useQuery({
    queryKey: ['ordem-aberta-cliente', clienteId],
    queryFn: () => api.getOrdemAbertaPorCliente(clienteId),
    enabled: Boolean(clienteId),
  });
}

interface CreateOrdemServicoInput {
  clienteId: string;
  responsavelId: string;
  itens: ItemParaCriar[];
  form: OrdemServicoFormData;
}

export function useCreateOrdemServico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clienteId, responsavelId, itens, form }: CreateOrdemServicoInput) =>
      api.createOrdemServico(clienteId, responsavelId, itens, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-servico'] });
    },
  });
}

export function useUpdateStatusOrdemServico(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: StatusOS) => api.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-servico'] });
      queryClient.invalidateQueries({ queryKey: ['ordem-servico', id] });
    },
  });
}

export function useUpdateItemValor(ordemServicoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, form }: { itemId: string; form: AjusteValorFormData }) =>
      api.updateItemValor(itemId, ordemServicoId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordem-servico', ordemServicoId] });
      queryClient.invalidateQueries({ queryKey: ['ordens-servico'] });
    },
  });
}
