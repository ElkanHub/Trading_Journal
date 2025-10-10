import { useDatabase } from '@/contexts/DatabaseContext';
import { firestoreService, realtimeDbService } from '@/lib/journalService';

export const useJournalService = () => {
  const { dbType } = useDatabase();

  if (dbType === 'firestore') {
    return firestoreService;
  }

  return realtimeDbService;
};
