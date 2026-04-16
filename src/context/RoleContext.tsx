'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'Global Overview' | 'Site A' | 'Site B';

interface RoleContextValue {
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
  isSiteAdmin: boolean;
  siteName: string;
}

const RoleContext = createContext<RoleContextValue>({
  selectedRole: 'Global Overview',
  setSelectedRole: () => {},
  isSiteAdmin: false,
  siteName: '',
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [selectedRole, setSelectedRole] = useState<Role>('Global Overview');

  const isSiteAdmin = selectedRole === 'Site A' || selectedRole === 'Site B';
  const siteName = selectedRole === 'Site A' ? 'Site A' : selectedRole === 'Site B' ? 'Site B – Bangalore Office' : '';

  return (
    <RoleContext.Provider value={{ selectedRole, setSelectedRole, isSiteAdmin, siteName }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
