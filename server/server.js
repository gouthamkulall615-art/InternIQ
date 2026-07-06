import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import analyzerRoutes from './routes/analyzerRoutes.js';
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import configurePassport from "./config/passport.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

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
