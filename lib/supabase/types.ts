// Database types generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          twitter_handle: string | null
          github_handle: string | null
          linkedin_url: string | null
          email_notifications: boolean
          push_notifications: boolean
          created_at: string
          updated_at: string
          last_seen_at: string | null
          total_posts: number
          total_comments: number
          total_likes_received: number
          reputation_score: number
        }
        Insert: {
          id?: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          email_notifications?: boolean
          push_notifications?: boolean
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          model: string
          system_prompt: string | null
          temperature: number
          max_tokens: number
          is_archived: boolean
          is_favorite: boolean
          is_shared: boolean
          total_messages: number
          total_tokens_used: number
          estimated_cost: number
          created_at: string
          updated_at: string
          last_message_at: string
        }
        Insert: {
          user_id: string
          title?: string
          model: string
          system_prompt?: string | null
          temperature?: number
          max_tokens?: number
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          model: string | null
          tokens_used: number
          cost: number
          is_edited: boolean
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          model?: string | null
          tokens_used?: number
          cost?: number
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          title: string
          content: string
          content_html: string | null
          images: Json
          attachments: Json
          is_published: boolean
          is_pinned: boolean
          is_locked: boolean
          is_deleted: boolean
          view_count: number
          comment_count: number
          like_count: number
          share_count: number
          slug: string | null
          created_at: string
          updated_at: string
          published_at: string
          last_activity_at: string
        }
        Insert: {
          user_id: string
          category_id?: string | null
          title: string
          content: string
          slug?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          parent_id: string | null
          content: string
          content_html: string | null
          is_edited: boolean
          is_deleted: boolean
          is_flagged: boolean
          like_count: number
          reply_count: number
          created_at: string
          updated_at: string
          edited_at: string | null
        }
        Insert: {
          post_id: string
          user_id: string
          parent_id?: string | null
          content: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string
          order_index: number
          total_posts: number
          created_at: string
          updated_at: string
        }
      }
      video_rooms: {
        Row: {
          id: string
          created_by: string
          name: string
          description: string | null
          room_code: string
          max_participants: number
          is_locked: boolean
          is_active: boolean
          is_recording: boolean
          participant_count: number
          created_at: string
          started_at: string | null
          ended_at: string | null
        }
        Insert: {
          created_by: string
          name: string
          description?: string | null
          max_participants?: number
        }
      }
    }
  }
}

