export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon_url: string | null
          id: string
          name: string
          rarity: string | null
        }
        Insert: {
          created_at?: string
          description: string
          icon_url?: string | null
          id?: string
          name: string
          rarity?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          icon_url?: string | null
          id?: string
          name?: string
          rarity?: string | null
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["admin_user_role"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["admin_user_role"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["admin_user_role"]
        }
        Relationships: []
      }
      app_media: {
        Row: {
          categoria: string | null
          created_at: string | null
          created_by: string | null
          descricao: string | null
          id: string
          nome: string
          tipo: string
          url: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          id?: string
          nome: string
          tipo: string
          url: string
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string
          url?: string
        }
        Relationships: []
      }
      bus_schedules: {
        Row: {
          created_at: string | null
          destination: string
          id: number
          ida: string | null
          line_code: string
          line_name: string
          point_a: string
          point_b: string
          status: string | null
          times_saturday: string | null
          times_sunday: string | null
          times_weekdays: string | null
          updated_at: string | null
          volta: string | null
        }
        Insert: {
          created_at?: string | null
          destination: string
          id?: never
          ida?: string | null
          line_code: string
          line_name: string
          point_a: string
          point_b: string
          status?: string | null
          times_saturday?: string | null
          times_sunday?: string | null
          times_weekdays?: string | null
          updated_at?: string | null
          volta?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string
          id?: never
          ida?: string | null
          line_code?: string
          line_name?: string
          point_a?: string
          point_b?: string
          status?: string | null
          times_saturday?: string | null
          times_sunday?: string | null
          times_weekdays?: string | null
          updated_at?: string | null
          volta?: string | null
        }
        Relationships: []
      }
      comercios: {
        Row: {
          ativo: boolean | null
          capa_url: string | null
          categoria: string | null
          created_at: string | null
          curtidas: number | null
          descricao: string | null
          endereco: string | null
          galeria_urls: string[] | null
          horario_func: Json | null
          id: string
          image_url: string | null
          instagram: string | null
          latitude: number | null
          layout_template: string | null
          logo_url: string | null
          longitude: number | null
          nome: string
          primary_color: string | null
          servicos: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string
          visualizacoes: number | null
          whatsapp: string | null
        }
        Insert: {
          ativo?: boolean | null
          capa_url?: string | null
          categoria?: string | null
          created_at?: string | null
          curtidas?: number | null
          descricao?: string | null
          endereco?: string | null
          galeria_urls?: string[] | null
          horario_func?: Json | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          latitude?: number | null
          layout_template?: string | null
          logo_url?: string | null
          longitude?: number | null
          nome: string
          primary_color?: string | null
          servicos?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          visualizacoes?: number | null
          whatsapp?: string | null
        }
        Update: {
          ativo?: boolean | null
          capa_url?: string | null
          categoria?: string | null
          created_at?: string | null
          curtidas?: number | null
          descricao?: string | null
          endereco?: string | null
          galeria_urls?: string[] | null
          horario_func?: Json | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          latitude?: number | null
          layout_template?: string | null
          logo_url?: string | null
          longitude?: number | null
          nome?: string
          primary_color?: string | null
          servicos?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          visualizacoes?: number | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: number
          created_at: string
          user_id: string
        }
        Insert: {
          comment_id: number
          created_at?: string
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      court_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          court_id: string | null
          created_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_time: string
          court_id?: string | null
          created_at?: string | null
          id?: never
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string
          court_id?: string | null
          created_at?: string | null
          id?: never
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "court_bookings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          capacity: number | null
          features: string[] | null
          id: string
          image_url: string | null
          loteamento_id: string
          name: string
          type: string
        }
        Insert: {
          capacity?: number | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          loteamento_id: string
          name: string
          type: string
        }
        Update: {
          capacity?: number | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          loteamento_id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      health_alerts: {
        Row: {
          created_at: string
          id: string
          message: string | null
          severity: string | null
          source: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          severity?: string | null
          source?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          severity?: string | null
          source?: string | null
          title?: string | null
        }
        Relationships: []
      }
      health_info: {
        Row: {
          address: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: number
          image_key: string | null
          image_query: string | null
          ingredients: Json | null
          instructions: Json | null
          phone: string | null
          read_time: string | null
          source: string | null
          steps: Json | null
          tips: string[] | null
          title: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: number
          image_key?: string | null
          image_query?: string | null
          ingredients?: Json | null
          instructions?: Json | null
          phone?: string | null
          read_time?: string | null
          source?: string | null
          steps?: Json | null
          tips?: string[] | null
          title?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: number
          image_key?: string | null
          image_query?: string | null
          ingredients?: Json | null
          instructions?: Json | null
          phone?: string | null
          read_time?: string | null
          source?: string | null
          steps?: Json | null
          tips?: string[] | null
          title?: string | null
        }
        Relationships: []
      }
      loteamento_destaques: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          loteamento_id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          loteamento_id: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          loteamento_id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      loteamento_media: {
        Row: {
          caption: string | null
          id: string
          image_url: string
          loteamento_id: string
          order: number
        }
        Insert: {
          caption?: string | null
          id?: string
          image_url: string
          loteamento_id: string
          order?: number
        }
        Update: {
          caption?: string | null
          id?: string
          image_url?: string
          loteamento_id?: string
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_loteamento"
            columns: ["loteamento_id"]
            isOneToOne: false
            referencedRelation: "loteamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      loteamentos: {
        Row: {
          available_lots: number
          city: string | null
          description: string | null
          features: string[] | null
          has_transport: boolean | null
          id: string
          image_url: string | null
          is_selling: boolean
          logo: string | null
          logo_url: string | null
          main_video_url: string | null
          name: string
          stages: Json | null
          total_lots: number
        }
        Insert: {
          available_lots?: number
          city?: string | null
          description?: string | null
          features?: string[] | null
          has_transport?: boolean | null
          id: string
          image_url?: string | null
          is_selling?: boolean
          logo?: string | null
          logo_url?: string | null
          main_video_url?: string | null
          name: string
          stages?: Json | null
          total_lots?: number
        }
        Update: {
          available_lots?: number
          city?: string | null
          description?: string | null
          features?: string[] | null
          has_transport?: boolean | null
          id?: string
          image_url?: string | null
          is_selling?: boolean
          logo?: string | null
          logo_url?: string | null
          main_video_url?: string | null
          name?: string
          stages?: Json | null
          total_lots?: number
        }
        Relationships: []
      }
      map_locations: {
        Row: {
          address: string | null
          category: string | null
          distance: string | null
          has_promo: boolean | null
          hours: string | null
          id: string
          image_url: string | null
          name: string
          phone: string | null
          rating: number | null
          x_coord: number | null
          y_coord: number | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          distance?: string | null
          has_promo?: boolean | null
          hours?: string | null
          id: string
          image_url?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          x_coord?: number | null
          y_coord?: number | null
        }
        Update: {
          address?: string | null
          category?: string | null
          distance?: string | null
          has_promo?: boolean | null
          hours?: string | null
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          x_coord?: number | null
          y_coord?: number | null
        }
        Relationships: []
      }
      mission_steps: {
        Row: {
          completion_data: string
          completion_type: string
          description: string | null
          id: string
          mission_id: string
          step_number: number
          step_xp_reward: number | null
          title: string
        }
        Insert: {
          completion_data: string
          completion_type: string
          description?: string | null
          id?: string
          mission_id: string
          step_number: number
          step_xp_reward?: number | null
          title: string
        }
        Update: {
          completion_data?: string
          completion_type?: string
          description?: string | null
          id?: string
          mission_id?: string
          step_number?: number
          step_xp_reward?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_steps_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          achievement_id: string | null
          approved_at: string | null
          approved_by: string | null
          coin_reward: number
          comercio_id: string | null
          completion_data: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_unique: boolean
          location_type: string | null
          loteamento_id: string | null
          reward_id: string | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
          xp_reward: number
        }
        Insert: {
          achievement_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          coin_reward?: number
          comercio_id?: string | null
          completion_data: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_unique?: boolean
          location_type?: string | null
          loteamento_id?: string | null
          reward_id?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
          xp_reward?: number
        }
        Update: {
          achievement_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          coin_reward?: number
          comercio_id?: string | null
          completion_data?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_unique?: boolean
          location_type?: string | null
          loteamento_id?: string | null
          reward_id?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_achievement"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_reward"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_comercio_id_fkey"
            columns: ["comercio_id"]
            isOneToOne: false
            referencedRelation: "comercios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_loteamento_id_fkey"
            columns: ["loteamento_id"]
            isOneToOne: false
            referencedRelation: "loteamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      news_feed: {
        Row: {
          author_avatar_url: string | null
          author_name: string | null
          comments: number | null
          description: string | null
          id: number
          image_url: string | null
          likes: number | null
          location: string | null
          media_type: string | null
          published_at: string
          title: string
          video_url: string | null
          views: number | null
        }
        Insert: {
          author_avatar_url?: string | null
          author_name?: string | null
          comments?: number | null
          description?: string | null
          id?: never
          image_url?: string | null
          likes?: number | null
          location?: string | null
          media_type?: string | null
          published_at?: string
          title: string
          video_url?: string | null
          views?: number | null
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string | null
          comments?: number | null
          description?: string | null
          id?: never
          image_url?: string | null
          likes?: number | null
          location?: string | null
          media_type?: string | null
          published_at?: string
          title?: string
          video_url?: string | null
          views?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          metadata?: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      nutrition_queries: {
        Row: {
          created_at: string
          id: number
          query: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          query?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          query?: string | null
        }
        Relationships: []
      }
      points_of_interest: {
        Row: {
          category: string
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          loteamento_id: string
          name: string
          operating_hours: string | null
          phone: string | null
          x_coord: number | null
          y_coord: number | null
        }
        Insert: {
          category: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          loteamento_id: string
          name: string
          operating_hours?: string | null
          phone?: string | null
          x_coord?: number | null
          y_coord?: number | null
        }
        Update: {
          category?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          loteamento_id?: string
          name?: string
          operating_hours?: string | null
          phone?: string | null
          x_coord?: number | null
          y_coord?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_loteamento"
            columns: ["loteamento_id"]
            isOneToOne: false
            referencedRelation: "loteamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: number
          likes: number
          parent_comment_id: number | null
          post_id: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          likes?: number
          parent_comment_id?: number | null
          post_id: number
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          likes?: number
          parent_comment_id?: number | null
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "news_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "news_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      post_views: {
        Row: {
          created_at: string
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "news_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          id: number
          image_url: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: never
          image_url?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: never
          image_url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          coins: number | null
          created_at: string | null
          full_name: string | null
          has_completed_onboarding: boolean
          id: string
          is_approved: boolean | null
          level: number | null
          phone: string | null
          push_token: string | null
          realtor_level: string | null
          updated_at: string | null
          user_status: string | null
          user_type: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          coins?: number | null
          created_at?: string | null
          full_name?: string | null
          has_completed_onboarding?: boolean
          id: string
          is_approved?: boolean | null
          level?: number | null
          phone?: string | null
          push_token?: string | null
          realtor_level?: string | null
          updated_at?: string | null
          user_status?: string | null
          user_type?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          coins?: number | null
          created_at?: string | null
          full_name?: string | null
          has_completed_onboarding?: boolean
          id?: string
          is_approved?: boolean | null
          level?: number | null
          phone?: string | null
          push_token?: string | null
          realtor_level?: string | null
          updated_at?: string | null
          user_status?: string | null
          user_type?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      publications: {
        Row: {
          content: string
          created_at: string
          id: string
          media_type: string | null
          media_url: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          title?: string
        }
        Relationships: []
      }
      realtor_invites: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          invite_code: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          invite_code: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          invite_code?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      recompensas: {
        Row: {
          ativo: boolean | null
          comercio_id: string | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          pontos_necessarios: number
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          comercio_id?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          pontos_necessarios?: number
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          comercio_id?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          pontos_necessarios?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recompensas_comercio_id_fkey"
            columns: ["comercio_id"]
            isOneToOne: false
            referencedRelation: "comercios"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_code_usage: {
        Row: {
          code: string
          created_at: string
          id: string
          reward_id: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          reward_id: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          reward_id?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reward_code_usage_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          coin_cost: number
          comercio_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          mission_id_unlock: string | null
          mission_unlock_id: string | null
          reward_codes: string[] | null
          stock: number | null
          title: string
        }
        Insert: {
          coin_cost: number
          comercio_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          mission_id_unlock?: string | null
          mission_unlock_id?: string | null
          reward_codes?: string[] | null
          stock?: number | null
          title: string
        }
        Update: {
          coin_cost?: number
          comercio_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          mission_id_unlock?: string | null
          mission_unlock_id?: string | null
          reward_codes?: string[] | null
          stock?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_comercio_id_fkey"
            columns: ["comercio_id"]
            isOneToOne: false
            referencedRelation: "comercios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_mission_id_unlock_fkey"
            columns: ["mission_id_unlock"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_mission_unlock_id_fkey"
            columns: ["mission_unlock_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string | null
          id: number
          message: string
          status: string
          subject: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          message: string
          status?: string
          subject: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          message?: string
          status?: string
          subject?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_claimed_rewards: {
        Row: {
          claimed_at: string
          id: string
          reward_id: string
          user_id: string
        }
        Insert: {
          claimed_at?: string
          id?: string
          reward_id: string
          user_id: string
        }
        Update: {
          claimed_at?: string
          id?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_claimed_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_completed_mission_steps: {
        Row: {
          completed_at: string
          step_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          step_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          step_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_completed_mission_steps_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "mission_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_completed_missions: {
        Row: {
          completed_at: string
          id: string
          mission_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          mission_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          mission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_completed_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          health_info_id: number
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          health_info_id: number
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          health_info_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_health_info_id_fkey"
            columns: ["health_info_id"]
            isOneToOne: false
            referencedRelation: "health_info"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_reads: {
        Row: {
          created_at: string | null
          id: string
          notification_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_properties: {
        Row: {
          acquired_at: string
          id: string
          lote: string
          loteamento_id: string
          quadra: string
          user_id: string
        }
        Insert: {
          acquired_at?: string
          id?: string
          lote: string
          loteamento_id: string
          quadra: string
          user_id: string
        }
        Update: {
          acquired_at?: string
          id?: string
          lote?: string
          loteamento_id?: string
          quadra?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          created_at: string
          id: string
          reward_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reward_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          avatar_url: string | null
          coins: number | null
          full_name: string | null
          id: string | null
          level: number | null
          position: number | null
          xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_and_apply_level_up: {
        Args: { p_user_id: string }
        Returns: Json
      }
      cleanup_old_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      complete_mission: {
        Args: { p_mission_id: string }
        Returns: Json
      }
      complete_mission_for_user: {
        Args:
          | { p_mission_id: string; p_xp_reward: number; p_coin_reward: number }
          | {
              p_user_id: string
              p_mission_id: string
              p_xp_reward: number
              p_coin_reward: number
            }
        Returns: undefined
      }
      create_notification_for_user: {
        Args: {
          target_user_id: string
          notification_title: string
          notification_message: string
        }
        Returns: undefined
      }
      generate_reward_codes: {
        Args: { reward_id_param: string; stock_amount: number }
        Returns: string[]
      }
      get_admin_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_news_feed_with_likes: {
        Args: { p_user_id: string }
        Returns: {
          id: number
          title: string
          description: string
          image_url: string
          video_url: string
          media_type: string
          published_at: string
          likes: number
          comments: number
          views: number
          author_name: string
          author_avatar_url: string
          is_liked_by_user: boolean
        }[]
      }
      get_notifications_with_read_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          message: string
          type: Database["public"]["Enums"]["notification_type"]
          metadata: Json
          user_id: string
          created_at: string
          is_read_by_user: boolean
          read_at_by_user: string
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never> | { user_id?: string }
        Returns: string
      }
      increment_comment_like: {
        Args: { comment_id_to_update: number }
        Returns: undefined
      }
      increment_like: {
        Args: { post_id_to_update: number }
        Returns: undefined
      }
      increment_post_comments_count: {
        Args: { p_post_id: number }
        Returns: undefined
      }
      increment_post_view: {
        Args: { p_post_id: number }
        Returns: undefined
      }
      increment_view: {
        Args: { post_id_to_update: number }
        Returns: undefined
      }
      mark_notification_as_read_for_user: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      perform_health_info_cleanup: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      purchase_reward: {
        Args: { p_reward_id: string }
        Returns: Json
      }
      toggle_like_comment: {
        Args: { comment_id_to_update: number }
        Returns: undefined
      }
      toggle_like_post: {
        Args: { post_id_to_update: number }
        Returns: undefined
      }
      update_leaderboard: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      admin_user_role: "admin" | "comerciante"
      notification_type:
        | "lote_disponivel"
        | "novidade_feed"
        | "nova_missao"
        | "workshop"
        | "novo_comercio"
        | "app_update"
        | "novidade_comercio"
      user_role: "cliente" | "corretor_parceiro" | "corretor_fbz" | "admin"
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
      admin_user_role: ["admin", "comerciante"],
      notification_type: [
        "lote_disponivel",
        "novidade_feed",
        "nova_missao",
        "workshop",
        "novo_comercio",
        "app_update",
        "novidade_comercio",
      ],
      user_role: ["cliente", "corretor_parceiro", "corretor_fbz", "admin"],
    },
  },
} as const
