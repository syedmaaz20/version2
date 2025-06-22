export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          aspirational_title: string | null
          banner_url: string | null
          campaign_status: string
          created_at: string | null
          education_program: string | null
          goal: number
          graduation_date: string | null
          id: string
          institution: string | null
          institution_url: string | null
          photo_url: string | null
          raised: number | null
          share_code: string
          short_description: string | null
          story: string | null
          student_id: string
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          aspirational_title?: string | null
          banner_url?: string | null
          campaign_status?: string
          created_at?: string | null
          education_program?: string | null
          goal: number
          graduation_date?: string | null
          id?: string
          institution?: string | null
          institution_url?: string | null
          photo_url?: string | null
          raised?: number | null
          share_code: string
          short_description?: string | null
          story?: string | null
          student_id: string
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          aspirational_title?: string | null
          banner_url?: string | null
          campaign_status?: string
          created_at?: string | null
          education_program?: string | null
          goal?: number
          graduation_date?: string | null
          id?: string
          institution?: string | null
          institution_url?: string | null
          photo_url?: string | null
          raised?: number | null
          share_code?: string
          short_description?: string | null
          story?: string | null
          student_id?: string
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          document_type: string | null
          file_name: string
          file_url: string
          id: string
          student_id: string
          uploaded_at: string | null
        }
        Insert: {
          document_type?: string | null
          file_name: string
          file_url: string
          id?: string
          student_id: string
          uploaded_at?: string | null
        }
        Update: {
          document_type?: string | null
          file_name?: string
          file_url?: string
          id?: string
          student_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string
          created_at: string | null
          donor_id: string | null
          id: string
          is_anonymous: boolean | null
          message: string | null
        }
        Insert: {
          amount: number
          campaign_id: string
          created_at?: string | null
          donor_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string
          created_at?: string | null
          donor_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_breakdown: {
        Row: {
          amount: number
          campaign_id: string
          color: string | null
          created_at: string | null
          id: string
          label: string
          percent: number | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          campaign_id: string
          color?: string | null
          created_at?: string | null
          id?: string
          label: string
          percent?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string
          color?: string | null
          created_at?: string | null
          id?: string
          label?: string
          percent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_breakdown_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          campaign_id: string
          completed: boolean | null
          created_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          first_name: string
          id: string
          interests: string[] | null
          last_name: string
          location: string | null
          updated_at: string | null
          user_type: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name: string
          id: string
          interests?: string[] | null
          last_name: string
          location?: string | null
          updated_at?: string | null
          user_type: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          interests?: string[] | null
          last_name?: string
          location?: string | null
          updated_at?: string | null
          user_type?: string
          username?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
