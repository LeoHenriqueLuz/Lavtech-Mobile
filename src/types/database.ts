export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ambientes: {
        Row: {
          ativo: boolean
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          id?: string
          nome?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          ativo: boolean
          bairro: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          estado: string | null
          id: string
          logradouro: string | null
          nome: string
          numero: string | null
          observacoes: string | null
          updated_at: string
          whatsapp: string
        }
        Insert: {
          ativo?: boolean
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          estado?: string | null
          id?: string
          logradouro?: string | null
          nome: string
          numero?: string | null
          observacoes?: string | null
          updated_at?: string
          whatsapp: string
        }
        Update: {
          ativo?: boolean
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          estado?: string | null
          id?: string
          logradouro?: string | null
          nome?: string
          numero?: string | null
          observacoes?: string | null
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      comunicacoes: {
        Row: {
          canal: string
          cliente_id: string
          enviado_em: string
          id: string
          mensagem_erro: string | null
          ordem_servico_id: string | null
          status: string
        }
        Insert: {
          canal?: string
          cliente_id: string
          enviado_em?: string
          id?: string
          mensagem_erro?: string | null
          ordem_servico_id?: string | null
          status: string
        }
        Update: {
          canal?: string
          cliente_id?: string
          enviado_em?: string
          id?: string
          mensagem_erro?: string | null
          ordem_servico_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunicacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicacoes_ordem_servico_id_fkey"
            columns: ["ordem_servico_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_empresa: {
        Row: {
          cnpj: string | null
          cor_principal: string
          email: string | null
          endereco: string | null
          horario_funcionamento: string | null
          id: number
          logo_url: string | null
          nome_fantasia: string | null
          razao_social: string | null
          rodape_pdf: string | null
          telefone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          cnpj?: string | null
          cor_principal?: string
          email?: string | null
          endereco?: string | null
          horario_funcionamento?: string | null
          id?: number
          logo_url?: string | null
          nome_fantasia?: string | null
          razao_social?: string | null
          rodape_pdf?: string | null
          telefone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          cnpj?: string | null
          cor_principal?: string
          email?: string | null
          endereco?: string | null
          horario_funcionamento?: string | null
          id?: number
          logo_url?: string | null
          nome_fantasia?: string | null
          razao_social?: string | null
          rodape_pdf?: string | null
          telefone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      fotos_ordem_servico: {
        Row: {
          created_at: string
          etapa: string
          id: string
          momento: string
          ordem_servico_id: string
          url: string
        }
        Insert: {
          created_at?: string
          etapa: string
          id?: string
          momento: string
          ordem_servico_id: string
          url: string
        }
        Update: {
          created_at?: string
          etapa?: string
          id?: string
          momento?: string
          ordem_servico_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fotos_ordem_servico_ordem_servico_id_fkey"
            columns: ["ordem_servico_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      numeracao_os: {
        Row: {
          ano: number
          ultimo_numero: number
        }
        Insert: {
          ano: number
          ultimo_numero?: number
        }
        Update: {
          ano?: number
          ultimo_numero?: number
        }
        Relationships: []
      }
      numeracao_propostas: {
        Row: {
          ano: number
          ultimo_numero: number
        }
        Insert: {
          ano: number
          ultimo_numero?: number
        }
        Update: {
          ano?: number
          ultimo_numero?: number
        }
        Relationships: []
      }
      ordens_servico: {
        Row: {
          cliente_id: string
          created_at: string
          data_abertura: string
          data_finalizacao: string | null
          data_previsao_entrega: string | null
          forma_pagamento: string | null
          id: string
          numero: string
          observacoes: string | null
          responsavel_id: string | null
          status: string
          updated_at: string
          valor_desconto: number
          valor_final: number
          valor_manutencao: number
          valor_total: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_abertura?: string
          data_finalizacao?: string | null
          data_previsao_entrega?: string | null
          forma_pagamento?: string | null
          id?: string
          numero: string
          observacoes?: string | null
          responsavel_id?: string | null
          status?: string
          updated_at?: string
          valor_desconto?: number
          valor_final?: number
          valor_manutencao?: number
          valor_total?: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_abertura?: string
          data_finalizacao?: string | null
          data_previsao_entrega?: string | null
          forma_pagamento?: string | null
          id?: string
          numero?: string
          observacoes?: string | null
          responsavel_id?: string | null
          status?: string
          updated_at?: string
          valor_desconto?: number
          valor_final?: number
          valor_manutencao?: number
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_servico_itens: {
        Row: {
          ajuste_manual: boolean
          created_at: string
          id: string
          motivo_ajuste: string | null
          ordem_servico_id: string
          persiana_id: string
          quantidade: number
          valor_manutencao_aplicado: number
          valor_unitario_aplicado: number
          valor_unitario_tabela: number
        }
        Insert: {
          ajuste_manual?: boolean
          created_at?: string
          id?: string
          motivo_ajuste?: string | null
          ordem_servico_id: string
          persiana_id: string
          quantidade: number
          valor_manutencao_aplicado?: number
          valor_unitario_aplicado: number
          valor_unitario_tabela: number
        }
        Update: {
          ajuste_manual?: boolean
          created_at?: string
          id?: string
          motivo_ajuste?: string | null
          ordem_servico_id?: string
          persiana_id?: string
          quantidade?: number
          valor_manutencao_aplicado?: number
          valor_unitario_aplicado?: number
          valor_unitario_tabela?: number
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_itens_ordem_servico_id_fkey"
            columns: ["ordem_servico_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_itens_persiana_id_fkey"
            columns: ["persiana_id"]
            isOneToOne: false
            referencedRelation: "persianas"
            referencedColumns: ["id"]
          },
        ]
      }
      persianas: {
        Row: {
          ambiente_id: string
          ambiente_outro_descricao: string | null
          ativo: boolean
          cliente_id: string
          created_at: string
          id: string
          observacoes: string | null
          quantidade: number
          tipo_id: string
          updated_at: string
        }
        Insert: {
          ambiente_id: string
          ambiente_outro_descricao?: string | null
          ativo?: boolean
          cliente_id: string
          created_at?: string
          id?: string
          observacoes?: string | null
          quantidade: number
          tipo_id: string
          updated_at?: string
        }
        Update: {
          ambiente_id?: string
          ambiente_outro_descricao?: string | null
          ativo?: boolean
          cliente_id?: string
          created_at?: string
          id?: string
          observacoes?: string | null
          quantidade?: number
          tipo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "persianas_ambiente_id_fkey"
            columns: ["ambiente_id"]
            isOneToOne: false
            referencedRelation: "ambientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persianas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persianas_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "tipos_persiana"
            referencedColumns: ["id"]
          },
        ]
      }
      propostas_comerciais: {
        Row: {
          cliente_nome: string | null
          cliente_whatsapp: string | null
          created_at: string
          data_validade: string
          id: string
          numero: string
          observacoes: string | null
          responsavel_id: string | null
          status: string
          updated_at: string
          validade_dias: number
          valor_desconto: number
          valor_final: number
          valor_subtotal: number
        }
        Insert: {
          cliente_nome?: string | null
          cliente_whatsapp?: string | null
          created_at?: string
          data_validade: string
          id?: string
          numero: string
          observacoes?: string | null
          responsavel_id?: string | null
          status?: string
          updated_at?: string
          validade_dias?: number
          valor_desconto?: number
          valor_final?: number
          valor_subtotal?: number
        }
        Update: {
          cliente_nome?: string | null
          cliente_whatsapp?: string | null
          created_at?: string
          data_validade?: string
          id?: string
          numero?: string
          observacoes?: string | null
          responsavel_id?: string | null
          status?: string
          updated_at?: string
          validade_dias?: number
          valor_desconto?: number
          valor_final?: number
          valor_subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "propostas_comerciais_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      propostas_comerciais_itens: {
        Row: {
          ajuste_manual: boolean
          created_at: string
          id: string
          motivo_ajuste: string | null
          proposta_id: string
          quantidade: number
          tipo_persiana_id: string
          valor_unitario_aplicado: number
          valor_unitario_tabela: number
        }
        Insert: {
          ajuste_manual?: boolean
          created_at?: string
          id?: string
          motivo_ajuste?: string | null
          proposta_id: string
          quantidade: number
          tipo_persiana_id: string
          valor_unitario_aplicado: number
          valor_unitario_tabela: number
        }
        Update: {
          ajuste_manual?: boolean
          created_at?: string
          id?: string
          motivo_ajuste?: string | null
          proposta_id?: string
          quantidade?: number
          tipo_persiana_id?: string
          valor_unitario_aplicado?: number
          valor_unitario_tabela?: number
        }
        Relationships: [
          {
            foreignKeyName: "propostas_comerciais_itens_proposta_id_fkey"
            columns: ["proposta_id"]
            isOneToOne: false
            referencedRelation: "propostas_comerciais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_comerciais_itens_tipo_persiana_id_fkey"
            columns: ["tipo_persiana_id"]
            isOneToOne: false
            referencedRelation: "tipos_persiana"
            referencedColumns: ["id"]
          },
        ]
      }
      tabela_precos: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          tipo_id: string
          updated_at: string
          valor_manutencao: number
          valor_unitario: number
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          tipo_id: string
          updated_at?: string
          valor_manutencao?: number
          valor_unitario: number
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          tipo_id?: string
          updated_at?: string
          valor_manutencao?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "tabela_precos_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "tipos_persiana"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_persiana: {
        Row: {
          ativo: boolean
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          id?: string
          nome?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
