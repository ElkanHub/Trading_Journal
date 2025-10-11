'use client';

import { Providers } from "@/app/providers";
import BetaFeedbackButton from "@/components/beta/BetaFeedbackButton";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {children}
      <BetaFeedbackButton />
      <Toaster />
    </Providers>
  );
}
