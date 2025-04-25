export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      advertisements: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string
          link_url: string | null
          position: string
          start_date: string
          end_date: string
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url: string
          link_url?: string | null
          position: string
          start_date: string
          end_date: string
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string
          link_url?: string | null
          position?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          organizer: string
          description: string
          start_date: string
          end_date: string
          location: string
          category_id: string | null
          is_featured: boolean
          registration_link: string | null
          image_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          organizer: string
          description: string
          start_date: string
          end_date: string
          location: string
          category_id?: string | null
          is_featured?: boolean
          registration_link?: string | null
          image_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          organizer?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string
          category_id?: string | null
          is_featured?: boolean
          registration_link?: string | null
          image_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          category_id: string | null
          is_featured: boolean
          image_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          views: number
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt: string
          category_id?: string | null
          is_featured?: boolean
          image_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          views?: number
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          category_id?: string | null
          is_featured?: boolean
          image_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          views?: number
        }
      }
      newsletter_subscriptions: {
        Row: {
          id: string
          email: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          university: string | null
          course_of_study: string | null
          bio: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          university?: string | null
          course_of_study?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          university?: string | null
          course_of_study?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_items: {
        Row: {
          id: string
          user_id: string
          item_id: string
          item_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          item_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          item_type?: string
          created_at?: string
        }
      }
      scholarships: {
        Row: {
          id: string
          title: string
          organization: string
          description: string
          amount: string
          deadline: string
          category_id: string | null
          location: string
          eligibility: string
          application_link: string | null
          is_featured: boolean
          is_hot: boolean
          image_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          organization: string
          description: string
          amount: string
          deadline: string
          category_id?: string | null
          location: string
          eligibility: string
          application_link?: string | null
          is_featured?: boolean
          is_hot?: boolean
          image_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          organization?: string
          description?: string
          amount?: string
          deadline?: string
          category_id?: string | null
          location?: string
          eligibility?: string
          application_link?: string | null
          is_featured?: boolean
          is_hot?: boolean
          image_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
