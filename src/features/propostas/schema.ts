import { z } from 'zod';

const valorMonetarioRegex = /^\d+([.,]\d{1,2})?$/;
const diasRegex = /^\d+$/;

export const OBSERVACOES_SUGERIDAS = 'Valores sujeitos à confirmação após visita técnica.';

export const propostaFormSchema = z.object({
  clienteNome: z.string().optional(),
  clienteWhatsapp: z.string().optional(),
  desconto: z.string().regex(valorMonetarioRegex, 'Valor inválido').optional().or(z.literal('')),
  validadeDias: z
    .string()
    .min(1, 'Informe a validade em dias')
    .regex(diasRegex, 'Informe um número de dias válido')
    .refine((dias) => Number(dias) > 0, 'A validade deve ser maior que zero'),
  observacoes: z.string().optional(),
});

export type PropostaFormData = z.infer<typeof propostaFormSchema>;

export const propostaFormDefaultValues: PropostaFormData = {
  clienteNome: '',
  clienteWhatsapp: '',
  desconto: '',
  validadeDias: '15',
  observacoes: OBSERVACOES_SUGERIDAS,
};
