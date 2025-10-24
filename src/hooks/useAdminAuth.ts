import { useContext } from 'react';
import { AdminAuthContext, type AdminAuthContextType } from '@/contexts/AdminAuthContext';

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);

  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }

  return context;
}