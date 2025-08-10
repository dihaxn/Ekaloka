import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import userModel from '../models/userModel.js';

const googleClientID = process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "dummy-google-client-secret";
const facebookAppID = process.env.FACEBOOK_APP_ID || "dummy-facebook-app-id";
const facebookAppSecret = process.env.FACEBOOK_APP_SECRET || "dummy-facebook-app-secret";

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
    clientID: googleClientID,
    clientSecret: googleClientSecret,
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
    clientID: facebookAppID,
    clientSecret: facebookAppSecret,
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
