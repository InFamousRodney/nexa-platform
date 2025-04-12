import { create } from 'zustand';

interface AppState {
  // Current selected Salesforce organization ID
  selectedOrgId: string | null;
  
  // Actions
  setSelectedOrgId: (orgId: string | null) => void;
}

/**
 * Global application store for managing app-wide state
 */
export const useAppStore = create<AppState>((set) => ({
  // Initial state
  selectedOrgId: null,
  
  // Actions
  setSelectedOrgId: (orgId) => set({ selectedOrgId: orgId }),
})); 