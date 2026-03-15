import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/database.js";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import projectRoutes from "./routes/project.routes.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

/*
============================
FIX __dirname
============================
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
============================
STATIC FRONTEND
============================
*/

app.use(express.static(path.join(__dirname, "public")));

/*
============================
API ROUTES
============================
*/

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

/*
============================
PAGE ROUTES
============================
*/

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/dashboard.html"));
});

app.get("/projects", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/project.html"));
});

app.get("/tasks", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/task.html"));
});

/*
============================
SERVER
============================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
