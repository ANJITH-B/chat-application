import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from 'socket.io-client'

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
    socket: any;
    connectSocket: () => void;
    disconnectSocket: () => void;
    onlineUsers: string[];
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isSignUp: false,
    isSignIn: false,
    isUpdatingProfile: false, 
    isAuthChecking: true,
    socket: null,
    onlineUsers: [],

    checkAuthStatus: async () => {
        try {
            const response = await axiosInstance.get('/auth/check')
            if (response.data.success) {
                set({ user: response.data.user, isAuthChecking: false })
            } else {
                 set({ user: null, isAuthChecking: false })
            }
            get().connectSocket()
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
                get().connectSocket()
                toast.success('Logged in successfully');
            } else {
                set({ user: null, isSignIn: false })
                toast.error(response.data.message || 'Failed to log in');
            }
        } catch (error: any) {
            console.log("Error in signIn:", error.response?.data || error.message)
            set({ user: null, isSignIn: false })
            toast.error(error.response?.data.message || 'Failed to log in');
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
            get().connectSocket()
            toast.success('User created successfully');
        } catch (error: any) {
            console.log("Error in signUp:", error.response?.data || error.message)
            set({ user: null, isSignUp: false })
            toast.error(error.response?.data.message || 'Failed to create user');
        }
    },

    updateProfile: async (formData: any) => {
        try {
            set({ isUpdatingProfile: true })
            const response = await axiosInstance.put('/auth/profile', formData)
            if (response.data.success) {
                set({ user: response.data.user, isUpdatingProfile: false })
                toast.success('Profile updated successfully');
            } else {
                set({ user: null, isUpdatingProfile: false })
            }
        } catch (error: any) {
            console.log("Error in updateProfile:", error.response?.data || error.message)
            set({ user: null, isUpdatingProfile: false })
            toast.error(error.response?.data.message || 'Failed to update profile');
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            set({ user: null })
            get().disconnectSocket()
            toast.success('Logged out successfully');
        } catch (error) {
            console.log(error)
            toast.error('Failed to log out');
        }
    },

    googleAuth: () => {
        window.location.href = `${API_URL}/api/auth/google`;
        toast.success('Google authentication started');
    },

    githubAuth: () => {
        window.location.href = `${API_URL}/api/auth/github`;
        toast.success('Github authentication started');
    },

    connectSocket: () => {
        const {user} = get()
        if(!user || get().socket?.connected) return;
        const socket = io(API_URL, {
            withCredentials: true,
            query: {
                userId: user._id
            }
        })
        socket.connect();
        set({ socket })
        socket.on("getOnlineUsers", (usersIds) => {
            set({ onlineUsers: usersIds });
        })
    },

    disconnectSocket: () => {
        const {socket} = get()
        if(socket) {
            socket.disconnect();
            set({ socket: null })
        }
    }
    
}))
