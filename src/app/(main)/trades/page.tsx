'use client';

import { useState } from 'react';
import { useTrades } from '@/hooks/useTrades';
import { TradesView } from '@/components/TradesView';
import { Modal } from '@/components/Modal';
import { AddTradeForm } from '@/components/AddTradeForm';
import { Trade } from '@/types/trade';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function TradesPage() {
  const { trades, loading, addTrade, updateTrade, deleteTrade } = useTrades();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);
  const [tradeToDelete, setTradeToDelete] = useState<string | null>(null);

  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    addTrade(newTrade);
    setIsAddModalOpen(false);
  };

  const handleEditTrade = (updatedTrade: Trade) => {
    if (!tradeToEdit) return;
    updateTrade({ ...tradeToEdit, ...updatedTrade });
    setIsEditModalOpen(false);
    setTradeToEdit(null);
  };

  const openEditModal = (trade: Trade) => {
    setTradeToEdit(trade);
    setIsEditModalOpen(true);
  };

  const confirmDeleteTrade = () => {
    if (tradeToDelete) {
      deleteTrade(tradeToDelete);
      setTradeToDelete(null);
    }
  };

  return (
    <>
      <TradesView 
        trades={trades}
        onAddTrade={() => setIsAddModalOpen(true)}
        onEditTrade={openEditModal}
        onDeleteTrade={(id) => setTradeToDelete(id)}
        loading={loading}
      />
      <Modal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Trade"
      >
        <AddTradeForm 
          onSubmit={handleAddTrade}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
      {tradeToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setTradeToEdit(null);
          }}
          title="Edit Trade"
        >
          <AddTradeForm
            onSubmit={(values) => handleEditTrade({ ...tradeToEdit, ...values } as Trade)}
            onCancel={() => {
              setIsEditModalOpen(false);
              setTradeToEdit(null);
            }}
            initialValues={tradeToEdit}
          />
        </Modal>
      )}
      <AlertDialog open={!!tradeToDelete} onOpenChange={() => setTradeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trade.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTrade}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
