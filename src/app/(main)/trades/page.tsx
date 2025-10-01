'use client';

import { useState } from 'react';
import { useTrades } from '@/hooks/useTrades';
import { TradesView } from '@/components/TradesView';
import { Modal } from '@/components/Modal';
import { AddTradeForm } from '@/components/AddTradeForm';
import { Trade } from '@/types/trade';

export default function TradesPage() {
  const { trades, loading, addTrade, deleteTrade } = useTrades();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    addTrade(newTrade);
    setIsModalOpen(false);
  };

  return (
    <>
      <TradesView 
        trades={trades}
        onAddTrade={() => setIsModalOpen(true)}
        onDeleteTrade={deleteTrade}
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
