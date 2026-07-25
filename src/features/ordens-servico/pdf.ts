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
    cliente.complemento,
    cliente.bairro,
    cliente.cidade && cliente.estado ? `${cliente.cidade}/${cliente.estado}` : cliente.cidade,
    cliente.cep,
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
      const subtotal =
        item.quantidade * item.valor_unitario_aplicado +
        item.quantidade * item.valor_manutencao_aplicado;
      return `
        <tr>
          <td>${escapeHtml(ambiente)} · ${escapeHtml(tipo)}</td>
          <td class="center">${item.quantidade}</td>
          <td class="right">${formatCurrency(item.valor_unitario_aplicado)}</td>
          <td class="right">${formatCurrency(subtotal)}</td>
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
            padding: 32px;
            font-size: 13px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid ${cor};
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .header img { max-height: 64px; max-width: 160px; object-fit: contain; }
          .header .empresa { text-align: right; }
          .empresa h1 { margin: 0; font-size: 18px; color: ${cor}; }
          .empresa p { margin: 2px 0; color: #555; font-size: 11px; }
          .os-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .os-title h2 { margin: 0; font-size: 20px; }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 999px;
            background: ${cor}22;
            color: ${cor};
            font-size: 12px;
            font-weight: 600;
          }
          .section { margin-bottom: 20px; }
          .section h3 {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #777;
            margin: 0 0 6px;
          }
          .section p { margin: 2px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 8px; border-bottom: 1px solid #E5E5E5; font-size: 12px; text-align: left; }
          th { color: #777; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
          .center { text-align: center; }
          .right { text-align: right; }
          .totais { width: 260px; margin-left: auto; }
          .totais p { display: flex; justify-content: space-between; margin: 4px 0; }
          .totais .final { font-size: 15px; font-weight: 700; border-top: 1px solid #E5E5E5; padding-top: 6px; margin-top: 6px; }
          .assinaturas { display: flex; justify-content: space-between; margin-top: 56px; gap: 40px; }
          .assinatura { flex: 1; text-align: center; }
          .assinatura .linha { border-top: 1px solid #333; margin-bottom: 6px; }
          .assinatura p { font-size: 11px; color: #555; margin: 0; }
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
          ${empresa.logo_url ? `<img src="${escapeHtml(empresa.logo_url)}" />` : '<div></div>'}
          <div class="empresa">
            <h1>${escapeHtml(empresa.nome_fantasia) || 'LavTech'}</h1>
            ${empresa.razao_social ? `<p>${escapeHtml(empresa.razao_social)}</p>` : ''}
            ${empresa.cnpj ? `<p>CNPJ: ${escapeHtml(empresa.cnpj)}</p>` : ''}
            ${empresa.telefone || empresa.whatsapp ? `<p>${escapeHtml(empresa.telefone || empresa.whatsapp)}</p>` : ''}
            ${empresa.email ? `<p>${escapeHtml(empresa.email)}</p>` : ''}
          </div>
        </div>

        <div class="os-title">
          <h2>Ordem de Serviço ${escapeHtml(os.numero)}</h2>
          <span class="status-badge">${escapeHtml(os.status)}</span>
        </div>

        <div class="section">
          <h3>Cliente</h3>
          <p><strong>${escapeHtml(os.cliente?.nome) || 'Cliente removido'}</strong></p>
          ${os.cliente?.whatsapp ? `<p>WhatsApp: ${escapeHtml(os.cliente.whatsapp)}</p>` : ''}
          ${os.cliente?.email ? `<p>E-mail: ${escapeHtml(os.cliente.email)}</p>` : ''}
          ${os.cliente ? `<p>${escapeHtml(enderecoCliente(os.cliente))}</p>` : ''}
        </div>

        <div class="section">
          <h3>Datas</h3>
          <p>Abertura: ${formatDate(os.data_abertura)}</p>
          ${os.data_previsao_entrega ? `<p>Previsão de entrega: ${formatDate(os.data_previsao_entrega)}</p>` : ''}
          ${os.data_finalizacao ? `<p>Finalização: ${formatDate(os.data_finalizacao)}</p>` : ''}
        </div>

        <div class="section">
          <h3>Persianas</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="center">Qtd.</th>
                <th class="right">Valor Unit.</th>
                <th class="right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${linhasItens}
            </tbody>
          </table>

          <div class="totais">
            <p><span>Total</span><span>${formatCurrency(os.valor_total)}</span></p>
            <p><span>Manutenção</span><span>${formatCurrency(os.valor_manutencao)}</span></p>
            <p><span>Desconto</span><span>-${formatCurrency(os.valor_desconto)}</span></p>
            <p class="final"><span>Valor Final</span><span>${formatCurrency(os.valor_final)}</span></p>
            ${os.forma_pagamento ? `<p><span>Pagamento</span><span>${escapeHtml(os.forma_pagamento)}</span></p>` : ''}
          </div>
        </div>

        <div class="assinaturas">
          <div class="assinatura">
            <div class="linha">&nbsp;</div>
            <p>${escapeHtml(os.cliente?.nome) || 'Cliente'}</p>
          </div>
          <div class="assinatura">
            <div class="linha">&nbsp;</div>
            <p>${escapeHtml(empresa.nome_fantasia) || 'LavTech'}</p>
          </div>
        </div>

        ${
          empresa.rodape_pdf || empresa.horario_funcionamento
            ? `<div class="footer">
                ${empresa.rodape_pdf ? `<p>${escapeHtml(empresa.rodape_pdf)}</p>` : ''}
                ${empresa.horario_funcionamento ? `<p>${escapeHtml(empresa.horario_funcionamento)}</p>` : ''}
              </div>`
            : ''
        }
      </body>
    </html>
  `;
}
