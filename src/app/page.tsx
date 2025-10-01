'use client';

import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/HeroSection';
import { FeatureSection } from '@/components/FeatureSection';
import { Footer } from '@/components/Footer';

export default function RootPage() {
  const router = useRouter();

  const handleStartJournaling = () => {
    router.push('/dashboard');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <HeroSection onStartJournaling={handleStartJournaling} onLogin={handleLogin} />
      <FeatureSection />
      <Footer />
    </div>
  );
}
