import { create } from "zustand";
import { Device } from "mediasoup-client";
import { useAuthStore } from "./useAuthStore";
import { useLayoutStore } from "./useLayoutStore";
import toast from "react-hot-toast";

interface Participant {
    userId: string;
    stream: MediaStream;
}

interface GroupCallState {
    device: Device | null;
    sendTransport: any | null;
    recvTransport: any | null;
    producers: Map<string, any>;
    consumers: Map<string, any>;
    participants: Map<string, Participant>;
    isGroupCallActive: boolean;
    localStream: MediaStream | null;
    
    joinGroupCall: (groupId: string) => Promise<void>;
    leaveGroupCall: () => void;
    produceMedia: (groupId: string, type: "audio" | "video") => Promise<void>;
    consumeMedia: (groupId: string, producerInfo: { producerId: string, userId: string, kind: string }) => Promise<void>;
}

export const useGroupCallStore = create<GroupCallState>((set, get) => ({
    device: null,
    sendTransport: null,
    recvTransport: null,
    producers: new Map(),
    consumers: new Map(),
    participants: new Map(),
    isGroupCallActive: false,
    localStream: null,

    joinGroupCall: async (groupId) => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        try {
            // 1. Join room and get router capabilities
            const response: any = await new Promise((resolve) => {
                socket.emit("join-group-call", { groupId }, resolve);
            });

            if (response.error) throw new Error(response.error);
            const { rtpCapabilities, existingProducers } = response;

            // 2. Initialize MediaSoup Device
            const device = new Device();
            await device.load({ routerRtpCapabilities: rtpCapabilities });
            set({ device, isGroupCallActive: true });

            // 3. Create Send Transport
            const sendParams: any = await new Promise((resolve) => {
                socket.emit("create-webrtc-transport", { groupId }, resolve);
            });

            const sendTransport = device.createSendTransport(sendParams);
            sendTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
                socket.emit("connect-webrtc-transport", { groupId, transportId: sendTransport.id, dtlsParameters }, (res: any) => {
                    if (res?.error) errback(res.error);
                    else callback();
                });
            });

            sendTransport.on("produce", ({ kind, rtpParameters }, callback, errback) => {
                socket.emit("produce", { groupId, transportId: sendTransport.id, kind, rtpParameters }, (res: any) => {
                    if (res?.error) errback(res.error);
                    else callback({ id: res.id });
                });
            });

            set({ sendTransport });

            // 4. Create Receive Transport
            const recvParams: any = await new Promise((resolve) => {
                socket.emit("create-webrtc-transport", { groupId }, resolve);
            });

            const recvTransport = device.createRecvTransport(recvParams);
            recvTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
                socket.emit("connect-webrtc-transport", { groupId, transportId: recvTransport.id, dtlsParameters }, (res: any) => {
                    if (res?.error) errback(res.error);
                    else callback();
                });
            });

            set({ recvTransport });

            // 5. Handle existing producers
            for (const producerInfo of existingProducers) {
                await get().consumeMedia(groupId, producerInfo);
            }

            // 6. Listen for new producers
            socket.off("new-producer");
            socket.on("new-producer", async (producerInfo: { producerId: string, userId: string, kind: string }) => {
                await get().consumeMedia(groupId, producerInfo);
            });

            socket.off("participant-left");
            socket.on("participant-left", ({ userId }: { userId: string }) => {
                const { participants } = get();
                const newParticipants = new Map(participants);
                newParticipants.delete(userId);
                set({ participants: newParticipants });
            });

            useLayoutStore.getState().setIsCallPannelOpen(true);
        } catch (error: any) {
            console.error("joinGroupCall failed:", error);
            toast.error(error.message || "Failed to join group call");
        }
    },

    consumeMedia: async (groupId, { producerId, userId }) => {
        const { device, recvTransport, participants } = get();
        const socket = useAuthStore.getState().socket;
        if (!device || !recvTransport || !socket) return;

        const consumeData: any = await new Promise((resolve) => {
            socket.emit("consume", { 
                groupId, 
                transportId: recvTransport.id, 
                producerId, 
                rtpCapabilities: device.rtpCapabilities 
            }, resolve);
        });

        if (consumeData.error) return console.error("consume error:", consumeData.error);

        const consumer = await recvTransport.consume(consumeData);
        socket.emit("resume-consumer", { groupId, consumerId: consumer.id }, () => {});

        const { track } = consumer;
        let participant = participants.get(userId);

        if (!participant) {
            participant = { userId, stream: new MediaStream() };
        }

        participant.stream.addTrack(track);
        
        const newParticipants = new Map(participants);
        newParticipants.set(userId, participant);
        set({ participants: newParticipants });

        consumer.on("transportclose", () => {
            const currentParticipants = new Map(get().participants);
            currentParticipants.delete(userId);
            set({ participants: currentParticipants });
        });
    },

    produceMedia: async (groupId, type) => {
        const { sendTransport, producers } = get();
        if (!sendTransport) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === "video",
                audio: true,
            });

            set({ localStream: stream });

            const audioTrack = stream.getAudioTracks()[0];
            const videoTrack = type === "video" ? stream.getVideoTracks()[0] : null;

            if (audioTrack) {
                const audioProducer = await sendTransport.produce({ track: audioTrack });
                producers.set("audio", audioProducer);
            }

            if (videoTrack) {
                const videoProducer = await sendTransport.produce({ track: videoTrack });
                producers.set("video", videoProducer);
            }

            set({ producers: new Map(producers) });
        } catch (error) {
            console.error("produceMedia failed:", error);
            toast.error("Failed to access camera/microphone");
        }
    },

    leaveGroupCall: () => {
        const socket = useAuthStore.getState().socket;
        // In a real app we'd need to know which room to leave if multiple room support existed
        // for now we'll clean up everything active.
        if (socket) {
            socket.emit("leave-group-call", { groupId: "current" }); // Placeholder for actual ID tracking if needed
            socket.off("new-producer");
            socket.off("participant-left");
        }

        const { sendTransport, recvTransport, localStream } = get();
        if (sendTransport) sendTransport.close();
        if (recvTransport) recvTransport.close();
        if (localStream) localStream.getTracks().forEach(t => t.stop());

        set({
            device: null,
            sendTransport: null,
            recvTransport: null,
            producers: new Map(),
            consumers: new Map(),
            participants: new Map(),
            isGroupCallActive: false,
            localStream: null,
        });

        useLayoutStore.getState().setIsCallPannelOpen(false);
    }
}));
