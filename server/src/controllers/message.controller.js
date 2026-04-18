import Message from "../modules/message.model.js";
import User from "../modules/user.model.js";
import { uploadOnCloudinary } from "../lib/cloudnairy.js";

export const getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(users);

    } catch (error) {
        console.log("error in getUsers",error.message);
        res.status(500).json({message: "Internal server error"});
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

        //todo : realtime functionality goes here => socket.io 

    } catch (error) {
        console.log("error in sendMessage", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}