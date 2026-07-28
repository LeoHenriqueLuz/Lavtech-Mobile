const DDI_BRASIL = '55';

/** Remove tudo que não é dígito e garante o DDI do Brasil (o cadastro de cliente não aplica máscara). */
export function normalizarWhatsapp(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  return digitos.startsWith(DDI_BRASIL) ? digitos : `${DDI_BRASIL}${digitos}`;
}

export function buildLinkWhatsapp(whatsapp: string, mensagem: string): string {
  return `https://wa.me/${normalizarWhatsapp(whatsapp)}?text=${encodeURIComponent(mensagem)}`;
}

export function buildMensagemLembrete(nomeCliente: string): string {
  return `Olá, ${nomeCliente}!

Passando para lembrar que já faz algum tempo desde a última lavagem das suas persianas.

Mesmo quando parecem limpas, elas acumulam poeira, ácaros e outras impurezas que podem comprometer a durabilidade do tecido e a qualidade do ambiente.

Se desejar solicitar um novo orçamento, estamos à disposição.

https://SEUSITE.com.br

Equipe LavTech.`;
}
