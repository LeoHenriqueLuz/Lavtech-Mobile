import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { CatalogoTabela } from './api';

export function useCatalogo(tabela: CatalogoTabela, includeInactive = false) {
  return useQuery({
    queryKey: ['catalogo', tabela, includeInactive],
    queryFn: () => api.listItens(tabela, { includeInactive }),
  });
}

export function useCatalogoItem(tabela: CatalogoTabela, id: string) {
  return useQuery({
    queryKey: ['catalogo-item', tabela, id],
    queryFn: () => api.getItem(tabela, id),
    enabled: Boolean(id),
  });
}

export function useCreateItemCatalogo(tabela: CatalogoTabela) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nome: string) => api.createItem(tabela, nome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogo', tabela] });
    },
  });
}

export function useSetItemCatalogoAtivo(tabela: CatalogoTabela) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) => api.setItemAtivo(tabela, id, ativo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogo', tabela] });
    },
  });
}
