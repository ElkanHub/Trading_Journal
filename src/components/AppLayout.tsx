import React, { useState } from 'react';
import { Trade } from '@/types/trade';
import { useTrades } from '@/hooks/useTrades';
import { calculateStats } from '@/utils/tradeCalculations';
import { HeroSection } from './HeroSection';
import { Navigation } from './Navigation';
import { DashboardView } from './DashboardView';
import { TradesView } from './TradesView';
import { AnalyticsView } from './AnalyticsView';
import { FeatureSection } from './FeatureSection';
import { Footer } from './Footer';
import { Modal } from './Modal';
import { AddTradeForm } from './AddTradeForm';
import { InfoBanner } from './InfoBanner';

const AppLayout: React.FC = () => {
  const { trades, loading, addTrade, deleteTrade } = useTrades();
  const [currentView, setCurrentView] = useState<'hero' | 'dashboard' | 'trades' | 'analytics'>('hero');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = calculateStats(trades);

  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    addTrade(newTrade);
    setIsModalOpen(false);
  };

  const handleGetStarted = () => {
    setCurrentView('dashboard');
  };

  const handleViewChange = (view: 'dashboard' | 'trades' | 'analytics') => {
    setCurrentView(view);
  };

  if (currentView === 'hero') {
    return (
      <div className="min-h-screen bg-slate-900">
        <HeroSection onGetStarted={handleGetStarted} />
        <FeatureSection />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InfoBanner />
        
        {currentView === 'dashboard' && (
          <DashboardView 
            trades={trades} 
            stats={stats}
            onAddTrade={() => setIsModalOpen(true)}
            loading={loading}
          />
        )}
        
        {currentView === 'trades' && (
          <TradesView 
            trades={trades}
            onAddTrade={() => setIsModalOpen(true)}
            onDeleteTrade={deleteTrade}
            loading={loading}
          />
        )}
        
        {currentView === 'analytics' && (
          <AnalyticsView trades={trades} stats={stats} loading={loading} />
        )}
      </main>

      <Footer />

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Trade"
      >
        <AddTradeForm 
          onSubmit={handleAddTrade}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AppLayout;
