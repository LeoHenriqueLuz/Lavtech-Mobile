import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { EmpresaFormData } from './schema';

const QUERY_KEY = ['configuracoes-empresa'];

export function useConfiguracoesEmpresa() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: api.getConfiguracoesEmpresa,
  });
}

export function useUpdateConfiguracoesEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: EmpresaFormData) => api.updateConfiguracoesEmpresa(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uri: string) => {
      const logoUrl = await api.uploadLogo(uri);
      await api.updateLogoUrl(logoUrl);
      return logoUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
