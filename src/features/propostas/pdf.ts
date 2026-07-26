import type { ConfiguracoesEmpresa } from '@/features/empresa/api';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { escapeHtml, pdfBaseStyles } from '@/utils/pdf-html';
import type { PropostaDetalhe } from './api';

/** Monta o HTML do PDF da Proposta Comercial. Sem assinatura do cliente, conforme a spec. */
export function buildPropostaPdfHtml(
  proposta: PropostaDetalhe,
  empresa: ConfiguracoesEmpresa,
): string {
  const cor = /^#[0-9A-Fa-f]{6}$/.test(empresa.cor_principal) ? empresa.cor_principal : '#1E90FF';

  const linhasItens = proposta.itens
    .map((item) => {
      const subtotal = item.quantidade * item.valor_unitario_aplicado;
      return `
        <tr>
          <td class="center">${item.quantidade}</td>
          <td>${escapeHtml(item.tipo?.nome ?? '—')}</td>
          <td class="right">${formatCurrency(item.valor_unitario_aplicado)}</td>
          <td class="right"><strong>${formatCurrency(subtotal)}</strong></td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <style>${pdfBaseStyles(cor)}</style>
      </head>
      <body>
        <div class="header">
          ${empresa.logo_url ? `<img src="${escapeHtml(empresa.logo_url)}" />` : `<div><strong>${escapeHtml(empresa.nome_fantasia) || 'LavTech'}</strong></div>`}
          <div class="contato">
            ${empresa.endereco ? `<p>${escapeHtml(empresa.endereco)}</p>` : ''}
            ${empresa.whatsapp ? `<p>WhatsApp: ${escapeHtml(empresa.whatsapp)}</p>` : ''}
            ${empresa.cnpj ? `<p>CNPJ: ${escapeHtml(empresa.cnpj)}</p>` : ''}
          </div>
        </div>
        <hr class="divisor" />

        <div class="titulo">
          <h1>PROPOSTA COMERCIAL</h1>
          <p>Nº ${escapeHtml(proposta.numero)}</p>
        </div>

        <div class="info-box">
          <p>Cliente: <strong>${escapeHtml(proposta.cliente_nome) || 'Não informado'}</strong></p>
          ${proposta.cliente_whatsapp ? `<p>WhatsApp: ${escapeHtml(proposta.cliente_whatsapp)}</p>` : ''}
          <p>
            Data de Emissão: ${formatDate(proposta.created_at)}
            &nbsp;&nbsp;&nbsp;Validade: ${formatDate(proposta.data_validade)}
          </p>
        </div>

        <table>
          <thead>
            <tr>
              <th class="center">QTD</th>
              <th>DESCRIÇÃO DOS SERVIÇOS</th>
              <th class="right">UNIT.</th>
              <th class="right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${linhasItens}
          </tbody>
        </table>

        <div class="totais">
          <p><span>SUBTOTAL:</span><span>${formatCurrency(proposta.valor_subtotal)}</span></p>
          ${proposta.valor_desconto > 0 ? `<p><span>DESCONTO:</span><span>- ${formatCurrency(proposta.valor_desconto)}</span></p>` : ''}
          <p class="final"><span>VALOR TOTAL:</span><span>${formatCurrency(proposta.valor_final)}</span></p>
        </div>

        ${
          proposta.observacoes
            ? `<div class="observacoes">
                <h4>OBSERVAÇÕES</h4>
                <p>${escapeHtml(proposta.observacoes)}</p>
              </div>`
            : ''
        }

        <div class="assinaturas" style="justify-content: flex-end;">
          <div class="assinatura-empresa">
            <p class="nome">${escapeHtml(empresa.nome_fantasia) || 'LavTech'}</p>
            ${empresa.cnpj ? `<p>CNPJ: ${escapeHtml(empresa.cnpj)}</p>` : ''}
          </div>
        </div>

        ${empresa.rodape_pdf ? `<div class="footer"><p>${escapeHtml(empresa.rodape_pdf)}</p></div>` : ''}
      </body>
    </html>
  `;
}
