import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export interface User {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
    createdAt: string;
    updatedAt: string;
    lastMessage?: string;
    unreadCount?: number;
    isGroup?: boolean;
}

export interface Group {
    _id: string;
    name: string;
    description: string;
    image: string;
    members: string[];
    admin: string;
    lastMessage?: string;
    isGroup: boolean;
}

export interface Message {
    _id: string;
    senderId: any; // Can be object with username/profilePic after population
    receiverId?: string;
    groupId?: string;
    message?: string;
    image?: string;
    isSeen: boolean;
    createdAt: string;
}

interface ChatState {
    messages: Message[];
    users: User[];
    groups: Group[];
    selectedChat: User | Group | null;
    isUserLoading: boolean;
    isGroupLoading: boolean;
    isMessageLoading: boolean;
    getUsers: () => Promise<void>;
    getGroups: () => Promise<void>;
    getMessages: (id: string, isGroup?: boolean) => Promise<void>;
    setSelectedChat: (chat: User | Group | null) => void;
    sentMessage: (messageData: { message: string, image?: string | null }) => Promise<void>;
    markMessagesAsSeen: (userId: string) => Promise<void>;
    subscribeToMessages: () => void;
    unsubscribeFromMessages: () => void;
    selectedMembers: string[];
    toggleMember: (userId: string) => void;
    resetSelectedMembers: () => void;
    createGroup: (name: string, description: string, image: string, members: string[]) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    users: [],
    groups: [],
    selectedChat: null,
    selectedMembers: [],
    isUserLoading: false,
    isGroupLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch users');
        } finally {
            set({ isUserLoading: false });
        }
    },

    getGroups: async () => {
        set({ isGroupLoading: true });
        try {
            const res = await axiosInstance.get('/groups/all');
            set({ groups: res.data });
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch groups');
        } finally {
            set({ isGroupLoading: false });
        }
    },

    getMessages: async (id: string, isGroup = false) => {
        set({ isMessageLoading: true, messages: [] }); // Clear messages when loading new ones
        try {
            const url = isGroup ? `/groups/messages/${id}` : `/messages/${id}`;
            const res = await axiosInstance.get(url);
            set({ messages: res.data });
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch messages');
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sentMessage: async (messageData: { message: string, image?: string | null }) => {
        const { selectedChat, messages } = get();
        if (!selectedChat) return;
        
        try {
            const isGroup = 'isGroup' in selectedChat && selectedChat.isGroup;
            const url = isGroup ? `/groups/send/${selectedChat._id}` : `/messages/send/${selectedChat._id}`;
            const res = await axiosInstance.post(url, messageData);
            
            set({
                messages: [...messages, res.data]
            });
            
            // Optionally update the last message in the list
            if (isGroup) {
                set({
                    groups: get().groups.map(g => g._id === selectedChat._id ? { ...g, lastMessage: res.data.message } : g)
                });
            } else {
                set({
                    users: get().users.map(u => u._id === selectedChat._id ? { ...u, lastMessage: res.data.message } : u)
                });
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to send message');
        }
    },

    subscribeToMessages: () => {
        const { selectedChat } = get();
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on('newMessage', (newMessage: any) => {
            // Personal Message Handling
            set({
                users: get().users.map(u => u._id === newMessage.senderId ? { 
                    ...u, 
                    lastMessage: newMessage.message,
                    unreadCount: (u.unreadCount || 0) + (selectedChat?._id === newMessage.senderId ? 0 : 1)
                } : u)
            });

            if (selectedChat && !('isGroup' in selectedChat) && newMessage.senderId === selectedChat._id) {
                set({ messages: [...get().messages, newMessage] });
                get().markMessagesAsSeen(selectedChat._id);
            }
        });

        socket.on('newGroupMessage', (newMessage: any) => {
            // Group Message Handling
            set({
                groups: get().groups.map(g => g._id === newMessage.groupId ? { 
                    ...g, 
                    lastMessage: `${newMessage.senderId.username}: ${newMessage.message}`
                } : g)
            });

            if (selectedChat && 'isGroup' in selectedChat && selectedChat.isGroup && newMessage.groupId === selectedChat._id) {
                set({ messages: [...get().messages, newMessage] });
            }
        });

        socket.on('messagesSeen', ({ seenBy }: { seenBy: string }) => {
            const { selectedChat, messages } = get();
            if (selectedChat && !('isGroup' in selectedChat) && selectedChat._id === seenBy) {
                set({
                    messages: messages.map(m => m.receiverId === seenBy ? { ...m, isSeen: true } : m)
                });
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off('newMessage');
            socket.off('newGroupMessage');
            socket.off('messagesSeen');
        }
    },

    markMessagesAsSeen: async (userId: string) => {
        try {
            await axiosInstance.post(`/messages/seen/${userId}`);
            set({
                users: get().users.map(u => u._id === userId ? { ...u, unreadCount: 0 } : u)
            });
        } catch (error) {
            console.log("Error marking messages as seen:", error);
        }
    },

    setSelectedChat: (chat) => {
        set({ selectedChat: chat, messages: [] });
    },

    toggleMember: (userId: string) => {
        const { selectedMembers } = get();
        if (selectedMembers.includes(userId)) {
            set({ selectedMembers: selectedMembers.filter(id => id !== userId) });
        } else {
            set({ selectedMembers: [...selectedMembers, userId] });
        }
    },

    resetSelectedMembers: () => {
        set({ selectedMembers: [] });
    },

    createGroup: async (name: string, description: string, image: string, members: string[]) => {
        try {
            const res = await axiosInstance.post('/groups/create', { name, members, description, image });
            set({ groups: [...get().groups, res.data], selectedMembers: [] }); // Reset members after creation
        } catch (error) {
            console.log(error);
            toast.error('Failed to create group');
        }
    }
}))