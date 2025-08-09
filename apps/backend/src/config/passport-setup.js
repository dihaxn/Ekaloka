import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import userModel from '../models/userModel.js';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
        done(err, user);
    });
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/user/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        const existingUser = await userModel.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const newUser = await new userModel({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        }).save();
        done(null, newUser);
    }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/user/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
},
    async (accessToken, refreshToken, profile, done) => {
        const existingUser = await userModel.findOne({ facebookId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const newUser = await new userModel({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        }).save();
        done(null, newUser);
    }
));
