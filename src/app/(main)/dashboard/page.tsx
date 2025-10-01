'use client';

import { useState } from 'react';
import { useTrades } from '@/hooks/useTrades';
import { calculateStats } from '@/utils/tradeCalculations';
import { DashboardView } from '@/components/DashboardView';
import { Modal } from '@/components/Modal';
import { AddTradeForm } from '@/components/AddTradeForm';
import { Trade } from '@/types/trade';

export default function DashboardPage() {
  const { trades, loading, addTrade } = useTrades();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = calculateStats(trades);

  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    addTrade(newTrade);
    setIsModalOpen(false);
  };

  return (
    <>
      <DashboardView 
        trades={trades} 
        stats={stats}
        onAddTrade={() => setIsModalOpen(true)}
        loading={loading}
      />
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
    </>
  );
}
