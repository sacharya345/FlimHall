import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
}));

app.use(express.json({ limit: '1mb' }));

app.get("/", (req, res) => {
  res.send("Welcome to FlimHall API!");
});

app.use("/api", apiRoutes);
app.use(errorHandler);

export default app;