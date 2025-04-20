'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void; // Simplified for now, could take user data
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true); // Ensure loading is true at the start of the check
      try {
        // Call the dedicated auth status endpoint
        const response = await fetch('/api/auth/status');
        const data = await response.json();

        if (response.ok && data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // We might not want to redirect automatically here, 
          // let individual pages handle redirects if needed.
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
    // Add router to dependencies? No, we only want this check on initial mount.
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    // Router push happens in the login component itself after API call
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.push('/login'); // Redirect to login after logout
      router.refresh(); // Refresh server components potentially
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show toast)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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