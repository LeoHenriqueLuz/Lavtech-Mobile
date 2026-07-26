import { formatAmbiente } from '@/features/persianas/api';
import type { ConfiguracoesEmpresa } from '@/features/empresa/api';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { escapeHtml, pdfBaseStyles } from '@/utils/pdf-html';
import type { OrdemServicoDetalhe } from './api';

function enderecoCliente(cliente: OrdemServicoDetalhe['cliente']): string {
  if (!cliente) return '';
  const partes = [
    cliente.logradouro,
    cliente.numero,
    cliente.bairro,
    cliente.cidade,
    cliente.estado,
  ].filter(Boolean);
  return partes.join(', ');
}

/** Monta o HTML do PDF da Ordem de Serviço. Usa apenas o valor aplicado de cada item — nunca o valor de tabela, o motivo do ajuste ou a flag de ajuste manual. */
export function buildOrdemServicoPdfHtml(
  os: OrdemServicoDetalhe,
  empresa: ConfiguracoesEmpresa,
): string {
  const cor = /^#[0-9A-Fa-f]{6}$/.test(empresa.cor_principal) ? empresa.cor_principal : '#1E90FF';

  const linhasItens = os.itens
    .map((item) => {
      const ambiente = formatAmbiente(
        item.persiana?.ambiente?.nome,
        item.persiana?.ambiente_outro_descricao,
      );
      const tipo = item.persiana?.tipo?.nome ?? '—';
      const subtotal = item.quantidade * item.valor_unitario_aplicado;
      return `
        <tr>
          <td class="center">${item.quantidade}</td>
          <td>${escapeHtml(ambiente)} — ${escapeHtml(tipo)}</td>
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
          <h1>ORDEM DE SERVIÇO</h1>
          <p>Nº ${escapeHtml(os.numero)}</p>
        </div>

        <div class="info-box">
          <p>Cliente: <strong>${escapeHtml(os.cliente?.nome) || 'Cliente removido'}</strong></p>
          ${os.cliente?.whatsapp ? `<p>WhatsApp: ${escapeHtml(os.cliente.whatsapp)}</p>` : ''}
          ${os.cliente ? `<p>Endereço: ${escapeHtml(enderecoCliente(os.cliente))}</p>` : ''}
          <p>
            Data de Abertura: ${formatDate(os.data_abertura)}
            ${os.data_previsao_entrega ? `&nbsp;&nbsp;&nbsp;Previsão de Entrega: ${formatDate(os.data_previsao_entrega)}` : ''}
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
          <p><span>VALOR DOS SERVIÇOS:</span><span>${formatCurrency(os.valor_total)}</span></p>
          <p><span>MANUTENÇÃO:</span><span>+ ${formatCurrency(os.valor_manutencao)}</span></p>
          ${os.valor_desconto > 0 ? `<p><span>DESCONTO:</span><span>- ${formatCurrency(os.valor_desconto)}</span></p>` : ''}
          <p class="final"><span>VALOR TOTAL:</span><span>${formatCurrency(os.valor_final)}</span></p>
        </div>

        <div class="caixas">
          <div class="caixa">
            <h4>STATUS</h4>
            <p>${escapeHtml(os.status)}</p>
          </div>
          <div class="caixa">
            <h4>FORMA DE PAGAMENTO</h4>
            <p>${escapeHtml(os.forma_pagamento) || '—'}</p>
          </div>
          <div class="caixa">
            <h4>RESPONSÁVEL</h4>
            <p>${escapeHtml(os.responsavel?.nome) || '—'}</p>
          </div>
        </div>

        ${
          os.observacoes
            ? `<div class="observacoes">
                <h4>OBSERVAÇÕES</h4>
                <p>${escapeHtml(os.observacoes)}</p>
              </div>`
            : ''
        }

        <div class="assinaturas">
          <div class="assinatura-cliente">
            <div class="linha">&nbsp;</div>
            <p>ASSINATURA DO CLIENTE</p>
          </div>
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
