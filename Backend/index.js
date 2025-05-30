import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";


import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(cors({
  origin: process.env.ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server initialization
async function initServer() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL database");
    connection.release();

app.use(express.static(path.join(__dirname, 'client', 'dist')));

    // Routes
    app.use("/api/auth", authRoutes);

    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("MySQL connection failed:", error);
  }
}

initServer();
