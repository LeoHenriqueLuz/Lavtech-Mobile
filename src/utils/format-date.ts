import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/** Converte uma data ISO 8601 (armazenamento) para dd/MM/yyyy (exibição). */
export function formatDate(iso: string): string {
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR });
}

/** Converte uma data ISO 8601 para dd/MM/yyyy HH:mm (exibição com hora). */
export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

/** Aplica a máscara dd/MM/yyyy a uma entrada digitada livremente (mantém apenas dígitos). */
export function maskDataBr(texto: string): string {
  const digitos = texto.replace(/\D/g, '').slice(0, 8);
  const dia = digitos.slice(0, 2);
  const mes = digitos.slice(2, 4);
  const ano = digitos.slice(4, 8);
  return [dia, mes, ano].filter(Boolean).join('/');
}
