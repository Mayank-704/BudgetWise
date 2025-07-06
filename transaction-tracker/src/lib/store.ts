import { create } from "zustand";

interface StoreState {
  selectedWorkspaceId: string | null;
  selectedPageId: string | null;
  setWorkspaceId: (id: string | null) => void;
  setPageId: (id: string | null) => void;
}

export const useAppStore = create<StoreState>((set) => ({
  selectedWorkspaceId: null,
  selectedPageId: null,
  setWorkspaceId: (id) => set({ selectedWorkspaceId: id, selectedPageId: null }),
  setPageId: (id) => set({ selectedPageId: id }),
}));
