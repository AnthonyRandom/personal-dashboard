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
    };
  };
};
