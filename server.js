import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // dozvoljava pozive sa React frontenda (Vite, port 5173)
app.use(express.json());
app.use(morgan("dev")); // logovanje HTTP zahteva u konzoli

// Health-check ruta
app.get("/", (_req, res) => {
  res.json({ message: "Blog Platforma API radi." });
});

// REST API rute
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/users", userRoutes);

// Globalni handler za nepostojeće rute
app.use((_req, res) => {
  res.status(404).json({ message: "Ruta nije pronađena" });
});

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
});

export default app;
