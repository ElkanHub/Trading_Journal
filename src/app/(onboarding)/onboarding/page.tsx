'use client';

import OnboardingQuestions from '@/components/OnboardingQuestions';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { realtimeDb as database} from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }

    if (user) {
      const onboardingRef = ref(database, `users/${user.uid}/onboarding`);
      get(onboardingRef).then((snapshot) => {
        if (snapshot.exists()) {
          setOnboardingComplete(true);
          router.replace('/dashboard');
        } else {
          setOnboardingComplete(false);
        }
      });
    }
  }, [user, loading, router]);

  if (loading || onboardingComplete === null || onboardingComplete === true) {
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

  return <OnboardingQuestions />;
}
