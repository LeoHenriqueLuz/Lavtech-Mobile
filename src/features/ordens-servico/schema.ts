import { z } from 'zod';

const valorMonetarioRegex = /^\d+([.,]\d{1,2})?$/;
const dataBrRegex = /^\d{2}\/\d{2}\/\d{4}$/;

export const ordemServicoFormSchema = z.object({
  formaPagamento: z.string().optional(),
  desconto: z.string().regex(valorMonetarioRegex, 'Valor inválido').optional().or(z.literal('')),
  dataPrevisaoEntrega: z
    .string()
    .regex(dataBrRegex, 'Use o formato dd/mm/aaaa')
    .optional()
    .or(z.literal('')),
  observacoes: z.string().optional(),
});

export type OrdemServicoFormData = z.infer<typeof ordemServicoFormSchema>;

export const ordemServicoFormDefaultValues: OrdemServicoFormData = {
  formaPagamento: '',
  desconto: '',
  dataPrevisaoEntrega: '',
  observacoes: '',
};
