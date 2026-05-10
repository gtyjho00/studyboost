import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string | null
          level: number
          xp: number
          coins: number
          streak: number
          premium: boolean
          created_at: string
        }
        Insert: {
          id: string
          name?: string
          email?: string
          avatar?: string | null
          level?: number
          xp?: number
          coins?: number
          streak?: number
          premium?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string | null
          level?: number
          xp?: number
          coins?: number
          streak?: number
          premium?: boolean
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          module: string
          category: string
          level: number
          title: string
          content_json: any
          xp_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          module: string
          category: string
          level?: number
          title: string
          content_json?: any
          xp_reward?: number
          created_at?: string
        }
        Update: {
          id?: string
          module?: string
          category?: string
          level?: number
          title?: string
          content_json?: any
          xp_reward?: number
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          user_id: string
          lesson_id: string
          completed: boolean
          score: number
          completed_at: string | null
        }
        Insert: {
          user_id: string
          lesson_id: string
          completed?: boolean
          score?: number
          completed_at?: string | null
        }
        Update: {
          user_id?: string
          lesson_id?: string
          completed?: boolean
          score?: number
          completed_at?: string | null
        }
      }
      stripe_user_subscriptions: {
        Row: {
          customer_id: string
          subscription_id: string | null
          subscription_status: string
          price_id: string | null
          current_period_start: number | null
          current_period_end: number | null
          cancel_at_period_end: boolean | null
          payment_method_brand: string | null
          payment_method_last4: string | null
        }
      }
    }
    Views: {
      stripe_user_subscriptions: {
        Row: {
          customer_id: string
          subscription_id: string | null
          subscription_status: string
          price_id: string | null
          current_period_start: number | null
          current_period_end: number | null
          cancel_at_period_end: boolean | null
          payment_method_brand: string | null
          payment_method_last4: string | null
        }
      }
    }
  }
}