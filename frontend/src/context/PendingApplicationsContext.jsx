import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApplicationService } from '../services/ApplicationService';

const PendingApplicationsContext = createContext({
  pendingCount: 0,
  setPendingCount: () => {},
  refresh: async () => {}
});

export const PendingApplicationsProvider = ({ children }) => {
  const [pendingCount, setPendingCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const count = await ApplicationService.getPendingCount();
      setPendingCount(count);
    } catch (e) {
      console.warn('Failed to refresh pending applications count:', e);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ pendingCount, setPendingCount, refresh }), [pendingCount, refresh]);

  return (
    <PendingApplicationsContext.Provider value={value}>
      {children}
    </PendingApplicationsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePendingApplications = () => useContext(PendingApplicationsContext);

export default PendingApplicationsContext;
