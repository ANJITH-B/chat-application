import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() { return !this.googleId && !this.githubId; }, // Required only if not an OAuth user
        minlength: 6
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true 
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true
    },
    profilePic: {
        type: String,
        default: ""
    },
}, { timestamps: true }
)

const User = mongoose.model("User", userSchema);

export default User;