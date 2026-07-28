import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import * as api from './api';
import type { ClienteParaLembrete } from './api';
import { buildLinkWhatsapp, buildMensagemLembrete } from './whatsapp';

export function useLembretes() {
  return useQuery({
    queryKey: ['lembretes'],
    queryFn: () => api.listClientesParaLembrete(),
  });
}

export function useLembretesCount() {
  return useQuery({
    queryKey: ['lembretes'],
    queryFn: () => api.listClientesParaLembrete(),
    select: (data) => data.length,
  });
}

export function useEnviarLembrete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cliente: ClienteParaLembrete) => {
      const mensagem = buildMensagemLembrete(cliente.clienteNome);
      const link = buildLinkWhatsapp(cliente.clienteWhatsapp, mensagem);

      try {
        await Linking.openURL(link);
      } catch (error) {
        await api.registrarEnvioLembrete({
          clienteId: cliente.clienteId,
          ordemServicoId: cliente.ordemServicoId,
          mensagem,
          status: 'falha',
          mensagemErro: error instanceof Error ? error.message : 'Não foi possível abrir o WhatsApp.',
        });
        throw error;
      }

      await api.registrarEnvioLembrete({
        clienteId: cliente.clienteId,
        ordemServicoId: cliente.ordemServicoId,
        mensagem,
        status: 'sucesso',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
    },
  });
}
