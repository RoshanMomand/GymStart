import React, {createContext, useContext, useEffect, useState} from 'react';
import authService from '@/services/authService';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignOut: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignOut, setIsSignOut] = useState(true);

  // Check if a user is already authenticated on an app startup
  const checkAuthStatus = async () => {
    try {
      const storedUser = await authService.getUser();
      const token = await authService.getToken();

      if (!token && !storedUser) {
        setIsSignOut(true);
        return
      }

      setUser(storedUser);
      setIsSignOut(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsSignOut(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({email, password});
      setUser(response.user);
      setIsSignOut(false);
    } catch (error) {
      setIsSignOut(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up (register) with name, email, password
   */
  const signUp = async (
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      const response = await authService.register({
        name,
        email,
        password,
      });
      setUser(response.user);
      setIsSignOut(false);
    } catch (error) {
      setIsSignOut(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out
   */

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsSignOut(true);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check auth status on a mount
   */

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => (prev ? {...prev, ...updates} : null));
  };

  const value = {
    user,
    isLoading,
    isSignOut,
    signIn,
    signUp,
    signOut,
    checkAuthStatus,
    updateUser,
  };

  // Return the asynchronous values from all the functions and pass them through the
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
