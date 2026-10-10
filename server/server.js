import 'dotenv/config'; // reloaded env
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import analyzerRoutes from './routes/analyzerRoutes.js';

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import configurePassport from "./config/passport.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Allow both local dev and production frontend to talk to this backend
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/+$/, '') : null;
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  clientUrl,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like server-to-server, curl, Postman)
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (
      allowedOrigins.includes(normalizedOrigin) ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

// Maintenance mode middleware: return HTTP 503 when maintenance flag is true
app.use((_req, res, next) => {
  if (process.env.VITE_MAINTENANCE_MODE === 'true' || process.env.MAINTENANCE_MODE === 'true') {
    return res.status(503).json({ message: "Under maintenance" });
  }
  next();
});

// Initialize Passport (no sessions — we use JWT)
configurePassport();
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analyzer', analyzerRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "InternIQ API is running" });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});