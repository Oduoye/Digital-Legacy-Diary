import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on your schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          profile_picture: string | null
          bio: string | null
          social_links: Record<string, any> | null
          subscription_tier: string | null
          subscription_start_date: string | null
          subscription_end_date: string | null
          life_story_last_generated: string | null
          life_story_narrative: string | null
          life_story_themes: Record<string, any> | null
          life_story_timeline: Record<string, any> | null
          life_story_relationships: Record<string, any> | null
          life_story_values: Record<string, any> | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          profile_picture?: string | null
          bio?: string | null
          social_links?: Record<string, any> | null
          subscription_tier?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          life_story_last_generated?: string | null
          life_story_narrative?: string | null
          life_story_themes?: Record<string, any> | null
          life_story_timeline?: Record<string, any> | null
          life_story_relationships?: Record<string, any> | null
          life_story_values?: Record<string, any> | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          profile_picture?: string | null
          bio?: string | null
          social_links?: Record<string, any> | null
          subscription_tier?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          life_story_last_generated?: string | null
          life_story_narrative?: string | null
          life_story_themes?: Record<string, any> | null
          life_story_timeline?: Record<string, any> | null
          life_story_relationships?: Record<string, any> | null
          life_story_values?: Record<string, any> | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      trusted_contacts: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          relationship: string | null
          picture: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          relationship?: string | null
          picture?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          relationship?: string | null
          picture?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      diary_entries: {
        Row: {
          id: string
          user_id: string | null
          title: string
          content: string
          tags: string[] | null
          images: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          content: string
          tags?: string[] | null
          images?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          content?: string
          tags?: string[] | null
          images?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      wills: {
        Row: {
          id: string
          user_id: string | null
          title: string
          content: string
          attachments: Record<string, any> | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          content: string
          attachments?: Record<string, any> | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          content?: string
          attachments?: Record<string, any> | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      dead_mans_switches: {
        Row: {
          id: string
          user_id: string | null
          status: string | null
          check_in_interval: number
          last_check_in: string | null
          next_check_in_due: string | null
          notifications_sent: number | null
          trusted_contacts_ids: string[] | null
          custom_message: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string | null
          check_in_interval: number
          last_check_in?: string | null
          next_check_in_due?: string | null
          notifications_sent?: number | null
          trusted_contacts_ids?: string[] | null
          custom_message?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string | null
          check_in_interval?: number
          last_check_in?: string | null
          next_check_in_due?: string | null
          notifications_sent?: number | null
          trusted_contacts_ids?: string[] | null
          custom_message?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
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
  }
}