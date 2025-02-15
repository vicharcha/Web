"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id?: string;
  phoneNumber: string;
  otp?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => void;
  requestOtp: (phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      // Add your session checking logic here
      // For example, checking localStorage or making an API call
      setIsLoading(false);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoading(false);
    }
  }

  async function requestOtp(phoneNumber: string) {
    try {
      // Make API call to request OTP
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error("OTP request failed:", error);
      throw error;
    }
  }

  async function login(phoneNumber: string, otp: string) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp })
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      const data = await response.json();
      setUser({ ...data.user, phoneNumber });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  function logout() {
    setUser(null);
    // Add any additional cleanup
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    requestOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
