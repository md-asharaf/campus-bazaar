import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    bio?:string;
    registrationNumber?: string;
    branch?: string;
    year?: string;
    verified: boolean;
    profileComplete: boolean;
    verificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
}

interface AuthState {
    user: User | null;
    isLoading: boolean;

    login: (userData: User) => void;
    logout: () => void;
    updateProfile: (profileData: Partial<User>) => void;
    setLoading: (loading: boolean) => void;
    submitVerification: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,

            login: (userData) => {
                set({
                    user: userData,
                    isLoading: false
                });
            },

            logout: () => {
                set({
                    user: null,
                    isLoading: false
                });
            },

            updateProfile: (profileData) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...profileData } });
                }
            },

            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            submitVerification: () => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ 
                        user: { 
                            ...currentUser, 
                            verificationStatus: 'pending' 
                        } 
                    });
                }
            },
        }),
        {
            name: 'auth-store',
        }
    )
);