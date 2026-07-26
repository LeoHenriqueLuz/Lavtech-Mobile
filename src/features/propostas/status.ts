export const STATUS_PROPOSTA = ['Rascunho', 'Enviada', 'Aceita', 'Recusada', 'Expirada'] as const;

export type StatusProposta = (typeof STATUS_PROPOSTA)[number];

export function isStatusFinal(status: StatusProposta): boolean {
  return status === 'Aceita' || status === 'Recusada' || status === 'Expirada';
}

interface PropostaComValidade {
  status: string;
  data_validade: string;
}

/**
 * O app não roda jobs em background, então "Expirada" nunca é gravada automaticamente —
 * é sempre derivada aqui a partir da data de validade, sem alterar o status salvo no banco.
 */
export function getStatusEfetivo(proposta: PropostaComValidade): StatusProposta {
  const status = proposta.status as StatusProposta;
  if (
    (status === 'Rascunho' || status === 'Enviada') &&
    proposta.data_validade < new Date().toISOString().slice(0, 10)
  ) {
    return 'Expirada';
  }
  return status;
}
