import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../modules/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CLIENT_URL + "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.findOne({ email: profile.emails?.[0].value });
        
        if (user) {
            user.googleId = profile.id;
            if (!user.profilePic) user.profilePic = profile.photos?.[0]?.value;
            await user.save();
        } else {
            user = await User.create({
                googleId: profile.id,
                username: profile.displayName || profile.username || 'Google User',
                email: profile.emails?.[0]?.value,
                profilePic: profile.photos?.[0]?.value || ''
            });
        }
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CLIENT_URL + "/api/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
            const email = profile.emails?.[0]?.value;
            if (email) {
                user = await User.findOne({ email });
            }

            if (user) {
                user.githubId = profile.id;
                if (!user.profilePic) user.profilePic = profile.photos?.[0]?.value || profile._json?.avatar_url;
                await user.save();
            } else {
                user = await User.create({
                    githubId: profile.id,
                    username: profile.displayName || profile.username || 'GitHub User',
                    email: email || `${profile.id}@github.com`, 
                    profilePic: profile.photos?.[0]?.value || profile._json?.avatar_url || ''
                });
            }
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;