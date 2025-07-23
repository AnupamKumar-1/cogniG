import express from "express";
import configurePassport from "../config/passport.js";
import session from "express-session";

const router = express.Router();
const passport = configurePassport();

router.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

router.use((req, res, next) => {
  if (!req.session.createdAt) {
    req.session.createdAt = Date.now();
  }
  next();
});

router.use(passport.initialize());
router.use(passport.session());

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    req.session.createdAt = Date.now();
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

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated" });
}

router.get("/me", ensureAuthenticated, (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const createdAt = req.session.createdAt || Date.now();
  const ageMs = Date.now() - createdAt;
  const maxAge = req.session.cookie.maxAge;
  const ageSeconds = Math.floor(ageMs / 1000);
  const expiresInSeconds = Math.max(0, Math.floor((maxAge - ageMs) / 1000));

  res.json({
    user: req.user,
    session: {
      createdAt: new Date(createdAt).toISOString(),
      ageSeconds,
      expiresInSeconds
    }
  });
});

export default router;
