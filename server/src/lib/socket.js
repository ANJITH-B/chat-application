import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

import { getWorker, createTransport, getRouterConfig } from "./mediasoup.js";

// Memory storage for group call state
const rooms = {}; // { groupId: { router, participants: { userId: { transports: Map, producers: Map, consumers: Map } } } }

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}

const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    const userId = socket.handshake.query.userId;
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        // Cleanup user from any active group calls
        for (const groupId in rooms) {
            if (rooms[groupId].participants[userId]) {
                const participant = rooms[groupId].participants[userId];
                participant.transports.forEach(t => t.close());
                participant.producers.forEach(p => p.close());
                participant.consumers.forEach(c => c.close());
                delete rooms[groupId].participants[userId];
                
                socket.to(groupId).emit("participant-left", { userId });
            }
        }
    })

    // WebRTC Signaling (1-to-1)
    socket.on("call-user", ({ to, offer, from, type }) => {
        console.log("calling user", to);
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("incoming-call", { from, offer, type });
        }
    });

    socket.on("answer-call", ({ to, answer }) => {
        console.log("answering call", to);
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call-answered", { answer });
        }
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("ice-candidate", { candidate });
        }
    });

    socket.on("reject-call", ({ to }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call-rejected");
        }
    });

    socket.on("end-call", ({ to }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call-ended");
        }
    });

    // Mediasoup SFU Signaling (Group Calls)
    socket.on("join-group-call", async ({ groupId }, callback) => {
        try {
            socket.join(groupId);

            if (!rooms[groupId]) {
                const router = await getWorker().createRouter({ mediaCodecs: getRouterConfig().mediaCodecs });
                rooms[groupId] = { router, participants: {} };
            }

            const { router } = rooms[groupId];
            
            if (!rooms[groupId].participants[userId]) {
                rooms[groupId].participants[userId] = { transports: new Map(), producers: new Map(), consumers: new Map() };
            }

            // Get existing producers to inform the new participant
            const existingProducers = [];
            for (const otherUserId in rooms[groupId].participants) {
                if (otherUserId !== userId) {
                    rooms[groupId].participants[otherUserId].producers.forEach(p => {
                        existingProducers.push({ producerId: p.id, userId: otherUserId, kind: p.kind });
                    });
                }
            }

            callback({ rtpCapabilities: router.rtpCapabilities, existingProducers });
        } catch (error) {
            console.error("join-group-call error:", error);
            callback({ error: error.message });
        }
    });

    socket.on("create-webrtc-transport", async ({ groupId }, callback) => {
        try {
            const { router } = rooms[groupId];
            const { transport, params } = await createTransport(router);
            
            rooms[groupId].participants[userId].transports.set(transport.id, transport);
            
            callback(params);
        } catch (error) {
            console.error("create-webrtc-transport error:", error);
            callback({ error: error.message });
        }
    });

    socket.on("connect-webrtc-transport", async ({ groupId, transportId, dtlsParameters }, callback) => {
        try {
            const transport = rooms[groupId].participants[userId].transports.get(transportId);
            await transport.connect({ dtlsParameters });
            callback();
        } catch (error) {
            console.error("connect-webrtc-transport error:", error);
            callback({ error: error.message });
        }
    });

    socket.on("produce", async ({ groupId, transportId, kind, rtpParameters }, callback) => {
        try {
            const transport = rooms[groupId].participants[userId].transports.get(transportId);
            const producer = await transport.produce({ kind, rtpParameters });
            
            rooms[groupId].participants[userId].producers.set(producer.id, producer);

            // Notify others in the room
            socket.to(groupId).emit("new-producer", { producerId: producer.id, userId, kind });
            
            callback({ id: producer.id });
        } catch (error) {
            console.error("produce error:", error);
            callback({ error: error.message });
        }
    });

    socket.on("consume", async ({ groupId, transportId, producerId, rtpCapabilities }, callback) => {
        try {
            const { router } = rooms[groupId];
            const transport = rooms[groupId].participants[userId].transports.get(transportId);

            if (!router.canConsume({ producerId, rtpCapabilities })) {
                return callback({ error: "Cannot consume" });
            }

            const consumer = await transport.consume({
                producerId,
                rtpCapabilities,
                paused: true,
            });

            rooms[groupId].participants[userId].consumers.set(consumer.id, consumer);

            callback({
                id: consumer.id,
                producerId,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
            });
        } catch (error) {
            console.error("consume error:", error);
            callback({ error: error.message });
        }
    });

    socket.on("resume-consumer", async ({ groupId, consumerId }, callback) => {
        try {
            const consumer = rooms[groupId].participants[userId].consumers.get(consumerId);
            if (consumer) {
                await consumer.resume();
                callback();
            }
        } catch (error) {
            callback({ error: error.message });
        }
    });

    socket.on("leave-group-call", ({ groupId }) => {
        if (rooms[groupId] && rooms[groupId].participants[userId]) {
            const participant = rooms[groupId].participants[userId];
            participant.transports.forEach(t => t.close());
            participant.producers.forEach(p => p.close());
            participant.consumers.forEach(c => c.close());
            delete rooms[groupId].participants[userId];
            
            socket.leave(groupId);
            socket.to(groupId).emit("participant-left", { userId });
        }
    });
})

export { server, io , app , getReceiverSocketId}