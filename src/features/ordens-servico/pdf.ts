import { formatAmbiente } from '@/features/persianas/api';
import type { ConfiguracoesEmpresa } from '@/features/empresa/api';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { OrdemServicoDetalhe } from './api';

function escapeHtml(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, Helvetica, Arial, sans-serif;
            color: #1A1A1A;
            padding: 36px;
            font-size: 13px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }
          .header img { max-height: 90px; max-width: 220px; object-fit: contain; }
          .contato { text-align: right; color: #555; font-size: 11px; }
          .contato p { margin: 2px 0; }
          .divisor { border: none; border-top: 2px solid ${cor}; margin: 0 0 24px; }
          .titulo { text-align: center; margin-bottom: 20px; }
          .titulo h1 { margin: 0; font-size: 22px; letter-spacing: 0.5px; color: ${cor}; }
          .titulo p { margin: 4px 0 0; font-size: 13px; color: #444; }
          .info-box {
            border: 1px solid #CCC;
            border-radius: 4px;
            padding: 12px 16px;
            margin-bottom: 20px;
          }
          .info-box p { margin: 3px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          th {
            background: ${cor};
            color: #FFFFFF;
            padding: 8px;
            font-size: 11px;
            text-align: left;
          }
          td { padding: 8px; border-bottom: 1px solid #E5E5E5; font-size: 12px; }
          .center { text-align: center; }
          .right { text-align: right; }
          .totais { width: 300px; margin-left: auto; margin-bottom: 24px; }
          .totais p { display: flex; justify-content: space-between; margin: 4px 0; }
          .totais .final {
            font-size: 15px;
            font-weight: 700;
            color: ${cor};
            border-top: 1px solid #E5E5E5;
            padding-top: 6px;
            margin-top: 6px;
          }
          .caixas { display: flex; gap: 12px; margin-bottom: 20px; }
          .caixa {
            flex: 1;
            border: 1px solid #CCC;
            border-radius: 4px;
            padding: 8px 12px;
          }
          .caixa h4 {
            margin: 0 0 4px;
            font-size: 10px;
            letter-spacing: 0.5px;
            color: #777;
          }
          .caixa p { margin: 0; font-size: 12px; }
          .observacoes { margin-bottom: 20px; }
          .observacoes h4 { margin: 0 0 4px; font-size: 12px; color: ${cor}; }
          .observacoes p { margin: 2px 0; font-size: 12px; white-space: pre-line; }
          .assinaturas {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 56px;
            gap: 40px;
          }
          .assinatura-cliente { flex: 1; }
          .assinatura-cliente .linha { border-top: 1px solid #333; margin-bottom: 6px; }
          .assinatura-cliente p { font-size: 10px; color: #777; margin: 0; }
          .assinatura-empresa { text-align: right; }
          .assinatura-empresa .nome { font-weight: 700; margin: 0; font-size: 12px; }
          .assinatura-empresa p { margin: 2px 0; font-size: 11px; color: #555; }
          .footer {
            margin-top: 32px;
            padding-top: 12px;
            border-top: 1px solid #E5E5E5;
            font-size: 10px;
            color: #999;
            text-align: center;
          }
        </style>
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
