const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const currencyCompactFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

/** Formata um valor numérico como moeda brasileira (ex.: 1234.5 -> "R$ 1.234,50"). */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** Formata moeda sem casas decimais, para labels compactos (ex.: 3250 -> "R$ 3.250"). */
export function formatCurrencyCompact(value: number): string {
  return currencyCompactFormatter.format(value);
}

/** Formata moeda em milhares, para rótulos de eixo de gráfico (ex.: 8000 -> "R$ 8k"). */
export function formatCurrencyThousands(value: number): string {
  if (value === 0) return 'R$ 0';
  const milhares = value / 1000;
  const texto = milhares % 1 === 0 ? milhares.toFixed(0) : milhares.toFixed(1);
  return `R$ ${texto}k`;
}
