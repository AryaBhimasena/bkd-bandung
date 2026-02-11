// stores/bootstrapStore.js
import { create } from "zustand";

export const useBootstrapStore = create((set, get) => ({
  coaList: [],
  bank: [],
  jenisTransaksi: [],
  mappingJurnal: [],
  loading: false,
  error: null,
  isLoaded: false,

  setBootstrap: (data) => set({
    ...data,
    loaded: true,
    lastFetch: Date.now()
  }),

  reset: () => set({
    coaList: [],
    bank: [],
    jenisTransaksi: [],
    mappingJurnal: [],
    loaded: false
  }),

// ===== ACTIONS =====
  setIsLoaded: (val) => set({ isLoaded: val }),
  setLoading: (val) => set({ loading: val }),
  setError: (err) => set({ error: err }),
  setCoaList: (list) => set({ coaList: list }),
}));