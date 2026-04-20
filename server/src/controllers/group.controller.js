import Group from "../modules/group.model.js";
import Message from "../modules/message.model.js";
import User from "../modules/user.model.js";
import { uploadOnCloudinary } from "../lib/cloudnairy.js";
import { io } from "../lib/socket.js";

export const createGroup = async (req, res) => {
    try {
        const { name, members, description, image: imageBase64 } = req.body;
        const admin = req.user._id;

        let imageUrl = "";
        if (imageBase64) {
            const upload = await uploadOnCloudinary(imageBase64);
            if (upload) imageUrl = upload.secure_url;
        }

        // Add admin to members if not already there
        const groupMembers = Array.isArray(members) ? members : (typeof members === 'string' ? JSON.parse(members) : []);
        if (!groupMembers.includes(admin.toString())) {
            groupMembers.push(admin.toString());
        }

        const newGroup = new Group({
            name,
            description,
            image: imageUrl,
            members: groupMembers,
            admin
        });

        await newGroup.save();
        res.status(201).json(newGroup);

    } catch (error) {
        console.log("error in createGroup", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ members: userId });

        const groupListWithLastMessage = await Promise.all(groups.map(async (group) => {
            const lastMessage = await Message.findOne({ groupId: group._id })
                .sort({ createdAt: -1 })
                .populate("senderId", "username");

            return {
                ...group.toObject(),
                lastMessage: lastMessage ? `${lastMessage.senderId.username}: ${lastMessage.message}` : "No messages yet",
                isGroup: true
            };
        }));

        res.status(200).json(groupListWithLastMessage);

    } catch (error) {
        console.log("error in getGroups", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const messages = await Message.find({ groupId }).populate("senderId", "username profilePic");
        res.status(200).json(messages);
    } catch (error) {
        console.log("error in getGroupMessages", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendGroupMessage = async (req, res) => {
    try {
        const { text, message, image: imageBase64 } = req.body;
        const { groupId } = req.params;
        const senderId = req.user._id;

        let content = message || text;
        let imageUrl = "";

        if (imageBase64) {
            const upload = await uploadOnCloudinary(imageBase64);
            if (upload) imageUrl = upload.secure_url;
        }

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        const newMessage = new Message({
            senderId,
            groupId,
            message: content || "",
            image: imageUrl
        });

        await newMessage.save();
        const populatedMessage = await newMessage.populate("senderId", "username profilePic");
        
        res.status(201).json(populatedMessage);

        // Broadcast to all members of the group
        group.members.forEach(memberId => {
            // We'll handle socket emission in a way that avoids sending to the sender if needed, 
            // but usually we emit to the group "room"
            io.to(`group_${groupId}`).emit("newGroupMessage", populatedMessage);
        });

    } catch (error) {
        console.log("error in sendGroupMessage", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
