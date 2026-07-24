import { z } from 'zod';

const valorMonetarioRegex = /^\d+([.,]\d{1,2})?$/;

export const precoSchema = z.object({
  valorUnitario: z
    .string()
    .min(1, 'Informe o valor unitário')
    .regex(valorMonetarioRegex, 'Valor inválido')
    .refine((valor) => Number(valor.replace(',', '.')) > 0, 'Valor deve ser maior que zero'),
  valorManutencao: z
    .string()
    .regex(valorMonetarioRegex, 'Valor inválido')
    .optional()
    .or(z.literal('')),
});

export type PrecoFormData = z.infer<typeof precoSchema>;

export const precoFormDefaultValues: PrecoFormData = {
  valorUnitario: '',
  valorManutencao: '',
};
