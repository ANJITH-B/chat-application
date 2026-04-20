import { create } from "zustand";

interface LayoutState {
    isProfileOpen: boolean;
    setIsProfileOpen: (isProfileOpen: boolean) => void;
    isCallPannelOpen: boolean;
    setIsCallPannelOpen: (isCallPannelOpen: boolean) => void;
    isGroupCreationOpen: boolean;
    setIsGroupCreationOpen: (isGroupCreationOpen: boolean) => void;
    isGroupCreationPopupOpen: boolean;
    setIsGroupCreationPopupOpen: (isGroupCreationPopupOpen: boolean) => void;
    
    
}

export const useLayoutStore = create<LayoutState>((set) => ({
    isProfileOpen: false,
    setIsProfileOpen: (isProfileOpen: boolean) => set({ isProfileOpen }),
    isCallPannelOpen: false,
    setIsCallPannelOpen: (isCallPannelOpen: boolean) => set({ isCallPannelOpen}),
    isGroupCreationOpen: false,
    setIsGroupCreationOpen: (isGroupCreationOpen: boolean) => set({ isGroupCreationOpen}),
    isGroupCreationPopupOpen: false,
    setIsGroupCreationPopupOpen: (isGroupCreationPopupOpen: boolean) => set({ isGroupCreationPopupOpen}),
    // isGroupInfoOpen: false,
    // setIsGroupInfoOpen: (isGroupInfoOpen: boolean) => set({ isGroupInfoOpen}),
    
}));    