import { z } from 'zod';

const valorMonetarioRegex = /^\d+([.,]\d{1,2})?$/;

export const ajusteValorSchema = z.object({
  novoValor: z
    .string()
    .min(1, 'Informe o novo valor')
    .regex(valorMonetarioRegex, 'Valor inválido')
    .refine((valor) => Number(valor.replace(',', '.')) > 0, 'Valor deve ser maior que zero'),
  motivo: z.string().min(1, 'Informe o motivo do ajuste'),
});

export type AjusteValorFormData = z.infer<typeof ajusteValorSchema>;
