import React, { createContext, useContext, useState, ReactNode } from 'react';

type DbType = 'realtime' | 'firestore';

interface DatabaseContextType {
  dbType: DbType;
  setDbType: (type: DbType) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [dbType, setDbType] = useState<DbType>('realtime');

  return (
    <DatabaseContext.Provider value={{ dbType, setDbType }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
