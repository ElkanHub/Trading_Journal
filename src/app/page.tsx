'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';

import { AuthWrapper } from '@/components/AuthWrapper';

const Index: React.FC = () => {
  return (
    <AuthWrapper>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </AuthWrapper>
  );
};

export default Index;
