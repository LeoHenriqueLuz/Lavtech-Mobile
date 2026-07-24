import { z } from 'zod';

export const persianaSchema = z.object({
  ambienteId: z.string().min(1, 'Selecione o ambiente'),
  tipoId: z.string().min(1, 'Selecione o tipo'),
  quantidade: z
    .string()
    .min(1, 'Informe a quantidade')
    .regex(/^\d+$/, 'Quantidade inválida')
    .refine((valor) => Number(valor) > 0, 'Quantidade deve ser maior que zero'),
  observacoes: z.string().optional(),
});

export type PersianaFormData = z.infer<typeof persianaSchema>;

export const persianaFormDefaultValues: PersianaFormData = {
  ambienteId: '',
  tipoId: '',
  quantidade: '1',
  observacoes: '',
};
