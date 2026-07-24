// Tipos do schema Supabase (supabase/migrations/0001_init.sql).
// Regenerar com `npx supabase gen types typescript` assim que o projeto Supabase existir.

export type StatusOrdemServico =
  | 'Retirada Agendada'
  | 'Reinstalação Agendada'
  | 'Finalizado'
  | 'Cancelado';

export type EtapaFoto = 'retirada' | 'recolocacao';
export type MomentoFoto = 'antes' | 'depois';
export type StatusComunicacao = 'sucesso' | 'falha';

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          nome: string;
          created_at: string;
        };
        Insert: {
          id: string;
          nome: string;
        };
        Update: Partial<{ nome: string }>;
      };
      clientes: {
        Row: {
          id: string;
          nome: string;
          whatsapp: string;
          email: string | null;
          cpf_cnpj: string | null;
          cep: string | null;
          logradouro: string | null;
          numero: string | null;
          complemento: string | null;
          bairro: string | null;
          cidade: string | null;
          estado: string | null;
          observacoes: string | null;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['clientes']['Row']> & {
          nome: string;
          whatsapp: string;
        };
        Update: Partial<Database['public']['Tables']['clientes']['Row']>;
      };
      ambientes: {
        Row: { id: string; nome: string; ativo: boolean };
        Insert: { id?: string; nome: string; ativo?: boolean };
        Update: Partial<{ nome: string; ativo: boolean }>;
      };
      tipos_persiana: {
        Row: { id: string; nome: string; ativo: boolean };
        Insert: { id?: string; nome: string; ativo?: boolean };
        Update: Partial<{ nome: string; ativo: boolean }>;
      };
      persianas: {
        Row: {
          id: string;
          cliente_id: string;
          ambiente_id: string;
          tipo_id: string;
          quantidade: number;
          observacoes: string | null;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['persianas']['Row']> & {
          cliente_id: string;
          ambiente_id: string;
          tipo_id: string;
          quantidade: number;
        };
        Update: Partial<Database['public']['Tables']['persianas']['Row']>;
      };
      tabela_precos: {
        Row: {
          id: string;
          tipo_id: string;
          valor_unitario: number;
          valor_manutencao: number;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['tabela_precos']['Row']> & {
          tipo_id: string;
          valor_unitario: number;
        };
        Update: Partial<Database['public']['Tables']['tabela_precos']['Row']>;
      };
      ordens_servico: {
        Row: {
          id: string;
          numero: string;
          cliente_id: string;
          responsavel_id: string | null;
          valor_total: number;
          valor_manutencao: number;
          valor_desconto: number;
          forma_pagamento: string | null;
          valor_final: number;
          status: StatusOrdemServico;
          data_abertura: string;
          data_previsao_entrega: string | null;
          data_finalizacao: string | null;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['ordens_servico']['Row']> & {
          cliente_id: string;
        };
        Update: Partial<Database['public']['Tables']['ordens_servico']['Row']>;
      };
      ordens_servico_itens: {
        Row: {
          id: string;
          ordem_servico_id: string;
          persiana_id: string;
          quantidade: number;
          valor_unitario_aplicado: number;
          valor_manutencao_aplicado: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['ordens_servico_itens']['Row']> & {
          ordem_servico_id: string;
          persiana_id: string;
          quantidade: number;
          valor_unitario_aplicado: number;
        };
        Update: Partial<Database['public']['Tables']['ordens_servico_itens']['Row']>;
      };
      fotos_ordem_servico: {
        Row: {
          id: string;
          ordem_servico_id: string;
          etapa: EtapaFoto;
          momento: MomentoFoto;
          url: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['fotos_ordem_servico']['Row']> & {
          ordem_servico_id: string;
          etapa: EtapaFoto;
          momento: MomentoFoto;
          url: string;
        };
        Update: Partial<Database['public']['Tables']['fotos_ordem_servico']['Row']>;
      };
      comunicacoes: {
        Row: {
          id: string;
          cliente_id: string;
          ordem_servico_id: string | null;
          canal: string;
          status: StatusComunicacao;
          mensagem_erro: string | null;
          enviado_em: string;
        };
        Insert: Partial<Database['public']['Tables']['comunicacoes']['Row']> & {
          cliente_id: string;
          status: StatusComunicacao;
        };
        Update: Partial<Database['public']['Tables']['comunicacoes']['Row']>;
      };
      configuracoes_empresa: {
        Row: {
          id: number;
          logo_url: string | null;
          nome_fantasia: string | null;
          razao_social: string | null;
          cnpj: string | null;
          telefone: string | null;
          whatsapp: string | null;
          email: string | null;
          endereco: string | null;
          horario_funcionamento: string | null;
          rodape_pdf: string | null;
          cor_principal: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['configuracoes_empresa']['Row']>;
        Update: Partial<Database['public']['Tables']['configuracoes_empresa']['Row']>;
      };
    };
  };
}
