"use client";

import { useAuth } from '@/components/auth-provider';
import { Sidebar } from './sidebar';
import { LoginForm } from './login-form';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoginForm />
      </div>
    );
  }

  // Show layout with sidebar for authenticated users
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
