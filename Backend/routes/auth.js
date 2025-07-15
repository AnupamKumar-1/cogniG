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
      secure: true,       // set to true in production with HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24  // 24 hours
    }
  })
);

// 1.a) Stamp session creation time if new
router.use((req, res, next) => {
  if (!req.session.createdAt) {
    req.session.createdAt = Date.now();
  }
  next();
});

router.use(passport.initialize());
router.use(passport.session());

// 2) "Login with GitHub" entry-point
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// 3) GitHub callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    // Stamp session createdAt on first login
    req.session.createdAt = Date.now();

    res.redirect("https://cognig-backend.onrender.com/?login=success");
  }
);

// ✅ 4) Logout - fix cookie name and options
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    req.session.destroy(err => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ error: "Could not destroy session" });
      }

      res.clearCookie("sessionId", {
        httpOnly: true,
        sameSite: "none",  // allow cross-site
        secure: true       // must be HTTPS
      });

      res.status(200).json({ success: true });
    });
  });
});

// 5) helper to protect routes
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated" });
}

// 6) “Who am I?” endpoint
router.get("/me", ensureAuthenticated, (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Compute session age info
  const createdAt = req.session.createdAt || Date.now();
  const ageMs = Date.now() - createdAt;
  const ageSeconds = Math.floor(ageMs / 1000);
  const maxAge = req.session.cookie.maxAge;
  const expiresInSeconds = Math.max(
    0,
    Math.floor((maxAge - ageMs) / 1000)
  );

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
