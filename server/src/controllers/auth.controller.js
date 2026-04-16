import { generateToken } from "../lib/utils.js";
import User from "../modules/user.model.js";
import bcrypt from "bcryptjs";
import passport from "passport";
// import { cloudinaryConfig } from "../lib/cloudnairy.js";

export const register = async (req, res) => {
    const {username, email, password} = req.body;
   try {
     if(!username || !email || !password) return res.status(400).json({message: "All fields are required"});
     if(password.length < 6) return res.status(400).json({message: "Password must be at least 6 characters long"});

     const user = await User.findOne({email});
     if(user) return res.status(400).json({message: "User already exists"});

     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);

     const newUser = new User({
        username,
        email,
        password: hashedPassword
     })

     if(newUser){
         generateToken(newUser._id, res);
         await newUser.save();
        res.status(201).json({
            success: true,
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        });
     }else{
        res.status(400).json({message: "Invalid user data"});
     }
   } catch (error) {
    res.status(500).json({message: "Internal server error"});
    console.log("error in register",error.message);
   }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password) return res.status(400).json({message: "All fields are required"});
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "User not found"});
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return res.status(400).json({message: "Invalid password"});
        generateToken(user._id, res);
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic
            }
        });
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        console.log("error in login",error.message);
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        console.log("error in logout",error.message);
    }
}

export const updateProfilePicture = async (req, res) => {
    try {
        const {id} = req.params;
        const { profilePic } = req.body;
        const user = await User.findById(req.user._id).select("-password");
        if(!user) return res.status(400).json({message: "User not found"});
        if(!profilePic) return res.status(400).json({message: "Profile picture is required"});
        
        const upload = await uploadOnCloudinary(profilePic);
        if(!upload) return res.status(400).json({message: "Profile picture upload failed"});
        user.profilePic = upload.secure_url;
        await user.save();
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        console.log("error in update profile picture",error.message);
    }
}

export const check = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        console.log("error in check",error.message);
    }
}

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'], session: false })

export const googleAuthCallback = (req, res) => {
    generateToken(req.user._id, res);
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
}


export const githubAuth = passport.authenticate('github', { scope: ['profile', 'email'], session: false })

export const githubAuthCallback = (req, res) => {
    generateToken(req.user._id, res);
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
}