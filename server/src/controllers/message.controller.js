import Message from "../modules/message.model.js";
import User from "../modules/user.model.js";

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
        const {message, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        if(image){
            const upload = await uploadOnCloudinary(image);
            if(!upload) return res.status(400).json({message: "Image upload failed"});
            image = upload.secure_url;
        }

        const user = await User.findById(receiverId);

        if(!user) return res.status(404).json({message: "User not found"});
        if(!message) return res.status(400).json({message: "Message is required"});

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            image
        });

        await newMessage.save();
        res.status(201).json(newMessage);   

        //todo : realtime functinality goes here => socket.io 

    } catch (error) {
        console.log("error in sendMessage",error.message);
        res.status(500).json({message: "Internal server error"});
    }
}