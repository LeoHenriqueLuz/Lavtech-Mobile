const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/** Formata um valor numérico como moeda brasileira (ex.: 1234.5 -> "R$ 1.234,50"). */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
