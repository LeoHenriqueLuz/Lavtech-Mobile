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
