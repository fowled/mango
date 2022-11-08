export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      guilds: {
        Row: {
          id: number
          created_at: string | null
          birthdays: string | null
          welcome: string | null
          logs: string | null
          guild_id: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          birthdays?: string | null
          welcome?: string | null
          logs?: string | null
          guild_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          birthdays?: string | null
          welcome?: string | null
          logs?: string | null
          guild_id?: string | null
        }
      }
      market: {
        Row: {
          id: number
          created_at: string | null
          name: string | null
          price: number | null
          sellerID: string | null
          sold: boolean | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          name?: string | null
          price?: number | null
          sellerID?: string | null
          sold?: boolean | null
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string | null
          price?: number | null
          sellerID?: string | null
          sold?: boolean | null
        }
      }
      users: {
        Row: {
          id: number
          created_at: string | null
          user_id: string | null
          money: number | null
          birthday: string | null
          guilds: string[] | null
          inventory: number[] | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          user_id?: string | null
          money?: number | null
          birthday?: string | null
          guilds?: string[] | null
          inventory?: number[] | null
        }
        Update: {
          id?: number
          created_at?: string | null
          user_id?: string | null
          money?: number | null
          birthday?: string | null
          guilds?: string[] | null
          inventory?: number[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_today_birthdays: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Tables"]["users"]["Row"]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
