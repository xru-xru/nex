import { create } from 'zustand';
import { NexoyaUser } from '../types';

type UserStore = {
  user: NexoyaUser | null;
  setUser: (user: NexoyaUser | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isSupportUser: boolean;
  setIsSupportUser: (isSupport: boolean) => void;
};

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isSupportUser: false,
  setIsSupportUser: (isSupport) => set({ isSupportUser: isSupport }),
  setUser: (user) => {
    set({ user });
    set({ isSupportUser: user?.activeRole?.name?.includes('support') || false });
  },
  error: null,
  setError: (error) => set({ error }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export default useUserStore;
