import { useDatabase } from '@/contexts/DatabaseContext';
import { firestoreAdminService, realtimeDbAdminService } from '@/lib/db/adminService';

export const useAdminService = () => {
  const { dbType } = useDatabase();

  if (dbType === 'firestore') {
    return firestoreAdminService;
  }

  return realtimeDbAdminService;
};
