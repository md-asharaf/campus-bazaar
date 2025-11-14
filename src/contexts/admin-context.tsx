import { createContext } from 'react';

import type { Admin } from '@/types';

export interface AdminAuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (admin: Admin) => void;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);