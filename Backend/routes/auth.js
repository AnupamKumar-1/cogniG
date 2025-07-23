import express from "express";
import passport from "passport";          // now importing the singleton
import configurePassport from "../config/passport.js";

const router = express.Router();
configurePassport();  // bootstraps passport strategies

// Redirect user to GitHub for login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub will redirect to this URL after approval
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    // upon successful login, redirect back to your frontend
    res.redirect("https://cognig.onrender.com/?login=success");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(err => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ error: "Could not destroy session" });
      }
      res.clearCookie("sessionId", {
        httpOnly: true,
        sameSite: "none",
        secure: true
      });
      res.status(200).json({ success: true });
    });
  });
});

// Middleware to protect routes
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated" });
}

router.get("/me", ensureAuthenticated, (req, res) => {
  const createdAt = req.session.createdAt || Date.now();
  const ageMs = Date.now() - createdAt;
  const maxAge = req.session.cookie.maxAge;
  const expiresInSeconds = Math.max(0, Math.floor((maxAge - ageMs) / 1000));

  res.json({
    user: req.user,
    session: {
      createdAt: new Date(createdAt).toISOString(),
      ageSeconds: Math.floor(ageMs/1000),
      expiresInSeconds
    }
  });
});

export default router;
