"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/auth-provider';

function ProfileContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/login');
    }
    setIsLoading(false);
  }, [user, router, isLoading]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center">
      {user ? (
        <div className="max-w-2xl w-full p-6 bg-card rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Name</h2>
              <p>{user.name || 'Not set'}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Phone Number</h2>
              <p>{user.phoneNumber}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Verification Status</h2>
              <p className="capitalize">{user.verificationStatus}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Account Type</h2>
              <p>{user.isPremium ? 'Premium' : 'Standard'}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Profile() {
  return <ProfileContent />;
}
