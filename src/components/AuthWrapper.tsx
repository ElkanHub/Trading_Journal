'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, realtimeDb } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [onboardingStatus, setOnboardingStatus] = useState<'checking' | 'complete' | 'incomplete'>('checking');

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    const checkOnboarding = async () => {
      const onboardingRef = ref(realtimeDb, `users/${user.uid}/onboarding`);
      const snapshot = await get(onboardingRef);
      if (snapshot.exists()) {
        setOnboardingStatus('complete');
      } else {
        setOnboardingStatus('incomplete');
      }
    };

    checkOnboarding();

  }, [user, loading, router]);

  useEffect(() => {
    if (onboardingStatus === 'incomplete') {
      router.replace('/onboarding');
    }
  }, [onboardingStatus, router]);

  if (loading || onboardingStatus === 'checking') {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="space-y-4 p-8 max-w-lg w-full">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <div className="flex space-x-4 pt-4">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-10 w-1/2" />
                </div>
                <div className="flex space-x-4 pt-4">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-10 w-1/2" />
                </div>
            </div>
      </div>
    );
  }

  if (onboardingStatus === 'incomplete') {
    return null; // Redirecting
  }

  if (user && onboardingStatus === 'complete') {
    return <>{children}</>;
  }

  return null;
}
