// /Backend/config/passport.js
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

export default function configurePassport() {
  // how we serialize the user into the session
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  passport.use(new GitHubStrategy({
      clientID:     process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:  process.env.GITHUB_CALLBACK_URL  // e.g. http://localhost:8080/auth/github/callback
    },
    (accessToken, refreshToken, profile, done) => {
      // here you could find/create a User in your DB
      return done(null, profile);
    }
  ));

  return passport;
}
