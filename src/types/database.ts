type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      conversation_user: {
        Row: {
          conversation_id: string
          created_at: string
          is_owner: boolean
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          is_owner?: boolean
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          is_owner?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_user_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_user_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          created_at: string
          group_img_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          group_img_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          group_img_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string | null
          conversation_id: string
          created_at: string
          file_url: string | null
          id: string
          read_status: string
          sender_id: string
        }
        Insert: {
          body?: string | null
          conversation_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          read_status?: string
          sender_id: string
        }
        Update: {
          body?: string | null
          conversation_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          read_status?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_contact: {
        Row: {
          contact_id: string
          user_id: string
        }
        Insert: {
          contact_id: string
          user_id: string
        }
        Update: {
          contact_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_contact_contact_id_fkey"
            columns: ["contact_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_contact_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          bio: string | null
          created_at: string
          full_name: string
          id: string
          last_seen: string
          profile_img_url: string | null
          user_name: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          full_name: string
          id: string
          last_seen?: string
          profile_img_url?: string | null
          user_name: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          last_seen?: string
          profile_img_url?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      check_owner: {
        Row: {
          "?column?": number | null
        }
        Relationships: []
      }
      user_convos: {
        Row: {
          conversation_id: string | null
        }
        Insert: {
          conversation_id?: string | null
        }
        Update: {
          conversation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_user_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      create_convo_return: {
        name: string
        id: string
        group_img_url: string
      }
    }
  }
}
