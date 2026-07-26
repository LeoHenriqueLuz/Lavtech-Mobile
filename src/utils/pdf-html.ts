export function escapeHtml(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** CSS base compartilhado pelos PDFs de Ordem de Serviço e Proposta Comercial — mesma identidade visual. */
export function pdfBaseStyles(cor: string): string {
  return `
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
  `;
}
