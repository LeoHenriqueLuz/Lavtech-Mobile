interface ItemCalculavel {
  quantidade: number;
  valorUnitarioAplicado: number;
}

/** Soma quantidade × valor unitário aplicado de uma lista de itens (OS ou Proposta). */
export function somarItens(itens: ItemCalculavel[]): number {
  return itens.reduce((soma, item) => soma + item.valorUnitarioAplicado * item.quantidade, 0);
}
