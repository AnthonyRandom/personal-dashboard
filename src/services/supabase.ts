import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth helper types
export type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
  };
};

// Database types
export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description?: string;
          completed: boolean;
          priority: 'low' | 'medium' | 'high';
          category: string;
          due_date?: string;
          start_date?: string;
          time_estimate?: number;
          tags?: string[];
          project_id?: string;
          parent_task_id?: string;
          recurring_pattern?: string;
          recurring_interval?: number;
          recurring_end_date?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          category?: string;
          due_date?: string;
          start_date?: string;
          time_estimate?: number;
          tags?: string[];
          project_id?: string;
          parent_task_id?: string;
          recurring_pattern?: string;
          recurring_interval?: number;
          recurring_end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          category?: string;
          due_date?: string;
          start_date?: string;
          time_estimate?: number;
          tags?: string[];
          project_id?: string;
          parent_task_id?: string;
          recurring_pattern?: string;
          recurring_interval?: number;
          recurring_end_date?: string;
          updated_at?: string;
        };
      };
      calendar_events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description?: string;
          date: string;
          end_date?: string;
          time?: string;
          end_time?: string;
          location?: string;
          color: string;
          category: string;
          recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
          recurrence_interval: number;
          recurrence_end_date?: string;
          recurrence_count?: number;
          all_day: boolean;
          reminder_minutes?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          date: string;
          end_date?: string;
          time?: string;
          end_time?: string;
          location?: string;
          color?: string;
          category?: string;
          recurrence_type?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
          recurrence_interval?: number;
          recurrence_end_date?: string;
          recurrence_count?: number;
          all_day?: boolean;
          reminder_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          date?: string;
          end_date?: string;
          time?: string;
          end_time?: string;
          location?: string;
          color?: string;
          category?: string;
          recurrence_type?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
          recurrence_interval?: number;
          recurrence_end_date?: string;
          recurrence_count?: number;
          all_day?: boolean;
          reminder_minutes?: number;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          weather_location?: {
            lat: number;
            lng: number;
            city?: string;
            state?: string;
            country?: string;
          };
          news_categories?: string[];
          theme?: 'light' | 'dark' | 'system';
          notifications_enabled?: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weather_location?: {
            lat: number;
            lng: number;
            city?: string;
            state?: string;
            country?: string;
          };
          news_categories?: string[];
          theme?: 'light' | 'dark' | 'system';
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          weather_location?: {
            lat: number;
            lng: number;
            city?: string;
            state?: string;
            country?: string;
          };
          news_categories?: string[];
          theme?: 'light' | 'dark' | 'system';
          notifications_enabled?: boolean;
          updated_at?: string;
        };
      };
    };
  };
};
