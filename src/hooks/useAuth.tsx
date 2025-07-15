import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService, User } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean; // For initial auth check
  actionLoading: boolean; // For sign-in/sign-up actions
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
  const [loading, setLoading] = useState(true); // Initial auth check loading
  const [actionLoading, setActionLoading] = useState(false); // For UI actions
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
      setActionLoading(true);
      const result = await authService.signIn(email, password);
      setUser(result.user);
      setIdToken(result.idToken)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown sign-in error occurred');
      }
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      setError(null);
      setActionLoading(true);
      
      // Uncomment this line when you want to use real API again:
      await authService.signUp(email, password, username);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown sign-up error occurred');
      }
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const confirmSignUp = async (username: string, code: string) => {
    try {
      setError(null);
      setActionLoading(true);
      
      // Accept any 6-digit code for testing
      if (code.length !== 6) {
        throw new Error('Please enter a 6-digit confirmation code');
      }
      
      // Uncomment this line when you want to use real API again:
      await authService.confirmSignUp(username, code);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown confirmation error occurred');
      }
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const resendCode = async (username: string) => {
    try {
      setError(null);
      await authService.resendConfirmationCode(username);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred while resending the code');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setActionLoading(true);
      await authService.signOut();
      setUser(null);
      setIdToken(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown sign-out error occurred');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    actionLoading,
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
