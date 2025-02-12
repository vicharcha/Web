"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const isAuthPage = pathname === '/login';

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify-token' }),
        });

        setIsAuthenticated(response.ok);

        // Redirect to login if not authenticated and not already on login page
        if (!response.ok && !isAuthPage) {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [pathname, isAuthPage]);

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return null;
  }

  // Show children directly for auth pages
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Show layout with sidebar for authenticated pages
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
