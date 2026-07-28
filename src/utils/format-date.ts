import { differenceInMonths, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/** Converte uma data ISO 8601 (armazenamento) para dd/MM/yyyy (exibição). */
export function formatDate(iso: string): string {
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR });
}

/** Converte uma data ISO 8601 para dd/MM/yyyy HH:mm (exibição com hora). */
export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

/** Formata o tempo decorrido desde uma data ISO 8601, ex.: "11 meses", "1 ano e 1 mês". */
export function formatTempoDecorrido(iso: string): string {
  const meses = differenceInMonths(new Date(), parseISO(iso));
  const anos = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;

  if (anos === 0) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;

  const partes = [`${anos} ${anos === 1 ? 'ano' : 'anos'}`];
  if (mesesRestantes > 0) partes.push(`${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`);
  return partes.join(' e ');
}

/** Aplica a máscara dd/MM/yyyy a uma entrada digitada livremente (mantém apenas dígitos). */
export function maskDataBr(texto: string): string {
  const digitos = texto.replace(/\D/g, '').slice(0, 8);
  const dia = digitos.slice(0, 2);
  const mes = digitos.slice(2, 4);
  const ano = digitos.slice(4, 8);
  return [dia, mes, ano].filter(Boolean).join('/');
}
