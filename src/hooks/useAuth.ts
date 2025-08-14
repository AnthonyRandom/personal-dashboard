import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, type AuthUser } from '@/services/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
}

interface AuthActions {
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

export function useAuth(): AuthState & AuthActions {
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Query for auth session
  const { data: session } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const user = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    user_metadata: session.user.user_metadata,
  } : null;

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Update the query cache
        queryClient.setQueryData(['auth-session'], session);
        
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          // Invalidate all queries that depend on user data
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          queryClient.invalidateQueries({ queryKey: ['user-data'] });
        }
        
        setLoading(false);
      }
    );

    // Initial loading state
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      queryClient.setQueryData(['auth-session'], session);
      setLoading(false);
    };

    checkInitialSession();

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
}
