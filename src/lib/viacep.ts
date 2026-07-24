export interface EnderecoViaCep {
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface ViaCepResponse {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

/** Busca endereço a partir de um CEP via ViaCEP. Retorna null se não encontrado ou em erro de rede. */
export async function fetchAddressByCep(cep: string): Promise<EnderecoViaCep | null> {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    if (!response.ok) return null;

    const data = (await response.json()) as ViaCepResponse;
    if (data.erro) return null;

    return {
      logradouro: data.logradouro ?? '',
      bairro: data.bairro ?? '',
      cidade: data.localidade ?? '',
      estado: data.uf ?? '',
    };
  } catch {
    return null;
  }
}
