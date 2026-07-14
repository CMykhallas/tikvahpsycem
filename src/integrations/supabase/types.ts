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
      alert_dedupe: {
        Row: {
          count: number
          key: string
          metadata: Json | null
          notified_at: string
        }
        Insert: {
          count?: number
          key: string
          metadata?: Json | null
          notified_at?: string
        }
        Update: {
          count?: number
          key?: string
          metadata?: Json | null
          notified_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          area: string
          created_at: string
          document_name: string | null
          document_url: string | null
          education_level: string
          email: string
          full_name: string
          id: string
          motivation: string | null
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          area: string
          created_at?: string
          document_name?: string | null
          document_url?: string | null
          education_level: string
          email: string
          full_name: string
          id?: string
          motivation?: string | null
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          area?: string
          created_at?: string
          document_name?: string | null
          document_url?: string | null
          education_level?: string
          email?: string
          full_name?: string
          id?: string
          motivation?: string | null
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          client_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          phone: string
          preferred_date: string
          service_type: string
          status: string
        }
        Insert: {
          client_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          phone: string
          preferred_date: string
          service_type: string
          status?: string
        }
        Update: {
          client_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          phone?: string
          preferred_date?: string
          service_type?: string
          status?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_images: {
        Row: {
          alt_text: string
          created_at: string
          id: string
          image_url: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          id?: string
          image_url: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          id?: string
          image_url?: string
        }
        Relationships: []
      }
      cart: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      ip_blacklist: {
        Row: {
          blocked_at: string
          expires_at: string | null
          id: string
          ip_address: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          blocked_at?: string
          expires_at?: string | null
          id?: string
          ip_address: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          blocked_at?: string
          expires_at?: string | null
          id?: string
          ip_address?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          ad_group_id: string | null
          campaign_id: string | null
          created_at: string
          email: string
          id: string
          keyword: string | null
          metadata: Json | null
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          ad_group_id?: string | null
          campaign_id?: string | null
          created_at?: string
          email: string
          id?: string
          keyword?: string | null
          metadata?: Json | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          ad_group_id?: string | null
          campaign_id?: string | null
          created_at?: string
          email?: string
          id?: string
          keyword?: string | null
          metadata?: Json | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          bank_transfer_reference: string | null
          created_at: string
          id: string
          metadata: Json | null
          mpesa_reference: string | null
          order_access_token: string | null
          payment_method: string | null
          phone_number: string | null
          products: Json | null
          status: string
          stripe_session_id: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          bank_transfer_reference?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          mpesa_reference?: string | null
          order_access_token?: string | null
          payment_method?: string | null
          phone_number?: string | null
          products?: Json | null
          status?: string
          stripe_session_id?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          bank_transfer_reference?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          mpesa_reference?: string | null
          order_access_token?: string | null
          payment_method?: string | null
          phone_number?: string | null
          products?: Json | null
          status?: string
          stripe_session_id?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          category: string
          created_at: string
          currency: string
          description: string
          discount_percentage: number | null
          duration_minutes: number | null
          featured: boolean | null
          id: string
          image_url: string | null
          location: string
          long_description: string | null
          metadata: Json | null
          name: string
          price: number
          price_after_discount: number | null
          slug: string
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string
          currency?: string
          description: string
          discount_percentage?: number | null
          duration_minutes?: number | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          location?: string
          long_description?: string | null
          metadata?: Json | null
          name: string
          price: number
          price_after_discount?: number | null
          slug: string
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string
          currency?: string
          description?: string
          discount_percentage?: number | null
          duration_minutes?: number | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          location?: string
          long_description?: string | null
          metadata?: Json | null
          name?: string
          price?: number
          price_after_discount?: number | null
          slug?: string
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposal_audit_trail: {
        Row: {
          actor: string
          created_at: string
          event: string
          id: string
          metadata: Json | null
          notes: string | null
          proposal_id: string
        }
        Insert: {
          actor?: string
          created_at?: string
          event: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          proposal_id: string
        }
        Update: {
          actor?: string
          created_at?: string
          event?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          proposal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_audit_trail_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "service_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          blocked_until: string | null
          count: number
          created_at: string
          first_request_at: string | null
          key: string
          reset_time: string
        }
        Insert: {
          blocked_until?: string | null
          count?: number
          created_at?: string
          first_request_at?: string | null
          key: string
          reset_time: string
        }
        Update: {
          blocked_until?: string | null
          count?: number
          created_at?: string
          first_request_at?: string | null
          key?: string
          reset_time?: string
        }
        Relationships: []
      }
      security_incidents: {
        Row: {
          created_at: string
          details: Json | null
          endpoint: string | null
          id: string
          incident_type: string
          ip_address: string
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          endpoint?: string | null
          id?: string
          incident_type: string
          ip_address: string
          severity: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          endpoint?: string | null
          id?: string
          incident_type?: string
          ip_address?: string
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_proposals: {
        Row: {
          area_code: string | null
          area_name: string | null
          audience: string
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          metadata: Json | null
          modality: string
          phone: string
          service_slug: string
          service_title: string
          status: string
          updated_at: string
        }
        Insert: {
          area_code?: string | null
          area_name?: string | null
          audience: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          metadata?: Json | null
          modality: string
          phone: string
          service_slug: string
          service_title: string
          status?: string
          updated_at?: string
        }
        Update: {
          area_code?: string | null
          area_name?: string | null
          audience?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          modality?: string
          phone?: string
          service_slug?: string
          service_title?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean | null
          area_code: string | null
          area_name: string | null
          benefits: string[] | null
          created_at: string
          currency: string | null
          description: string
          duration_label: string | null
          hero_image_url: string | null
          icon: string | null
          id: string
          long_description: string | null
          modalities: string[] | null
          price_from: number | null
          short_description: string | null
          slug: string | null
          sort_order: number | null
          target_audience: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          area_code?: string | null
          area_name?: string | null
          benefits?: string[] | null
          created_at?: string
          currency?: string | null
          description: string
          duration_label?: string | null
          hero_image_url?: string | null
          icon?: string | null
          id?: string
          long_description?: string | null
          modalities?: string[] | null
          price_from?: number | null
          short_description?: string | null
          slug?: string | null
          sort_order?: number | null
          target_audience?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          area_code?: string | null
          area_name?: string | null
          benefits?: string[] | null
          created_at?: string
          currency?: string | null
          description?: string
          duration_label?: string | null
          hero_image_url?: string | null
          icon?: string | null
          id?: string
          long_description?: string | null
          modalities?: string[] | null
          price_from?: number | null
          short_description?: string | null
          slug?: string | null
          sort_order?: number | null
          target_audience?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          source: string
          status: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload: Json
          source: string
          status?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          source?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_old_rate_limits: { Args: never; Returns: undefined }
      cleanup_expired_blacklist: { Args: never; Returns: undefined }
      cleanup_expired_rate_limits: { Args: never; Returns: undefined }
      daily_security_cleanup: { Args: never; Returns: undefined }
      get_order_by_token: {
        Args: { p_order_id: string; p_token: string }
        Returns: {
          amount: number
          created_at: string
          id: string
          metadata: Json
          payment_method: string
          products: Json
          status: string
        }[]
      }
      get_security_stats: {
        Args: { time_window?: string }
        Returns: {
          blocked_ips: number
          critical_incidents: number
          price_tampering_attempts: number
          rate_limit_violations: number
          total_incidents: number
          unique_ips: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
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
    Enums: {
      app_role: ["admin", "staff", "user"],
    },
  },
} as const
