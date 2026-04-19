import Message from "../modules/message.model.js";
import User from "../modules/user.model.js";
import { uploadOnCloudinary } from "../lib/cloudnairy.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        const userListWithLastMessage = await Promise.all(users.map(async (user) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: loggedInUserId, receiverId: user._id },
                    { senderId: user._id, receiverId: loggedInUserId }
                ]
            }).sort({ createdAt: -1 });

            const unreadCount = await Message.countDocuments({
                senderId: user._id,
                receiverId: loggedInUserId,
                isSeen: false
            });

            return {
                ...user.toObject(),
                lastMessage: lastMessage ? lastMessage.message : "",
                unreadCount
            };
        }));

        res.status(200).json(userListWithLastMessage);

    } catch (error) {
        console.log("error in getUsers", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId, receiverId}, 
                {senderId: receiverId, receiverId: senderId}
            ]
        });
        res.status(200).json(messages);
        
    } catch (error) {
        console.log("error in getMessages",error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, message, image: imageBase64 } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Use 'text' from frontend if 'message' is not provided
        let content = message || text;
        let imageUrl = "";

        if (imageBase64) {
            const upload = await uploadOnCloudinary(imageBase64);
            if (!upload) return res.status(400).json({ message: "Image upload failed" });
            imageUrl = upload.secure_url;
        }

        const user = await User.findById(receiverId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Require at least text or an image
        if (!content && !imageUrl) {
            return res.status(400).json({ message: "Message text or image is required" });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message: content || "", // Still provide empty string if only image
            image: imageUrl
        });

        await newMessage.save();
        res.status(201).json(newMessage);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage);

    } catch (error) {
        console.log("error in sendMessage", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const markMessagesAsSeen = async (req, res) => {
    try {
        const { id: senderId } = req.params;
        const receiverId = req.user._id;

        await Message.updateMany(
            { senderId, receiverId, isSeen: false },
            { isSeen: true }
        );

        // Notify the sender that their messages were seen
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messagesSeen", { seenBy: receiverId });
        }

        res.status(200).json({ message: "Messages marked as seen" });
    } catch (error) {
        console.log("error in markMessagesAsSeen", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}