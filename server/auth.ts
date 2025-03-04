import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";

const SessionStore = MemoryStore(session);

export function setupAuth(app: Express) {
  // Session middleware
  app.use(
    session({
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: "your-secret-key", // In production, use environment variable
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Initialize Passport and restore authentication state from session
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const admin = await storage.getAdminByUsername(username);
        if (!admin) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, admin);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize admin to store in session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize admin from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const admin = await storage.getAdminByUsername(id.toString());
      done(null, admin);
    } catch (error) {
      done(error);
    }
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  return { isAuthenticated };
}
