'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { RippleButton } from '@/components/ui/RippleButton';

interface HeroSectionProps {
  onStartJournaling: () => void;
  onLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartJournaling, onLogin }) => {
  const { user } = useAuth();
  const [signOut] = useSignOut(auth);

  return (
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-slate-900"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/68db8ed0c2c2328e1706360d_1759219492061_51f2f0be.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6"
          >
            Master Your Trading <span className="static-gradient">Psychology</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto"
          >
            Track every trade, analyze your performance, and transform your trading from guesswork into a data-driven business.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center space-x-4"
          >
            {user ? (
              <>
                <RippleButton onClick={onStartJournaling}>
                  Go to Dashboard
                </RippleButton>
                <RippleButton onClick={() => signOut()} variant="secondary">
                  Logout
                </RippleButton>
              </>
            ) : (
              <>
                <RippleButton onClick={onStartJournaling}>
                  Start Journaling Now
                </RippleButton>
                <RippleButton onClick={onLogin} variant="secondary">
                  Login
                </RippleButton>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
