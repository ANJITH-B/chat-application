import express from 'express'
import { register, login, logout, updateProfilePicture, check, googleAuth, googleAuthCallback, githubAuth, githubAuthCallback } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import passport from 'passport';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/logout', logout);

router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { session: false }), googleAuthCallback);

router.get('/github', githubAuth);
router.get('/github/callback', passport.authenticate('github', { session: false }), githubAuthCallback);

router.put("/update/:id", protectRoute, updateProfilePicture);
router.get("/check", protectRoute, check);

export default router