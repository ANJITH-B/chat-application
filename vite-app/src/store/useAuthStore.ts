import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface AuthState {
    user: any; // You might want to define a User interface later
    isSignUp: boolean;
    isSignIn: boolean;
    isUpdatingProfile: boolean;
    isAuthChecking: boolean;
    checkAuthStatus: () => Promise<void>;
    signIn: (formData: any) => Promise<void>;
    signUp: (formData: any) => Promise<void>;
    googleAuth: () => void;
    githubAuth: () => void;
    updateProfile: (formData: any) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isSignUp: false,
    isSignIn: false,
    isUpdatingProfile: false, 

    isAuthChecking: true,
    checkAuthStatus: async () => {
        try {
            const response = await axiosInstance.get('/auth/check')
            if (response.data.success) {
                set({ user: response.data.user, isAuthChecking: false })
            } else {
                 set({ user: null, isAuthChecking: false })
            }
        } catch (error) {
            console.log(error)
            set({ user: null, isAuthChecking: false })
        }
    },

    signIn: async (formData: any) => {
        try {
            set({ isSignIn: true })
            const response = await axiosInstance.post('/auth/login', formData)
            if (response.data.success) {
                set({ user: response.data.user, isSignIn: false })
            } else {
                set({ user: null, isSignIn: false })
            }
        } catch (error: any) {
            console.log("Error in signIn:", error.response?.data || error.message)
            set({ user: null, isSignIn: false })
        }
    },

    signUp: async (formData: any) => {
        const {fullName, email, password} = formData
        try {
            set({ isSignUp: true })
            const response = await axiosInstance.post('/auth/register', {username: fullName, email, password} )
            if (response.data.success) {
                set({ user: response.data.user, isSignUp: false })
            } else {
                set({ user: null, isSignUp: false })
            }
        } catch (error: any) {
            console.log("Error in signUp:", error.response?.data || error.message)
            set({ user: null, isSignUp: false })
        }
    },

    updateProfile: async (formData: any) => {
        try {
            set({ isUpdatingProfile: true })
            const response = await axiosInstance.put('/auth/profile', formData)
            if (response.data.success) {
                set({ user: response.data.user, isUpdatingProfile: false })
            } else {
                set({ user: null, isUpdatingProfile: false })
            }
        } catch (error: any) {
            console.log("Error in updateProfile:", error.response?.data || error.message)
            set({ user: null, isUpdatingProfile: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            set({ user: null })
        } catch (error) {
            console.log(error)
        }
    },

    googleAuth: () => {
        window.location.href = "http://localhost:5001/api/auth/google";
    },

    githubAuth: () => {
        window.location.href = "http://localhost:5001/api/auth/github";
    }
    
}))
