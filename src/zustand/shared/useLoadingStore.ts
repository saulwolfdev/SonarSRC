import { create } from "zustand";

interface LoadingState {
  loading: boolean; 
  setLoading: (isLoading: boolean) => void; 
  loadingAxios: boolean;
  setLoadingAxios: (loading: boolean) => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  loading: false, 
  setLoading: (isLoading) => set({ loading: isLoading }), 
  loadingAxios: false, 
  setLoadingAxios: (isLoading) => set({ loadingAxios: isLoading }), 
}));

export default useLoadingStore;
