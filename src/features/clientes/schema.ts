import { z } from 'zod';

export const clienteSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  whatsapp: z.string().min(1, 'Informe o WhatsApp'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  cpfCnpj: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  observacoes: z.string().optional(),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;

export const clienteFormDefaultValues: ClienteFormData = {
  nome: '',
  whatsapp: '',
  email: '',
  cpfCnpj: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  observacoes: '',
};
