import { create } from 'zustand';

interface MobileActionsState {
    activeStationId: string | null;
    setActiveStation: (id: string | null) => void;
    toggleStation: (id: string) => void;
    clearActions: () => void;
}

export const useMobileActions = create<MobileActionsState>((set) => ({
    activeStationId: null,
    setActiveStation: (id) => set({ activeStationId: id }),
    toggleStation: (id) => set((state) => ({
        activeStationId: state.activeStationId === id ? null : id
    })),
    clearActions: () => set({ activeStationId: null }),
}));
