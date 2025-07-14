import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService, User } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  resendCode: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  idToken?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const idToken = authService.isAuthenticated();
      if (idToken) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setIdToken(idToken);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await authService.signOut();
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.signIn(email, password);
      setUser(result.user);
      setIdToken(result.idToken)
    } catch (error: any) {
      setError(error?.message || 'Sign in failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.signUp(email, password, username);
    } catch (error: any) {
      setError(error.message || 'Sign up failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmSignUp = async (username: string, code: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.confirmSignUp(username, code);
    } catch (error: any) {
      setError(error.message || 'Confirmation failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async (username: string) => {
    try {
      setError(null);
      await authService.resendConfirmationCode(username);
    } catch (error: any) {
      setError(error.message || 'Failed to resend code');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      setIdToken(null);
    } catch (error: any) {
      setError(error.message || 'Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    confirmSignUp,
    resendCode,
    signOut,
    error,
    clearError,
    idToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
