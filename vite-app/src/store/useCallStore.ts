import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { useLayoutStore } from "./useLayoutStore";
import toast from "react-hot-toast";

const servers = {
    iceServers: [
        {
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
        },
    ],
};

interface CallState {
    callStatus: "idle" | "dialing" | "ringing" | "active";
    callType: "audio" | "video" | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    peerConnection: RTCPeerConnection | null;
    incomingCall: { from: any; offer: any; type: "audio" | "video" } | null;
    targetUser: any | null;
    isMuted: boolean;
    isVideoOff: boolean;

    startCall: (user: any, type: "audio" | "video") => Promise<void>;
    answerCall: () => Promise<void>;
    rejectCall: () => void;
    endCall: () => void;
    initCallListeners: () => void;
    toggleMute: () => void;
    toggleVideo: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
    callStatus: "idle",
    callType: null,
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    incomingCall: null,
    targetUser: null,
    isMuted: false,
    isVideoOff: false,

    initCallListeners: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("incoming-call");
        socket.off("call-answered");
        socket.off("ice-candidate");
        socket.off("call-rejected");
        socket.off("call-ended");

        socket.on("incoming-call", ({ from, offer, type }: { from: any, offer: any, type: "audio" | "video" }) => {
            console.log("Recieved incoming call from", from.username);
            useLayoutStore.getState().setIsCallPannelOpen(true);
            set({ incomingCall: { from, offer, type }, callStatus: "ringing" });
        });

        socket.on("call-answered", async ({ answer }: { answer: any }) => {
            const { peerConnection } = get();
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                set({ callStatus: "active" });
            }
        });

        socket.on("ice-candidate", async ({ candidate }: { candidate: any }) => {
            const { peerConnection } = get();
            if (peerConnection && candidate) {
                try {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error("Error adding ice candidate", e);
                }
            }
        });

        socket.on("call-rejected", () => {
            toast.error("Call rejected");
            get().endCall();
        });

        socket.on("call-ended", () => {
            get().endCall();
        });
    },

    startCall: async (user, type) => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === "video",
                audio: true,
            });

            const pc = new RTCPeerConnection(servers);
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", { to: user._id, candidate: event.candidate });
                }
            };

            pc.ontrack = (event) => {
                set({ remoteStream: event.streams[0] });
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("call-user", {
                to: user._id,
                offer,
                from: useAuthStore.getState().user,
                type,
            });

            useLayoutStore.getState().setIsCallPannelOpen(true);

            set({
                callStatus: "dialing",
                callType: type,
                localStream: stream,
                peerConnection: pc,
                targetUser: user,
            });
        } catch (error) {
            console.error("Error starting call", error);
            toast.error("Could not access camera/microphone");
        }
    },

    answerCall: async () => {
        const socket = useAuthStore.getState().socket;
        const { incomingCall } = get();
        if (!socket || !incomingCall) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: incomingCall.type === "video",
                audio: true,
            });

            const pc = new RTCPeerConnection(servers);
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", { to: incomingCall.from._id, candidate: event.candidate });
                }
            };

            pc.ontrack = (event) => {
                set({ remoteStream: event.streams[0] });
            };

            await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit("answer-call", { to: incomingCall.from._id, answer });

            set({
                callStatus: "active",
                callType: incomingCall.type,
                localStream: stream,
                peerConnection: pc,
                targetUser: incomingCall.from,
                incomingCall: null,
            });
        } catch (error) {
            console.error("Error answering call", error);
            toast.error("Could not access camera/microphone");
        }
    },

    rejectCall: () => {
        const socket = useAuthStore.getState().socket;
        const { incomingCall } = get();
        if (socket && incomingCall) {
            socket.emit("reject-call", { to: incomingCall.from._id });
        }
        set({ incomingCall: null, callStatus: "idle" });
    },

    endCall: () => {
        const socket = useAuthStore.getState().socket;
        const { localStream, peerConnection, targetUser, incomingCall } = get();

        const peerId = targetUser?._id || incomingCall?.from?._id;
        if (socket && peerId) {
            socket.emit("end-call", { to: peerId });
        }

        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        if (peerConnection) {
            peerConnection.close();
        }

        set({
            callStatus: "idle",
            callType: null,
            localStream: null,
            remoteStream: null,
            peerConnection: null,
            incomingCall: null,
            targetUser: null,
            isMuted: false,
            isVideoOff: false,
        });
    },

    toggleMute: () => {
        const { localStream, isMuted } = get();
        if (localStream) {
            localStream.getAudioTracks()[0].enabled = isMuted;
            set({ isMuted: !isMuted });
        }
    },

    toggleVideo: () => {
        const { localStream, isVideoOff } = get();
        if (localStream && localStream.getVideoTracks().length > 0) {
            localStream.getVideoTracks()[0].enabled = isVideoOff;
            set({ isVideoOff: !isVideoOff });
        }
    },
}));
