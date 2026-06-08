import { useState } from 'react';

export type UserRole = 'DSP' | 'Analyst' | 'DataOfficer' | 'Auditor';

export interface UserContext {
  role: UserRole;
  name: string;
}

// For simulation purposes, we'll expose a global mock user that can be toggled.
// In a real app, this would be backed by a JWT and a React Context provider.
let mockCurrentUser: UserContext = { role: 'DSP', name: 'Inspector R. Deshmukh' };

export function useAuth() {
  const [user, setUser] = useState<UserContext>(mockCurrentUser);

  const hasPermission = (action: 'trigger_retrain' | 'edit_cases' | 'ingest_data'): boolean => {
    switch (action) {
      case 'trigger_retrain':
        return user.role === 'DSP';
      case 'edit_cases':
        return user.role === 'DSP';
      case 'ingest_data':
        return user.role === 'DSP' || user.role === 'DataOfficer';
      default:
        return false;
    }
  };

  const checkPermissionOrThrow = (action: 'trigger_retrain' | 'edit_cases' | 'ingest_data') => {
    if (!hasPermission(action)) {
      throw new Error("Access restricted — insufficient role privileges.");
    }
  };

  const setUserRole = (newRole: UserRole) => {
    const newUser = { ...user, role: newRole };
    mockCurrentUser = newUser;
    setUser(newUser);
  };

  return { user, setUserRole, hasPermission, checkPermissionOrThrow };
}
