"use client";

import { motion } from "framer-motion";
import { AuthWrapper } from "@/components/AuthWrapper";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AppProvider } from "@/contexts/AppContext";
import { TradesProvider } from "@/lib/hooks/useTrades";
import { DatabaseProvider } from "@/contexts/DatabaseContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <AppProvider>
        <DatabaseProvider>
          <TradesProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {children}
                </motion.div>
              </main>
              <Footer />
            </div>
          </TradesProvider>
        </DatabaseProvider>{" "}
      </AppProvider>
    </AuthWrapper>
  );
}
