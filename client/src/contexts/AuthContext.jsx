import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Supabase auth state
  const [supabaseUser, setSupabaseUser] = useState(null);

  const isAuthenticated = !!user || !!supabaseUser;

  // Restore backend session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(res.data);
        setToken(storedToken);
      } catch {
        // Token expired or invalid — clear it
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Check Supabase session on mount + listen for auth state changes
  useEffect(() => {
    // Check if a Supabase user is already logged in
    const checkSupabaseUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setSupabaseUser(currentUser ?? null);
    };
    checkSupabaseUser();

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSupabaseUser(session?.user ?? null);
      }
    );

    // Clean up the listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    const { token: newToken, ...userData } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    const { token: newToken, ...userData } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    // Clear backend session
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Clear Supabase session
    await supabase.auth.signOut();
    setSupabaseUser(null);
  };

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) console.error('Google login error:', error.message);
  };

  return (
    <AuthContext.Provider value={{ user, supabaseUser, token, isAuthenticated, loading, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

