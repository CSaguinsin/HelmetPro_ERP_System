"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import Cookies from 'js-cookie';

// Define types
type User = {
  id: string;
  email: string;
  user_client_id: string;
  erp_user_id: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set a secure cookie/localStorage for authentication
const setAuthData = (key: string, value: string) => {
  // Set in localStorage
  localStorage.setItem(key, value);
  
  // Also set in cookie for middleware access
  Cookies.set(key, value, { 
    expires: 7, // 7 days
    path: '/',
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict'
  });
};

// Clear auth data from cookie/localStorage
const clearAuthData = (key: string) => {
  localStorage.removeItem(key);
  Cookies.remove(key, { path: '/' });
};

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      
      try {
        // First check if we have a custom auth session
        const authToken = localStorage.getItem('auth_token') || Cookies.get('auth_token');
        const userEmail = localStorage.getItem('user_email');
        const userClientId = localStorage.getItem('user_client_id');
        const erpUserId = localStorage.getItem('erp_user_id');
        
        if (authToken && userEmail && userClientId && erpUserId) {
          // We have an auth token and user info
          // Verify if it's a fallback token (base64 encoded JSON) or a Supabase token
          let isValidToken = false;
          
          if (authToken.includes('.')) {
            // Looks like a JWT (Supabase token), try to validate with Supabase
            try {
              const { data } = await supabase.auth.getUser(authToken);
              isValidToken = !!data.user;
            } catch (e) {
              console.warn("Failed to validate Supabase token:", e);
              isValidToken = false;
            }
          } else {
            // Try to parse as fallback token
            try {
              const tokenData = JSON.parse(atob(authToken));
              // Check if token data matches stored user info
              isValidToken = tokenData.user_client_id === userClientId && 
                             tokenData.email === userEmail &&
                             tokenData.user_id === erpUserId &&
                             // Check if token is less than 7 days old
                             (Date.now() - tokenData.timestamp < 7 * 24 * 60 * 60 * 1000);
            } catch (e) {
              console.warn("Failed to validate fallback token:", e);
              isValidToken = false;
            }
          }
          
          if (isValidToken) {
            setUser({
              id: erpUserId,
              email: userEmail,
              user_client_id: userClientId,
              erp_user_id: erpUserId
            });
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear auth data
            clearAuthData('auth_token');
            clearAuthData('user_client_id');
            clearAuthData('erp_user_id');
            clearAuthData('user_email');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // Try to get session from Supabase Auth as fallback
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Get user details from custom users table
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single();
              
            if (userData) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                user_client_id: userData.user_client_id,
                erp_user_id: userData.erp_user_id
              });
              setIsAuthenticated(true);
              
              // Store in localStorage and cookies
              setAuthData('auth_token', session.access_token);
              setAuthData('user_client_id', userData.user_client_id);
              setAuthData('erp_user_id', userData.erp_user_id);
              setAuthData('user_email', session.user.email || '');
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        clearAuthData('auth_token');
        clearAuthData('user_client_id');
        clearAuthData('erp_user_id');
        clearAuthData('user_email');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // Check if the user exists in the users table and verify password
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (userError || !userData) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Create a custom user object
      const customUser = {
        id: userData.erp_user_id,
        email: userData.email,
        user_client_id: userData.user_client_id,
        erp_user_id: userData.erp_user_id
      };
      
      // Generate a real API token using Supabase authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: password + '_' + userData.user_client_id, // Using a composite password to prevent direct supabase login
      });
      
      if (authError) {
        // If Supabase auth fails, create a fallback token
        console.warn("Supabase auth failed, creating fallback token:", authError);
        
        // Generate a secure token manually as fallback
        const fallbackToken = btoa(JSON.stringify({
          user_id: userData.erp_user_id,
          email: userData.email,
          user_client_id: userData.user_client_id,
          timestamp: Date.now(),
          // Add a simple signature
          sig: btoa(`${userData.erp_user_id}:${Date.now()}:${userData.password.substring(0, 5)}`)
        }));
        
        // Set in both localStorage and cookies
        setAuthData('auth_token', fallbackToken);
        setAuthData('user_client_id', userData.user_client_id);
        setAuthData('erp_user_id', userData.erp_user_id);
        setAuthData('user_email', email);
      } else {
        // Use the Supabase token if auth was successful
        setAuthData('auth_token', authData.session?.access_token || '');
        setAuthData('user_client_id', userData.user_client_id);
        setAuthData('erp_user_id', userData.erp_user_id);
        setAuthData('user_email', email);
      }
      
      // Update state
      setUser(customUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      // Generate a user_client_id and erp_user_id
      const user_client_id = crypto.randomUUID();
      const erp_user_id = crypto.randomUUID();

      // Check if the email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      // Insert into users table
      const { error: userError } = await supabase
        .from("users")
        .insert([
          {
            user_client_id,
            erp_user_id,
            email,
            password,
          },
        ]);

      if (userError) {
        return { success: false, error: userError.message };
      }

      // Insert into user_clients table
      const { error: userClientError } = await supabase
        .from("user_clients")
        .insert([
          {
            user_client_id,
            erp_user_id,
            email,
            password,
          },
        ]);

      if (userClientError) {
        return { success: false, error: userClientError.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Clear data from both localStorage and cookies
      clearAuthData('auth_token');
      clearAuthData('user_client_id');
      clearAuthData('erp_user_id');
      clearAuthData('user_email');
      
      // Sign out from Supabase Auth (in case there is a session)
      await supabase.auth.signOut();
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 