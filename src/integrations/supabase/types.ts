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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      assessores: {
        Row: {
          Assessoria: string | null
          celular: string
          Contatado: string | null
          created_at: string | null
          email: string | null
          id: number
          nome: string
          reunião_marcada: string | null
          utm_medium: string | null
          utm_source: string | null
          Venda: string | null
        }
        Insert: {
          Assessoria?: string | null
          celular: string
          Contatado?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          nome: string
          reunião_marcada?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          Venda?: string | null
        }
        Update: {
          Assessoria?: string | null
          celular?: string
          Contatado?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          nome?: string
          reunião_marcada?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          Venda?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          ip_address: unknown
          table_name: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          table_name: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          table_name?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      B2C: {
        Row: {
          "Análise de Carteira": string | null
          celular: string | null
          created_at: string
          Fonte: string | null
          id: number
          nome: string | null
          Perfil: string | null
          Reunião: string | null
          Venda: string | null
        }
        Insert: {
          "Análise de Carteira"?: string | null
          celular?: string | null
          created_at?: string
          Fonte?: string | null
          id?: number
          nome?: string | null
          Perfil?: string | null
          Reunião?: string | null
          Venda?: string | null
        }
        Update: {
          "Análise de Carteira"?: string | null
          celular?: string | null
          created_at?: string
          Fonte?: string | null
          id?: number
          nome?: string | null
          Perfil?: string | null
          Reunião?: string | null
          Venda?: string | null
        }
        Relationships: []
      }
      B2C_Leads_LP: {
        Row: {
          created_at: string | null
          email: string
          has_investment: boolean
          id: string
          name: string
          phone: string
          source: string | null
          surname: string
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          has_investment: boolean
          id?: string
          name: string
          phone: string
          source?: string | null
          surname: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          has_investment?: boolean
          id?: string
          name?: string
          phone?: string
          source?: string | null
          surname?: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      Calculadoras: {
        Row: {
          calculadora: string | null
          Contato: string | null
          created_at: string
          email: string | null
          id: number
          "Interesse em dados": string | null
          "Interesse em IA": string | null
          "Média de Mensagens por Conversas": string | null
          Name: string | null
          Nota: string | null
          "Numero de Conversas": string | null
          patrimonio: string | null
          perfil: string | null
          phone: string | null
          "Se sentiu enganado": string | null
          valor_mes: string | null
        }
        Insert: {
          calculadora?: string | null
          Contato?: string | null
          created_at?: string
          email?: string | null
          id?: number
          "Interesse em dados"?: string | null
          "Interesse em IA"?: string | null
          "Média de Mensagens por Conversas"?: string | null
          Name?: string | null
          Nota?: string | null
          "Numero de Conversas"?: string | null
          patrimonio?: string | null
          perfil?: string | null
          phone?: string | null
          "Se sentiu enganado"?: string | null
          valor_mes?: string | null
        }
        Update: {
          calculadora?: string | null
          Contato?: string | null
          created_at?: string
          email?: string | null
          id?: number
          "Interesse em dados"?: string | null
          "Interesse em IA"?: string | null
          "Média de Mensagens por Conversas"?: string | null
          Name?: string | null
          Nota?: string | null
          "Numero de Conversas"?: string | null
          patrimonio?: string | null
          perfil?: string | null
          phone?: string | null
          "Se sentiu enganado"?: string | null
          valor_mes?: string | null
        }
        Relationships: []
      }
      checkout_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          payment_method: string
          phone: string | null
          plan_price: string
          plan_title: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          payment_method: string
          phone?: string | null
          plan_price: string
          plan_title: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          payment_method?: string
          phone?: string | null
          plan_price?: string
          plan_title?: string
        }
        Relationships: []
      }
      LP_Vendas: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      pix_phone_submissions: {
        Row: {
          Email: string | null
          id: number
          "Interesse em dados": string | null
          "Interesse em IA": string | null
          "Investir Mês": string | null
          "Ja foi contatado?": string | null
          Patrimonio: string | null
          phone_number: string | null
          plan_title: string | null
          "Se sentiu enganado": string | null
          submitted_at: string | null
        }
        Insert: {
          Email?: string | null
          id?: number
          "Interesse em dados"?: string | null
          "Interesse em IA"?: string | null
          "Investir Mês"?: string | null
          "Ja foi contatado?"?: string | null
          Patrimonio?: string | null
          phone_number?: string | null
          plan_title?: string | null
          "Se sentiu enganado"?: string | null
          submitted_at?: string | null
        }
        Update: {
          Email?: string | null
          id?: number
          "Interesse em dados"?: string | null
          "Interesse em IA"?: string | null
          "Investir Mês"?: string | null
          "Ja foi contatado?"?: string | null
          Patrimonio?: string | null
          phone_number?: string | null
          plan_title?: string | null
          "Se sentiu enganado"?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
