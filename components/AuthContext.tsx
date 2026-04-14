
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, UserRole } from '../types';
import { DataService } from '../services/dataService';

// Interfaces
interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateRole: (role: UserRole) => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize — check for existing Supabase session
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadOrCreateUser(session.user);
      }
      setIsLoading(false);
    };
    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
          await loadOrCreateUser(session.user);
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Load user from Supabase DB, or create a new user record if first login
   */
  const loadOrCreateUser = async (authUser: any) => {
    // Try by auth ID first
    const existingUser = await DataService.getUserById(authUser.id);
    if (existingUser) {
      setUser(existingUser);
      return;
    }

    // Try by email
    const allUsers = await DataService.getUsers();
    const byEmail = allUsers.find(u => u.email === authUser.email);
    if (byEmail) {
      setUser(byEmail);
      return;
    }

    // Create new user in DB
    const displayName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User';
    const newUser: User = {
      id: authUser.id,
      email: authUser.email || '',
      name: displayName,
      username: (authUser.email?.split('@')[0] || 'user').replace(/[^a-zA-Z0-9]/g, '') + '_' + Date.now().toString(36).slice(-4),
      role: UserRole.UNSET,
      skillTags: [],
      avatar: authUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FF6B00&color=fff`,
      following: [],
      followers: [],
      createdAt: Date.now(),
    };

    const dbUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      username: newUser.username,
      role: newUser.role,
      skill_tags: newUser.skillTags,
      avatar: newUser.avatar,
      following: newUser.following,
      followers: newUser.followers,
      created_at: newUser.createdAt,
    };
    
    const { error } = await supabase.from('users').insert(dbUser);
    if (error) {
      console.error('Error creating user record:', error);
    }
    setUser(newUser);
  };

  /**
   * Sign up with email + password
   * Supabase sends a verification email automatically
   */
  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, name: name },
          emailRedirectTo: window.location.origin + '/login',
        },
      });

      if (error) {
        console.error('SignUp error:', error);
        return { success: false, message: error.message };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // User created but needs email verification
        return { 
          success: true, 
          message: `Verification email sent to ${email}! Please check your inbox (and spam folder) and click the link to verify your account. Then come back and sign in.` 
        };
      }

      // If session exists, user is auto-confirmed (Supabase setting)
      if (data.session && data.user) {
        await loadOrCreateUser(data.user);
        return { success: true, message: 'Account created successfully!' };
      }

      return { success: true, message: 'Please check your email to verify your account.' };
    } catch (err: any) {
      console.error('SignUp failed:', err);
      return { success: false, message: 'Sign up failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign in with email + password
   */
  const signIn = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('SignIn error:', error);
        if (error.message.includes('Email not confirmed')) {
          return { success: false, message: 'Please verify your email first. Check your inbox for the verification link.' };
        }
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, message: 'Invalid email or password. Please check and try again.' };
        }
        return { success: false, message: error.message };
      }

      if (data.user) {
        await loadOrCreateUser(data.user);
        return { success: true, message: 'Signed in successfully!' };
      }

      return { success: false, message: 'Login failed. Please try again.' };
    } catch (err: any) {
      console.error('SignIn failed:', err);
      return { success: false, message: 'Sign in failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateRole = async (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    await DataService.updateUser(updated);
  };

  const updateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    await DataService.updateUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, logout, updateRole, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
