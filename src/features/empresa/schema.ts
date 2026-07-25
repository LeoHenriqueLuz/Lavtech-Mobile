import { z } from 'zod';

export const empresaSchema = z.object({
  nomeFantasia: z.string().optional(),
  razaoSocial: z.string().optional(),
  cnpj: z.string().optional(),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  endereco: z.string().optional(),
  horarioFuncionamento: z.string().optional(),
  rodapePdf: z.string().optional(),
  corPrincipal: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Use uma cor hexadecimal válida, ex: #1E90FF'),
});

export type EmpresaFormData = z.infer<typeof empresaSchema>;

export const empresaFormDefaultValues: EmpresaFormData = {
  nomeFantasia: '',
  razaoSocial: '',
  cnpj: '',
  telefone: '',
  whatsapp: '',
  email: '',
  endereco: '',
  horarioFuncionamento: '',
  rodapePdf: '',
  corPrincipal: '#1E90FF',
};
