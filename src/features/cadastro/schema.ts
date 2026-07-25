import { z } from 'zod';

export const cadastroSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  senha: z
    .string()
    .min(1, 'Informe a senha')
    .regex(/^\d{6}$/, 'A senha deve ter exatamente 6 números'),
  codigoAcesso: z.string().min(1, 'Informe o código de acesso'),
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;

export const cadastroFormDefaultValues: CadastroFormData = {
  nome: '',
  email: '',
  senha: '',
  codigoAcesso: '',
};
